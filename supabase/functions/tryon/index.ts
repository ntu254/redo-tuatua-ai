import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { withCreditCheck, CreditError } from "../_shared/credits.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-supabase-auth-referer",
};

const KLING_BASE_URL = "https://api-singapore.klingai.com";

function cleanBase64(base64: string): string {
  if (base64.startsWith("data:")) {
    const commaIndex = base64.indexOf(",");
    if (commaIndex !== -1) {
      return base64.slice(commaIndex + 1);
    }
  }
  return base64;
}

function base64UrlEncode(data: Uint8Array): string {
  let binary = "";
  for (const byte of data) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function generateKlingJwt(ak: string, sk: string): Promise<string> {
  const encoder = new TextEncoder();

  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const payload = { iss: ak, exp: now + 1800, nbf: now - 5 };

  const headerB64 = base64UrlEncode(encoder.encode(JSON.stringify(header)));
  const payloadB64 = base64UrlEncode(encoder.encode(JSON.stringify(payload)));
  const signingInput = `${headerB64}.${payloadB64}`;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(sk),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );

  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(signingInput));
  const signatureB64 = base64UrlEncode(new Uint8Array(signature));

  return `${signingInput}.${signatureB64}`;
}

function isKeyValid(value: string | undefined): boolean {
  return !!value && value !== "YOUR_KLING_KEY" && !value.startsWith("mock_") && value.length > 5;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { action, human_image, cloth_image, task_id } = await req.json();

    const klingAccessKey = Deno.env.get("KLING_ACCESS_KEY");
    const klingSecretKey = Deno.env.get("KLING_SECRET_KEY");

    const useMock = !isKeyValid(klingAccessKey) || !isKeyValid(klingSecretKey);

    // If keys are not configured, fall back to mock trial mode
    if (useMock) {
      if (action === "create") {
        if (!human_image || !cloth_image) {
          throw new Error("Missing human_image or cloth_image");
        }
        const result = await withCreditCheck(supabase, user.id, "tryon", "kolors-virtual-try-on", async () => {
          return {
            task_id: "mock_task_" + Math.random().toString(36).substring(2, 11),
            task_status: "submitted",
            created_at: Date.now(),
            updated_at: Date.now(),
          };
        }, 2);

        return new Response(JSON.stringify({ success: true, data: result }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

      } else if (action === "status") {
        if (!task_id) throw new Error("Missing task_id");

        const mockImages = [
          "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
          "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
          "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
          "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
        ];
        const selectedImg = mockImages[Math.abs(task_id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)) % mockImages.length];

        return new Response(JSON.stringify({
          success: true,
          data: {
            task_id,
            task_status: "succeed",
            task_status_msg: "succeed",
            task_result: {
              images: [
                { index: 0, url: selectedImg },
              ],
            },
          },
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } else {
        throw new Error(`Unknown action: ${action}`);
      }
    }

    // Actual Kling API flow with JWT auth
    const token = await generateKlingJwt(klingAccessKey!, klingSecretKey!);

    if (action === "create") {
      if (!human_image || !cloth_image) {
        throw new Error("Missing human_image or cloth_image");
      }

      const result = await withCreditCheck(supabase, user.id, "tryon", "kolors-virtual-try-on", async () => {
        const payload = {
          model_name: "kolors-virtual-try-on-v1-5",
          human_image: cleanBase64(human_image),
          cloth_image: cleanBase64(cloth_image),
        };

        const resp = await fetch(`${KLING_BASE_URL}/v1/images/kolors-virtual-try-on`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!resp.ok) {
          const errText = await resp.text();
          throw new Error(`Kling API Error (status ${resp.status}): ${errText}`);
        }

        const data = await resp.json();
        if (data.code !== 0) {
          throw new Error(`Kling API returned code ${data.code}: ${data.message}`);
        }

        return data.data;
      }, 2);

      return new Response(JSON.stringify({ success: true, data: result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "status") {
      if (!task_id) throw new Error("Missing task_id");

      const resp = await fetch(`${KLING_BASE_URL}/v1/images/kolors-virtual-try-on/${task_id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`Kling Status API Error (status ${resp.status}): ${errText}`);
      }

      const data = await resp.json();
      if (data.code !== 0) {
        throw new Error(`Kling API returned code ${data.code}: ${data.message}`);
      }

      return new Response(JSON.stringify({ success: true, data: data.data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else {
      throw new Error(`Unknown action: ${action}`);
    }

  } catch (err) {
    const status = err instanceof CreditError ? 402 : 400;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

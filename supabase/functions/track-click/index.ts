import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, apikey, x-supabase-auth-referer",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    let productId: string | null = null;
    let outfitId: string | null = null;
    let userId: string | null = null;

    if (req.method === "POST") {
      const body = await req.json();
      productId = body.product_id || body.productId;
      outfitId = body.outfit_id || body.outfitId;
      userId = body.user_id || body.userId;
    } else {
      const url = new URL(req.url);
      productId = url.searchParams.get("product_id") || url.searchParams.get("productId");
      outfitId = url.searchParams.get("outfit_id") || url.searchParams.get("outfitId");
      userId = url.searchParams.get("user_id") || url.searchParams.get("userId");
    }

    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "";
    const userAgent = req.headers.get("user-agent") || "";

    if (!productId) throw new Error("Missing product_id");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Record click
    await supabase.from("clicks").insert({
      user_id: userId || null,
      product_id: productId,
      outfit_id: outfitId || null,
      source: "affiliate",
      ip_address: ipAddress,
      user_agent: userAgent.slice(0, 500),
    });

    // Get affiliate URL
    const { data: product } = await supabase
      .from("products")
      .select("affiliate_url")
      .eq("id", productId)
      .single();

    const affiliateUrl = product?.affiliate_url;

    // POST = API call (return JSON), GET = redirect
    if (req.method === "POST") {
      return new Response(JSON.stringify({ tracked: true, affiliate_url: affiliateUrl }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (affiliateUrl) {
      return Response.redirect(affiliateUrl, 302);
    }

    return new Response(JSON.stringify({ error: "Product not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

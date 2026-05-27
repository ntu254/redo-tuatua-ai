import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateJson } from "../_shared/gemini.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { prompt, style, season, occasion } = await req.json();

    const systemPrompt = `Tạo outfit dựa trên yêu cầu. Trả JSON array:
[{
  "title": "tên outfit",
  "emoji": "emoji",
  "style": "Casual|Streetwear|Office|Party|Minimal|K-Fashion|Boho",
  "styleTags": ["tag"],
  "aiComment": "mô tả tiếng Việt",
  "totalPrice": "VND",
  "matchScore": 0-100,
  "season": "spring|summer|fall|winter|all_year",
  "occasion": "office|casual|party|hangout|date",
  "mood": "tiếng Việt",
  "products": [{"name": "", "price": "", "platform": "Shopee|Lazada|Tiki|Zalora", "badge": null, "rating": 0-5, "sold": "", "brand": ""}],
  "personalization": ["câu cá nhân hóa"],
  "aiConfidence": [{"label": "yếu tố", "positive": true/false}]
}]`;

    const userPrompt = `Prompt: "${prompt}"${style ? `\nStyle: ${style}` : ""}${season ? `\nSeason: ${season}` : ""}${occasion ? `\nOccasion: ${occasion}` : ""}`;

    const outfits = await generateJson<any[]>(userPrompt, systemPrompt);

    return new Response(JSON.stringify(outfits.slice(0, 4)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

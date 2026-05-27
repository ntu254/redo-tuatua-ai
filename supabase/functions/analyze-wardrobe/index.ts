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

    const { items } = await req.json();
    if (!items || !items.length) throw new Error("No wardrobe items provided");

    const systemPrompt = `Bạn là chuyên gia phân tích tủ đồ. Phân tích danh sách items và trả về JSON:
{
  "totalItems": number,
  "topCategory": "danh mục nhiều nhất",
  "topColor": "màu phổ biến nhất",
  "topStyle": "phong cách chủ đạo",
  "colorPalette": [{"color": "tên màu", "count": số, "label": "nhãn"}],
  "categoryDistribution": [{"category": "danh mục", "count": số}],
  "styleDistribution": [{"style": "phong cách", "count": số}],
  "seasonBreakdown": [{"season": "mùa", "count": số}],
  "consistencyScore": số 0-100,
  "dominantStyles": ["style chính"],
  "missingEssentials": ["item cần bổ sung"]
}
Chỉ trả JSON.`;

    const userPrompt = `Danh sách items:\n${JSON.stringify(items, null, 2)}`;

    const analysis = await generateJson<any>(userPrompt, systemPrompt);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

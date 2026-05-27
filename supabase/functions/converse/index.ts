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
    if (!authHeader) throw new Error("Missing Authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { message, history } = await req.json();
    if (!message) throw new Error("Missing message");

    const systemPrompt = `Bạn là stylist AI của Redo, app thời trang Việt Nam. 
Phân tích yêu cầu của user và trả về JSON:
{
  "reply": "câu trả lời tự nhiên bằng tiếng Việt",
  "outfits": [{
    "title": "tên outfit",
    "emoji": "emoji phù hợp",
    "style": "Casual|Streetwear|Office|Party|Minimal|K-Fashion|Boho",
    "styleTags": ["tag1", "tag2"],
    "aiComment": "mô tả ngắn bằng tiếng Việt",
    "totalPrice": "giá dạng VND",
    "matchScore": số 0-100,
    "season": "spring|summer|fall|winter|all_year",
    "occasion": "office|casual|party|hangout|date",
    "mood": "từ 1-2 từ tiếng Việt",
    "products": [{
      "name": "tên sản phẩm",
      "price": "giá VND",
      "platform": "Shopee|Lazada|Tiki|Zalora",
      "badge": "giảm giá hoặc null",
      "rating": số 0-5,
      "sold": "số lượng đã bán dạng text",
      "brand": "thương hiệu"
    }],
    "personalization": ["câu cá nhân hóa"],
    "aiConfidence": [{"label": "yếu tố", "positive": true/false}]
  }],
  "suggestions": [{"label": "nút gợi ý", "prompt": "câu prompt tương ứng"}]
}
Trả về 2-4 outfits. Giá tiền theo VND thực tế.`;

    const userPrompt = `Tin nhắn user: "${message}"
${history?.length ? `Lịch sử: ${JSON.stringify(history)}` : ""}
Hãy tạo outfit phù hợp.`;

    const result = await generateJson<{
      reply: string;
      outfits: any[];
      suggestions: { label: string; prompt: string }[];
    }>(userPrompt, systemPrompt);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

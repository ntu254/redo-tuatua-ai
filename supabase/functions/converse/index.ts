import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { generateJson } from "../_shared/gemini.ts";
import { withCreditCheck, CreditError } from "../_shared/credits.ts";
import { createEmbedding } from "../_shared/embedding.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info, x-supabase-auth-referer",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Missing Authorization header");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { message, history } = await req.json();
    if (!message) throw new Error("Missing message");

    // 1. RAG: Retrieve similar products from database using vector search
    let retrievedProducts: any[] = [];
    try {
      const embedding = await createEmbedding(message);
      const { data: matched } = await supabase.rpc("search_products", {
        query_embedding: embedding,
        match_count: 12,
      });
      if (matched) {
        retrievedProducts = matched;
      }
    } catch (err) {
      console.error("RAG Product retrieval failed:", err);
    }

    const productsContext = retrievedProducts.map((p) => {
      const brand = p.metadata?.brand || "";
      const platform = p.affiliate_url?.includes("shopee.vn") ? "Shopee" : "TikTok Shop";
      return `- ID: ${p.id}
  Name: ${p.name}
  Description: ${p.description || ""}
  Price: ${Number(p.price).toLocaleString('vi-VN')}đ
  Platform: ${platform}
  Brand: ${brand}
  Image: ${p.image_url || ""}
  AffiliateUrl: ${p.affiliate_url || ""}`;
    }).join("\n\n");

    const systemPrompt = `Bạn là stylist AI của Redo, app thời trang Việt Nam. 
Phân tích yêu cầu của user và thiết kế các outfit thời trang phù hợp từ kho sản phẩm thật được cung cấp dưới đây.

KHO SẢN PHẨM THẬT (CHỈ chọn sản phẩm từ danh sách này):
${productsContext || "Không tìm thấy sản phẩm phù hợp trong kho. Bạn hãy tự tạo các sản phẩm thời trang giả lập phù hợp và gắn link affiliate mặc định."}

Trả về JSON theo định dạng sau:
{
  "reply": "câu trả lời tư vấn phong cách tự nhiên bằng tiếng Việt",
  "outfits": [{
    "title": "tên outfit",
    "emoji": "emoji phù hợp",
    "style": "Casual|Streetwear|Office|Party|Minimal|K-Fashion|Boho",
    "styleTags": ["tag1", "tag2"],
    "aiComment": "mô tả ngắn bằng tiếng Việt giải thích lý do phối các món đồ này",
    "totalPrice": "tổng giá trị của outfit dạng VND (ví dụ: 1.500.000đ)",
    "matchScore": số từ 0-100 đánh giá độ phù hợp,
    "season": "spring|summer|fall|winter|all_year",
    "occasion": "office|casual|party|hangout|date",
    "mood": "từ 1-2 từ tiếng Việt",
    "products": [{
      "id": "ID sản phẩm từ danh sách",
      "name": "tên sản phẩm chính xác từ danh sách",
      "price": "giá tiền từ danh sách (ví dụ: 850.000đ)",
      "platform": "Shopee|TikTok Shop",
      "badge": "giảm giá, hot deal hoặc null",
      "rating": số 0-5,
      "sold": "số lượng đã bán (ví dụ: '100+')",
      "brand": "thương hiệu",
      "image": "URL hình ảnh (trường Image từ danh sách)",
      "affiliateUrl": "URL affiliate (trường AffiliateUrl từ danh sách)"
    }],
    "personalization": ["câu cá nhân hóa dựa trên profile"],
    "aiConfidence": [{"label": "yếu tố phù hợp", "positive": true}]
  }],
  "suggestions": [{"label": "nút gợi ý tiếp theo", "prompt": "câu prompt tương ứng"}]
}

Lưu ý quan trọng:
1. Nếu có KHO SẢN PHẨM THẬT, bạn MUST sử dụng các sản phẩm trong đó để xây dựng outfit. Cung cấp đúng ID, Image, và AffiliateUrl của sản phẩm đó để hiển thị chính xác lên giao diện.
2. Trả về từ 2 đến 4 outfits.
3. Câu trả lời và mô tả viết hoàn toàn bằng tiếng Việt tự nhiên, thân thiện.`;

    const userPrompt = `Tin nhắn user: "${message}"
${history?.length ? `Lịch sử: ${JSON.stringify(history)}` : ""}
Hãy tạo outfit phù hợp.`;

    const result = await withCreditCheck(supabase, user.id, "generation", "gemini-3.1-flash-lite", async () => {
      return await generateJson<{
        reply: string;
        outfits: any[];
        suggestions: { label: string; prompt: string }[];
      }>(userPrompt, systemPrompt);
    });

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const status = err instanceof CreditError ? 402 : 400;
    return new Response(JSON.stringify({ error: err.message }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

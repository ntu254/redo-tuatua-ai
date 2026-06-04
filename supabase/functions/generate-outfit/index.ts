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
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("Unauthorized");

    const { prompt, style, season, occasion } = await req.json();

    // 1. RAG: Retrieve similar products from database using vector search
    let retrievedProducts: any[] = [];
    try {
      const embedding = await createEmbedding(prompt);
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

    const systemPrompt = `Tạo các outfits thời trang phù hợp từ kho sản phẩm thật được cung cấp dưới đây.

KHO SẢN PHẨM THẬT (CHỈ chọn sản phẩm từ danh sách này):
${productsContext || "Không tìm thấy sản phẩm phù hợp trong kho. Bạn hãy tự tạo các sản phẩm thời trang giả lập phù hợp và gắn link affiliate mặc định."}

Trả JSON array:
[{
  "title": "tên outfit",
  "emoji": "emoji phù hợp",
  "style": "Casual|Streetwear|Office|Party|Minimal|K-Fashion|Boho",
  "styleTags": ["tag"],
  "aiComment": "mô tả ngắn bằng tiếng Việt giải thích lý do phối các món đồ này",
  "totalPrice": "tổng giá trị outfit dạng VND (ví dụ: 1.500.000đ)",
  "matchScore": số từ 0-100,
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
}]

Lưu ý: Nếu có KHO SẢN PHẨM THẬT, bạn MUST sử dụng các sản phẩm trong đó để xây dựng outfit. Cung cấp đúng ID, Image, và AffiliateUrl của sản phẩm đó để hiển thị chính xác lên giao diện.`;

    const userPrompt = `Prompt: "${prompt}"${style ? `\nStyle: ${style}` : ""}${season ? `\nSeason: ${season}` : ""}${occasion ? `\nOccasion: ${occasion}` : ""}`;

    const outfits = await withCreditCheck(supabase, user.id, "generation", "gemini-3.1-flash-lite", async () => {
      return await generateJson<any[]>(userPrompt, systemPrompt);
    });

    return new Response(JSON.stringify(outfits.slice(0, 4)), {
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

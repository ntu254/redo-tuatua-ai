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

    const { styleDna, favoriteColors, wardrobeItems } = await req.json();

    const systemPrompt = `Bạn là stylist AI. Dựa trên style DNA và tủ đồ của user, đưa ra 3 gợi ý outfit. Trả JSON array:
[{"prompt": "câu prompt để generate outfit", "label": "nhãn ngắn", "style": "Office|Casual|Party|Streetwear|Minimal"}]
Chỉ trả JSON.`;

    const userPrompt = `Style DNA: ${JSON.stringify(styleDna)}
Favorite colors: ${JSON.stringify(favoriteColors)}
Wardrobe items: ${JSON.stringify(wardrobeItems)}`;

    const recommendations = await generateJson<any[]>(userPrompt, systemPrompt);

    return new Response(JSON.stringify(recommendations.slice(0, 3)), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

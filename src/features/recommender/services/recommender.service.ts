import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";
import type { Outfit, AIAction } from "../types";

export interface GenerateRequest {
  prompt: string;
  style?: string;
  season?: string;
  occasion?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80";

function uuidToId(uuid: string): number {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    hash = ((hash << 5) - hash) + uuid.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

interface EdgeResponse {
  reply: string;
  outfits: Outfit[];
  suggestions: { label: string; prompt: string }[];
}

function addRuntimeFields(outfits: Outfit[]): Outfit[] {
  return outfits.map((o) => ({
    ...o,
    userSaved: false,
    userLiked: null,
    userHidden: false,
  }));
}

async function callEdgeConverse(message: string, history?: any[]): Promise<EdgeResponse | null> {
  try {
    const { data, error } = await supabase.functions.invoke("converse", {
      body: { message, history },
    });
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

async function callEdgeGenerate(req: GenerateRequest): Promise<Outfit[] | null> {
  try {
    const { data, error } = await supabase.functions.invoke("generate-outfit", {
      body: { prompt: req.prompt, style: req.style, season: req.season, occasion: req.occasion },
    });
    if (error) throw error;
    return addRuntimeFields(data);
  } catch {
    return null;
  }
}

async function fallbackConverse(prompt: string): Promise<EdgeResponse> {
  const { data: outfits } = await supabase
    .from("outfits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(10);

  const mapped: Outfit[] = (outfits ?? []).map((o: any) => ({
    id: uuidToId(o.id),
    title: o.name ?? "Gợi ý từ tủ đồ",
    emoji: "✨",
    image: o.image_url || FALLBACK_IMAGE,
    style: "Casual",
    styleTags: ["Casual"],
    aiMatch: true,
    aiComment: "Gợi ý từ bộ sưu tập của bạn",
    totalPrice: "—",
    products: [],
    season: "all_year",
    occasion: "casual",
    mood: "Custom",
  }));

  return {
    reply: "Dưới đây là một số outfit từ bộ sưu tập của bạn!",
    outfits: addRuntimeFields(mapped.slice(0, 3)),
    suggestions: [
      { label: "Thoải mái hơn", prompt: "Làm outfit này thoải mái hơn" },
      { label: "Rẻ hơn", prompt: "Outfit tương tự dưới 1 triệu" },
      { label: "Hàn Quốc hơn", prompt: "Phối theo style Hàn Quốc" },
    ],
  };
}

async function fallbackGenerate(_req: GenerateRequest): Promise<Outfit[]> {
  const { data: outfits } = await supabase
    .from("outfits")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const mapped: Outfit[] = (outfits ?? []).map((o: any) => ({
    id: uuidToId(o.id),
    title: o.name ?? "Generated Outfit",
    emoji: "✨",
    image: o.image_url || FALLBACK_IMAGE,
    style: "Casual",
    styleTags: ["Casual"],
    aiMatch: true,
    aiComment: "AI-generated outfit based on your style profile.",
    totalPrice: "—",
    products: [],
    season: "all_year",
    occasion: "casual",
    mood: "Custom",
  }));

  return addRuntimeFields(mapped);
}

export const recommenderService = {
  listOutfits: async (): Promise<Outfit[]> => {
    if (!apiConfig.useMockApi) {
      const { data: outfits, error } = await supabase
        .from("outfits")
        .select("id, name, image_url, is_saved, source, created_at, style_preset_id")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      if (outfits && outfits.length > 0) {
        return outfits.map((o) => ({
          id: uuidToId(o.id),
          title: o.name ?? "Generated Outfit",
          emoji: "✨",
          image: o.image_url || FALLBACK_IMAGE,
          style: "Casual",
          styleTags: ["Casual"],
          aiMatch: true,
          aiComment: "AI-generated outfit based on your style profile.",
          totalPrice: "—",
          products: [],
          season: "all_year",
          occasion: "casual",
          mood: "Custom",
          userSaved: o.is_saved ?? false,
          userLiked: null,
          userHidden: false,
        }));
      }
      return [];
    }
    return apiClient.get<Outfit[]>("/api/recommender/outfits");
  },

  generate: async (req: GenerateRequest): Promise<Outfit[]> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("outfits")
          .insert({ user_id: user.id, name: req.prompt.slice(0, 100), source: "ai" });
      }
      const edgeResult = await callEdgeGenerate(req);
      if (edgeResult) return edgeResult;
      return fallbackGenerate(req);
    }
    return apiClient.post<Outfit[]>("/api/recommender/generate", { json: req });
  },

  converse: async (prompt: string): Promise<EdgeResponse> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      const edgeResult = await callEdgeConverse(prompt);
      if (edgeResult) return edgeResult;
      if (user) return fallbackConverse(prompt);
    }
    return apiClient.post("/api/recommender/converse", { json: { prompt } });
  },

  applyAction: async (outfitId: number, action: AIAction): Promise<Outfit[]> => {
    if (!apiConfig.useMockApi) {
      const edgeResult = await callEdgeGenerate({ prompt: `Apply ${action} to outfit ${outfitId}` });
      if (edgeResult) return edgeResult;
      return fallbackGenerate({ prompt: action });
    }
    return apiClient.post("/api/recommender/action", { json: { outfitId, action } });
  },

  toggleSave: async (id: number, saved: boolean): Promise<boolean> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      const { data: outfits } = await supabase
        .from("outfits")
        .select("id")
        .eq("user_id", user.id)
        .limit(100);
      const dbOutfit = outfits?.find((o) => uuidToId(o.id) === id);
      if (dbOutfit) {
        const { error } = await supabase
          .from("outfits")
          .update({ is_saved: saved })
          .eq("id", dbOutfit.id);
        if (!error) {
          await supabase.from("user_activity_log").insert({
            user_id: user.id,
            activity_type: "outfit_saved",
            description: saved ? `Đã lưu outfit` : `Đã bỏ lưu outfit`,
            metadata: { outfit_id: dbOutfit.id }
          });
          return true;
        }
      }
      return false;
    }
    return true;
  },
};

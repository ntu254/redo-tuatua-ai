import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";
import type { WardrobeAnalysis, WardrobeItem } from "../types";
import type { Database } from "@/features/admin/types";

type DbWardrobeItem = Database["public"]["Tables"]["wardrobe_items"]["Row"];

export interface WardrobeOverview {
  itemCount: number;
  savedOutfits: number;
  aiSuggestions: number;
}

export interface WardrobeUploadAnalysis {
  detectedName: string;
  detectedCategory: string;
  detectedType: string;
  detectedColor: string;
  detectedTags: string[];
  suggestion: Array<{ role: string; name: string; color: string }>;
}

export interface ItemUpdatePayload {
  name?: string;
  category?: string;
  color?: string;
  tags?: string[];
  season?: string;
}

const UUID_TO_ID = (uuid: string): number =>
  Number.parseInt(uuid.replace(/-/g, "").slice(0, 8), 16);

const CATEGORY_LABELS: Record<string, string> = {
  "Tops": "Áo", "Bottoms": "Quần", "Shoes": "Giày",
  "Outerwear": "Áo khoác", "Accessories": "Phụ kiện", "Dresses": "Đầm",
};

function mapDbItem(w: DbWardrobeItem): WardrobeItem {
  return {
    id: UUID_TO_ID(w.id),
    name: w.name,
    category: w.category_id ?? "Khác",
    color: w.color ?? "Khác",
    tags: [],
    image: w.image_url ?? undefined,
    season: "all_year",
    source: "manual" as const,
    dateAdded: w.created_at.slice(0, 10),
  };
}

async function callEdgeAnalyzeUpload(base64: string, mime: string): Promise<WardrobeUploadAnalysis | null> {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-upload", {
      body: { imageBase64: base64, mimeType: mime },
    });
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

async function callEdgeAnalyzeWardrobe(items: any[]): Promise<WardrobeAnalysis | null> {
  try {
    const { data, error } = await supabase.functions.invoke("analyze-wardrobe", {
      body: { items },
    });
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
}

export const wardrobeService = {
  listItems: async (): Promise<WardrobeItem[]> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("wardrobe_items")
        .select("id, name, image_url, color, is_favorite, created_at, category_id, style_preset_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data.map(mapDbItem);
      return [];
    }
    return apiClient.get<WardrobeItem[]>("/api/wardrobe/items");
  },

  getOverview: async (): Promise<WardrobeOverview> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { itemCount: 0, savedOutfits: 0, aiSuggestions: 0 };
      const { count: itemCount } = await supabase
        .from("wardrobe_items")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id);
      const { count: savedOutfits } = await supabase
        .from("outfits")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("is_saved", true);
      return {
        itemCount: itemCount ?? 0,
        savedOutfits: savedOutfits ?? 0,
        aiSuggestions: 0,
      };
    }
    return apiClient.get<WardrobeOverview>("/api/wardrobe/overview");
  },

  getSuggestion: async () => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data: items } = await supabase
        .from("wardrobe_items")
        .select("id, name, color, category_id")
        .eq("user_id", user.id);
      if (!items || items.length === 0) return [];

      const categories = new Set(items.map((i) => i.category_id));
      const suggestions: { role: string; name: string; color: string }[] = [];

      if (!categories.has("Shoes")) suggestions.push({ role: "Core", name: "Giày sneaker trắng", color: "Trắng" });
      if (!categories.has("Outerwear")) suggestions.push({ role: "Layer", name: "Áo khoác denim", color: "Xanh" });
      if (!categories.has("Accessories")) suggestions.push({ role: "Statement", name: "Túi tote da", color: "Nâu" });
      if (items.length < 3) suggestions.push({ role: "Core", name: "Áo thun trắng basic", color: "Trắng" });

      return suggestions;
    }
    return apiClient.get<Array<{ role: string; name: string; color: string }>>("/api/wardrobe/suggestion");
  },

  analyzeUpload: async (file?: File): Promise<WardrobeUploadAnalysis> => {
    if (!apiConfig.useMockApi && file) {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const edgeResult = await callEdgeAnalyzeUpload(base64, file.type);
      if (edgeResult) return edgeResult;
    }
    return { detectedName: "New Item", detectedCategory: "Tops", detectedType: "Áo", detectedColor: "Khác", detectedTags: [], suggestion: [] };
  },

  getAnalysis: async (): Promise<WardrobeAnalysis> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      const items = user ? await wardrobeService.listItems() : [];

      if (items.length === 0) {
        return {
          totalItems: 0, topCategory: "—", topColor: "—", topStyle: "—",
          colorPalette: [], categoryDistribution: [], styleDistribution: [],
          seasonBreakdown: [], consistencyScore: 0, dominantStyles: [], missingEssentials: [],
        };
      }

      const cats = items.reduce<Record<string, number>>((acc, i) => {
        acc[i.category] = (acc[i.category] ?? 0) + 1; return acc;
      }, {});
      const colors = items.reduce<Record<string, number>>((acc, i) => {
        acc[i.color] = (acc[i.color] ?? 0) + 1; return acc;
      }, {});
      const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Khác";
      const topColor = Object.entries(colors).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Khác";

      const edgeResult = await callEdgeAnalyzeWardrobe(items);
      if (edgeResult) return edgeResult;

      return {
        totalItems: items.length,
        topCategory: CATEGORY_LABELS[topCat] ?? topCat,
        topColor,
        topStyle: "Casual",
        colorPalette: Object.entries(colors).slice(0, 5).map(([color, count]) => ({ color, count, label: color })),
        categoryDistribution: Object.entries(cats).map(([category, count]) => ({ category, count })),
        styleDistribution: [{ style: "Casual", count: items.length }],
        seasonBreakdown: [{ season: "All Year", count: items.length }],
        consistencyScore: Math.min(85, items.length * 15),
        dominantStyles: ["Casual"],
        missingEssentials: items.length < 5 ? ["Áo thun trắng", "Quần jeans", "Giày sneaker"] : [],
      };
    }
    return apiClient.get<WardrobeAnalysis>("/api/wardrobe/analysis");
  },

  deleteItem: async (id: number) => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: items } = await supabase
        .from("wardrobe_items")
        .select("id")
        .eq("user_id", user.id)
        .limit(100);
      const dbItem = items?.find((item) => UUID_TO_ID(item.id) === id);
      if (dbItem) {
        await supabase.from("wardrobe_items").delete().eq("id", dbItem.id);
      }
      return;
    }
    return apiClient.delete<void>(`/api/wardrobe/items/${id}`);
  },

  updateItem: async (id: number, payload: ItemUpdatePayload) => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { id, ...payload } as WardrobeItem;
      const { data: items } = await supabase
        .from("wardrobe_items")
        .select("id")
        .eq("user_id", user.id)
        .limit(100);
      const dbItem = items?.find((item) => UUID_TO_ID(item.id) === id);
      if (dbItem) {
        await supabase.from("wardrobe_items").update({
          name: payload.name,
          color: payload.color,
        }).eq("id", dbItem.id);
      }
      return { id, ...payload } as WardrobeItem;
    }
    return apiClient.patch<WardrobeItem>(`/api/wardrobe/items/${id}`, { json: payload });
  },
};

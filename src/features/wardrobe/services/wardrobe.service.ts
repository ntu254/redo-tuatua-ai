import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";
import type { WardrobeAnalysis, WardrobeItem } from "../types";

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

const uuidToId = (uuid: string): number =>
  Number.parseInt(uuid.replace(/-/g, "").slice(0, 8), 16);

const MOCK_ITEMS: WardrobeItem[] = [
  { id: 1, name: "Áo sơ mi trắng", category: "Tops", color: "Trắng", tags: ["cơ bản", "công sở"], image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&q=80", season: "all_year", source: "manual", dateAdded: "2026-01-15" },
  { id: 2, name: "Quần tây đen", category: "Bottoms", color: "Đen", tags: ["công sở", "trung tính"], image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=200&q=80", season: "all_year", source: "manual", dateAdded: "2026-01-20" },
  { id: 3, name: "Áo hoodie xám", category: "Outerwear", color: "Xám", tags: ["casual", "streetwear"], image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&q=80", season: "fall", source: "ai-scan", dateAdded: "2026-02-01" },
  { id: 4, name: "Sneakers trắng", category: "Shoes", color: "Trắng", tags: ["giày", "casual"], image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&q=80", season: "all_year", source: "manual", dateAdded: "2026-02-10" },
  { id: 5, name: "Đầm đen dáng ôm", category: "Dresses", color: "Đen", tags: ["dạ tiệc", "thanh lịch"], image: "https://images.unsplash.com/photo-1581044777550-4c0a9e32f8c4?w=200&q=80", season: "all_year", source: "manual", dateAdded: "2026-03-05" },
];

const CATEGORY_MAP: Record<string, string> = {
  "Tops": "Áo", "Bottoms": "Quần", "Shoes": "Giày",
  "Outerwear": "Áo khoác", "Accessories": "Phụ kiện", "Dresses": "Đầm",
};

export const wardrobeService = {
  listItems: async (): Promise<WardrobeItem[]> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return MOCK_ITEMS;
      const { data, error } = await supabase
        .from("wardrobe_items")
        .select("id, name, image_url, color, is_favorite, created_at, category_id, style_preset_id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) {
        return data.map((w) => ({
          id: uuidToId(w.id),
          name: w.name,
          category: "Tops",
          color: w.color ?? "Khác",
          tags: [],
          image: w.image_url ?? undefined,
          season: "all_year",
          source: "manual" as const,
          dateAdded: w.created_at.slice(0, 10),
        }));
      }
      return MOCK_ITEMS;
    }
    return apiClient.get<WardrobeItem[]>("/api/wardrobe/items");
  },

  getOverview: async (): Promise<WardrobeOverview> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { itemCount: MOCK_ITEMS.length, savedOutfits: 0, aiSuggestions: 0 };
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
      return [{ role: "Core", name: "Áo thun trắng", color: "Trắng" }];
    }
    return apiClient.get<Array<{ role: string; name: string; color: string }>>("/api/wardrobe/suggestion");
  },

  analyzeUpload: async () => {
    if (!apiConfig.useMockApi) {
      return {
        detectedName: "New Item",
        detectedCategory: "Tops",
        detectedType: "Áo",
        detectedColor: "Khác",
        detectedTags: [],
        suggestion: [],
      };
    }
    return apiClient.get<WardrobeUploadAnalysis>("/api/wardrobe/upload-analysis");
  },

  getAnalysis: async (): Promise<WardrobeAnalysis> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      const items = user ? await wardrobeService.listItems() : MOCK_ITEMS;
      const cats = items.reduce<Record<string, number>>((acc, i) => {
        acc[i.category] = (acc[i.category] ?? 0) + 1; return acc;
      }, {});
      const colors = items.reduce<Record<string, number>>((acc, i) => {
        acc[i.color] = (acc[i.color] ?? 0) + 1; return acc;
      }, {});
      const topCat = Object.entries(cats).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Khác";
      const topColor = Object.entries(colors).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Khác";
      return {
        totalItems: items.length,
        topCategory: CATEGORY_MAP[topCat] ?? topCat,
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
      const dbItem = items?.[id - 1];
      if (dbItem) {
        await supabase.from("wardrobe_items").delete().eq("id", dbItem.id);
      }
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
      const dbItem = items?.[id - 1];
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

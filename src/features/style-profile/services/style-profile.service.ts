import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";
import type { StyleProfile, StyleRecommendation } from "../types";

const MOCK_PROFILE: StyleProfile = {
  styleDna: [
    { style: "Minimal", value: 70 },
    { style: "Streetwear", value: 15 },
    { style: "Casual", value: 10 },
    { style: "Elegant", value: 5 },
    { style: "Athleisure", value: 8 },
    { style: "Classic", value: 12 },
  ],
  favoriteColors: [
    { name: "White", hex: "#FFFFFF", pct: 35 },
    { name: "Beige", hex: "#F5F0E8", pct: 25 },
    { name: "Black", hex: "#1C1C1C", pct: 20 },
    { name: "Navy", hex: "#1B2A4A", pct: 12 },
    { name: "Sage Green", hex: "#9CAF88", pct: 8 },
  ],
  outfitTypeDistribution: [
    { name: "Casual", value: 42, color: "hsl(0 0% 75%)" },
    { name: "Office", value: 28, color: "hsl(0 0% 45%)" },
    { name: "Streetwear", value: 15, color: "hsl(0 100% 70%)" },
    { name: "Party", value: 10, color: "hsl(0 0% 25%)" },
    { name: "Sport", value: 5, color: "hsl(166 65% 50%)" },
  ],
  aiInsight: {
    summary: "Phong cách thiên hướng tối giản hiện đại",
    description: "Bạn ưu tiên tông trung tính với các outfit linh hoạt giữa công sở và đời thường.",
  },
  insights: [
    "Tông màu trung tính chiếm ưu thế trong tủ đồ của bạn",
    "Bạn có xu hướng chọn đồ basic và phối layer",
  ],
  wardrobeFavorites: [
    { name: "White T-shirt", image: "", worn: 47 },
    { name: "Blue Jeans", image: "", worn: 38 },
  ],
  evolution: [
    { month: "Jan", Minimal: 30, Casual: 50, Office: 20 },
    { month: "Feb", Minimal: 35, Casual: 45, Office: 20 },
    { month: "Mar", Minimal: 50, Casual: 30, Office: 20 },
    { month: "Apr", Minimal: 55, Casual: 25, Office: 20 },
    { month: "May", Minimal: 60, Casual: 20, Office: 20 },
    { month: "Jun", Minimal: 70, Casual: 10, Office: 20 },
  ],
  trendSummary: [
    { label: "Minimal", change: "+40%", positive: true },
    { label: "Casual", change: "-40%", positive: false },
  ],
  keyMoments: [
    { month: "Mar 2026", event: "Bắt đầu ưu tiên phong cách tối giản" },
  ],
  suggestedStyles: [
    { name: "Quiet Luxury", image: "", desc: "Sang trọng thầm lặng" },
    { name: "Soft Minimal", image: "", desc: "Tối giản mềm mại" },
  ],
  missingEssentials: [
    { item: "Áo blazer trung tính", reason: "Thiếu item layering công sở", priority: "high" },
    { item: "Giày loafer", reason: "Đa năng cho cả công sở và đi chơi", priority: "medium" },
  ],
  consistencyScore: 72,
  dominantStyles: ["Minimal", "Casual"],
};

export const styleProfileService = {
  getProfile: async (userId: string): Promise<StyleProfile> => {
    if (!apiConfig.useMockApi) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("style_dna, favorite_colors, preferred_styles, quiz_completed")
        .eq("id", userId)
        .single();
      if (profile?.style_dna && typeof profile.style_dna === "object") {
        const dna = profile.style_dna as Record<string, number>;
        const styles = Object.entries(dna).map(([style, value]) => ({ style, value }));
        const colors = (profile.favorite_colors ?? []).map((c: string, i: number) => ({
          name: c,
          hex: ["#FFFFFF", "#F5F0E8", "#1C1C1C", "#1B2A4A", "#9CAF88"][i % 5],
          pct: Math.round(100 / Math.max(profile.favorite_colors?.length ?? 1, 1)),
        }));
        return {
          ...MOCK_PROFILE,
          styleDna: styles.length > 0 ? styles : MOCK_PROFILE.styleDna,
          favoriteColors: colors.length > 0 ? colors : MOCK_PROFILE.favoriteColors,
          dominantStyles: (profile.preferred_styles ?? []).length > 0
            ? (profile.preferred_styles as string[])
            : MOCK_PROFILE.dominantStyles,
        };
      }
      return MOCK_PROFILE;
    }
    return apiClient.get<StyleProfile>(`/api/style-profile/${userId}`);
  },

  getRecommendations: async (_userId: string): Promise<StyleRecommendation[]> => {
    if (!apiConfig.useMockApi) {
      return [
        { prompt: "Gợi ý outfit công sở thanh lịch", label: "Công sở", style: "Office" },
        { prompt: "Outfit cuối tuần thoải mái", label: "Cuối tuần", style: "Casual" },
        { prompt: "Phối đồ layer mùa lạnh", label: "Layer", style: "Minimal" },
      ];
    }
    return apiClient.get<StyleRecommendation[]>(`/api/style-profile/${_userId}/recommendations`);
  },
};

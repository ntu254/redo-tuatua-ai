import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";
import type { SeasonalTrend, RegionTrend, NextTrend, PersonalizedTrend, WardrobeMatch } from "../types";

const MOCK_SEASONAL: SeasonalTrend[] = [
  { season: "spring", label: "Xuân 2026", trends: [{ name: "Pastel Dream", desc: "Tông pastel nhẹ nhàng kết hợp layer mỏng", growth: "+45%" }] },
  { season: "summer", label: "Hè 2026", trends: [{ name: "Linen Love", desc: "Vải linen tự nhiên, rộng rãi thoáng mát", growth: "+38%" }] },
  { season: "fall", label: "Thu 2026", trends: [{ name: "Layering Master", desc: "Layer nhiều lớp với tông màu trung tính", growth: "+52%" }] },
  { season: "winter", label: "Đông 2026", trends: [{ name: "Wool Rich", desc: "Áo len dày dặn với phụ kiện cashmere", growth: "+33%" }] },
];

const MOCK_REGIONAL: RegionTrend[] = [
  { region: "Hà Nội", flag: "🌿", trends: ["Áo khoác nhẹ", "Layer tối giản", "Màu trung tính"] },
  { region: "TP. HCM", flag: "🌴", trends: ["Áo thun oversized", "Quần short", "Croptop"] },
  { region: "Đà Nẵng", flag: "🌊", trends: ["Đầm maxi", "Trang phục biển", "Màu pastel"] },
];

const MOCK_NEXT: NextTrend[] = [
  { name: "Quiet Luxury", desc: "Sang trọng thầm lặng", confidence: 89, source: "Global fashion week analysis" },
  { name: "Y2K Revival", desc: "Phong cách đầu thập niên 2000", confidence: 76, source: "Social media trend analysis" },
];

const MOCK_PERSONALIZED: PersonalizedTrend[] = [
  { prompt: "Tối giản tinh tế", label: "Quiet Luxury", reason: "Phù hợp style minimal của bạn" },
  { prompt: "Layer công sở", label: "Smart Layering", reason: "Tối ưu tủ đồ công sở hiện tại" },
];

const MOCK_WARDROBE_MATCHES: WardrobeMatch[] = [
  { trend: "Quiet Luxury", match: "Áo sơ mi trắng + Quần tây", note: "Bạn đã có 2/3 items cần thiết" },
  { trend: "Pastel Dream", match: "Đầm pastel + Cardigan", note: "Thiếu áo khoác nhẹ tông pastel" },
];

export const trendsService = {
  getSeasonalTrends: async (): Promise<SeasonalTrend[]> => {
    if (!apiConfig.useMockApi) {
      const { data, error } = await supabase
        .from("fashion_trends")
        .select("title, description, growth_pct, season, category")
        .eq("is_published", true)
        .limit(10);
      if (error) throw error;
      if (data && data.length > 0) {
        const grouped: Record<string, SeasonalTrend> = {};
        data.forEach((t) => {
          const s = t.season ?? "all_year";
          if (!grouped[s]) grouped[s] = { season: s, label: `${s} 2026`, trends: [] };
          grouped[s].trends.push({
            name: t.title,
            desc: t.description ?? "",
            growth: `${t.growth_pct ?? 0}%`,
          });
        });
        return Object.values(grouped);
      }
      return MOCK_SEASONAL;
    }
    return apiClient.get<SeasonalTrend[]>("/api/trends/seasonal");
  },

  getRegionalTrends: async (): Promise<RegionTrend[]> => {
    if (!apiConfig.useMockApi) {
      return MOCK_REGIONAL;
    }
    return apiClient.get<RegionTrend[]>("/api/trends/regional");
  },

  getNextTrends: async (): Promise<NextTrend[]> => {
    if (!apiConfig.useMockApi) {
      return MOCK_NEXT;
    }
    return apiClient.get<NextTrend[]>("/api/trends/next");
  },

  getPersonalizedTrends: async (): Promise<PersonalizedTrend[]> => {
    if (!apiConfig.useMockApi) {
      return MOCK_PERSONALIZED;
    }
    return apiClient.get<PersonalizedTrend[]>("/api/trends/personalized");
  },

  getWardrobeMatches: async (): Promise<WardrobeMatch[]> => {
    if (!apiConfig.useMockApi) {
      return MOCK_WARDROBE_MATCHES;
    }
    return apiClient.get<WardrobeMatch[]>("/api/trends/wardrobe-matches");
  },
};

import { apiClient } from "@/shared/api";
import type { SeasonalTrend, RegionTrend, NextTrend, PersonalizedTrend, WardrobeMatch } from "../types";

export const trendsService = {
  getSeasonalTrends: () => apiClient.get<SeasonalTrend[]>("/api/trends/seasonal"),
  getRegionalTrends: () => apiClient.get<RegionTrend[]>("/api/trends/regional"),
  getNextTrends: () => apiClient.get<NextTrend[]>("/api/trends/next"),
  getPersonalizedTrends: () => apiClient.get<PersonalizedTrend[]>("/api/trends/personalized"),
  getWardrobeMatches: () => apiClient.get<WardrobeMatch[]>("/api/trends/wardrobe-matches"),
};

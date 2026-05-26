import { apiClient } from "@/shared/api";
import type { StyleProfile, StyleRecommendation } from "../types";

export const styleProfileService = {
  getProfile: () => apiClient.get<StyleProfile>("/api/style-profile"),
  getRecommendations: () =>
    apiClient.get<StyleRecommendation[]>("/api/style-profile/recommendations"),
};

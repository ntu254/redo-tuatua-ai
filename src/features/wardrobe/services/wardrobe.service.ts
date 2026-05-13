import { apiClient } from "@/shared/api";
import type { WardrobeItem } from "../types";

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

export const wardrobeService = {
  listItems: () => apiClient.get<WardrobeItem[]>("/api/wardrobe/items"),
  getOverview: () => apiClient.get<WardrobeOverview>("/api/wardrobe/overview"),
  getSuggestion: () =>
    apiClient.get<Array<{ role: string; name: string; color: string }>>(
      "/api/wardrobe/suggestion",
    ),
  analyzeUpload: () =>
    apiClient.get<WardrobeUploadAnalysis>("/api/wardrobe/upload-analysis"),
};

import { apiClient } from "@/shared/api";
import type { Outfit } from "../types";

export interface GenerateRequest {
  prompt: string;
  style?: string;
  season?: string;
  occasion?: string;
}

export const recommenderService = {
  listOutfits: () => apiClient.get<Outfit[]>("/api/recommender/outfits"),
  generate: (req: GenerateRequest) =>
    apiClient.post<Outfit[]>("/api/recommender/generate", { json: req }),
};

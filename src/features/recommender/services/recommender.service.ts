import { apiClient } from "@/shared/api";
import type { Outfit } from "../types";

export const recommenderService = {
  listOutfits: () => apiClient.get<Outfit[]>("/api/recommender/outfits"),
};

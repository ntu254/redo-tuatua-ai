import { wardrobeItems } from "@/features/wardrobe/data";

import {
  sampleOutfits,
  wardrobeOverviewMock,
  wardrobeSuggestionMock,
  wardrobeUploadAnalysisMock,
} from "./mock-fixtures";
import type { MockHandler } from "./types";

export const mockHandlers: Record<string, MockHandler> = {
  "/api/wardrobe/items": () => wardrobeItems,
  "/api/wardrobe/overview": () => wardrobeOverviewMock,
  "/api/wardrobe/suggestion": () => wardrobeSuggestionMock,
  "/api/wardrobe/upload-analysis": () => wardrobeUploadAnalysisMock,
  "/api/recommender/outfits": () => sampleOutfits,
};

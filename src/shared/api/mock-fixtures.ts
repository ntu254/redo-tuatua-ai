import { sampleOutfits } from "@/features/recommender/data";
import { wardrobeItems } from "@/features/wardrobe/data";

export interface WardrobeOverviewMock {
  itemCount: number;
  savedOutfits: number;
  aiSuggestions: number;
}

export interface WardrobeSuggestionPiece {
  role: string;
  name: string;
  color: string;
}

export interface WardrobeUploadAnalysisMock {
  detectedName: string;
  detectedCategory: string;
  detectedType: string;
  detectedColor: string;
  detectedTags: string[];
  suggestion: WardrobeSuggestionPiece[];
}

export const wardrobeOverviewMock: WardrobeOverviewMock = {
  itemCount: wardrobeItems.length,
  savedOutfits: 5,
  aiSuggestions: 18,
};

export const wardrobeSuggestionMock: WardrobeSuggestionPiece[] = [
  { role: "Áo", name: "Áo thun trắng basic", color: "#FFFFFF" },
  { role: "Quần", name: "Quần jeans xanh đậm", color: "#1C3A5F" },
  { role: "Giày", name: "Giày sneaker trắng", color: "#F5F5F5" },
];

export const wardrobeUploadAnalysisMock: WardrobeUploadAnalysisMock = {
  detectedName: "Áo thun trắng",
  detectedCategory: "Tops",
  detectedType: "Áo thun",
  detectedColor: "#FFFFFF",
  detectedTags: ["Casual", "Minimal"],
  suggestion: wardrobeSuggestionMock,
};

export { sampleOutfits };

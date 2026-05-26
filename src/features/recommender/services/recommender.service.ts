import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";
import type { Outfit, ChatMessage, AIAction } from "../types";

export interface GenerateRequest {
  prompt: string;
  style?: string;
  season?: string;
  occasion?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80";

const MOCK_OUTFITS: Outfit[] = [
  {
    id: 1, title: "Minimal Office Look", emoji: "💼",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80",
    tryOnImage: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=600&q=80",
    style: "Office", styleTags: ["Office", "Minimal"], aiMatch: true,
    aiComment: "Phối màu trung tính tinh tế, phù hợp môi trường công sở.",
    totalPrice: "2,850,000₫", matchScore: 94,
    userOwnsItems: ["Áo sơ mi trắng", "Quần tây đen"],
    missingItems: [
      { name: "Túi da nâu", reason: "Hoàn thiện office look", price: "1,020,000₫", platform: "Shopee" },
      { name: "Đồng hồ tối giản", reason: "Điểm nhấn tinh tế", price: "890,000₫", platform: "Lazada" },
    ],
    personalization: ["Phù hợp style Minimal của bạn", "Dựa trên tủ đồ công sở"],
    aiConfidence: [
      { label: "Thời tiết ấm", positive: true },
      { label: "Hẹn hò công sở", positive: true },
      { label: "Phong cách tối giản", positive: true },
    ],
    products: [
      { name: "Áo sơ mi trắng", price: "550,000₫", oldPrice: null, platform: "Shopee", badge: null, rating: 4.5, sold: "1.2k", brand: "Basic House" },
      { name: "Quần tây đen", price: "680,000₫", oldPrice: "850,000₫", platform: "Lazada", badge: "-20%", rating: 4.7, sold: "856", brand: "Mango" },
      { name: "Túi da nâu", price: "1,020,000₫", oldPrice: null, platform: "Tiki", badge: null, rating: 4.3, sold: "234", brand: "Charles & Keith" },
    ],
    season: "all_year", occasion: "office", mood: "Chuyên nghiệp",
  },
  {
    id: 2, title: "Weekend Streetwear", emoji: "🔥",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&q=80",
    tryOnImage: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=600&q=80",
    style: "Streetwear", styleTags: ["Streetwear", "Casual"], aiMatch: true,
    aiComment: "Phong cách đường phố cá tính với layer áo khoác + sneakers.",
    totalPrice: "3,420,000₫", matchScore: 96,
    userOwnsItems: ["Áo hoodie xám"],
    missingItems: [
      { name: "Quần jogger đen", reason: "Phối cùng hoodie hoàn hảo", price: "380,000₫", platform: "Shopee" },
    ],
    personalization: ["Kết hợp style Streetwear + Casual", "Item từ tủ đồ của bạn"],
    aiConfidence: [
      { label: "Cuối tuần", positive: true },
      { label: "Dạo phố", positive: true },
      { label: "Phong cách Hàn Quốc", positive: true },
    ],
    products: [
      { name: "Áo hoodie xám", price: "520,000₫", oldPrice: null, platform: "Shopee", badge: null, rating: 4.6, sold: "2.1k", brand: "Adidas" },
      { name: "Quần jogger đen", price: "380,000₫", oldPrice: null, platform: "Lazada", badge: null, rating: 4.4, sold: "1.5k", brand: "H&M" },
      { name: "Giày sneaker trắng", price: "2,520,000₫", oldPrice: "3,200,000₫", platform: "Zalora", badge: "-21%", rating: 4.8, sold: "3.4k", brand: "Nike" },
    ],
    season: "fall", occasion: "casual", mood: "Năng động",
  },
  {
    id: 3, title: "Date Night Elegance", emoji: "🌹",
    image: "https://images.unsplash.com/photo-1581044777550-4c0a9e32f8c4?w=400&q=80",
    tryOnImage: "https://images.unsplash.com/photo-1583391733956-6c78276477e9?w=600&q=80",
    style: "Party", styleTags: ["Party", "Minimal"], aiMatch: false,
    aiComment: "Set đồ thanh lịch cho buổi hẹn hò tối — tông đen chủ đạo.",
    totalPrice: "4,150,000₫", matchScore: 91,
    personalization: ["Gợi ý từ sở thích Minimal của bạn", "Phù hợp không gian sang trọng"],
    aiConfidence: [
      { label: "Buổi tối", positive: true },
      { label: "Hẹn hò", positive: true },
      { label: "Phong cách quyến rũ", positive: true },
    ],
    products: [
      { name: "Đầm đen dáng ôm", price: "950,000₫", oldPrice: "1,200,000₫", platform: "Shopee", badge: "-21%", rating: 4.5, sold: "678", brand: "Zara" },
      { name: "Giày cao gót đen", price: "1,800,000₫", oldPrice: null, platform: "Zalora", badge: null, rating: 4.6, sold: "432", brand: "Charles & Keith" },
      { name: "Túi clutch bạc", price: "1,400,000₫", oldPrice: null, platform: "Tiki", badge: null, rating: 4.2, sold: "156", brand: "Mango" },
    ],
    season: "all_year", occasion: "party", mood: "Quyến rũ",
  },
  {
    id: 4, title: "Casual Coffee Date", emoji: "☕",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80",
    tryOnImage: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=80",
    style: "Casual", styleTags: ["Casual", "Minimal"], aiMatch: true,
    aiComment: "Set đồ thoải mái cho buổi cà phê cuối tuần — vừa lịch sự vừa dễ chịu.",
    totalPrice: "1,980,000₫", matchScore: 88,
    userOwnsItems: ["Áo thun trắng"],
    missingItems: [
      { name: "Sneakers trắng basic", reason: "Hoàn thiện casual look", price: "1,080,000₫", platform: "Zalora" },
    ],
    personalization: ["Dưới 2 triệu — phù hợp budget của bạn", "Style Casual quen thuộc"],
    aiConfidence: [
      { label: "Cà phê sáng", positive: true },
      { label: "Thời tiết mát", positive: true },
      { label: "Phong cách thoải mái", positive: true },
    ],
    products: [
      { name: "Áo thun trắng", price: "220,000₫", oldPrice: null, platform: "Shopee", badge: null, rating: 4.3, sold: "5.6k", brand: "Uniqlo" },
      { name: "Quần jeans xanh", price: "680,000₫", oldPrice: null, platform: "Lazada", badge: null, rating: 4.5, sold: "2.3k", brand: "Levi's" },
      { name: "Sneakers trắng", price: "1,080,000₫", oldPrice: "1,500,000₫", platform: "Zalora", badge: "-28%", rating: 4.7, sold: "4.1k", brand: "Converse" },
    ],
    season: "spring", occasion: "hangout", mood: "Thoải mái",
  },
];

const AI_RESPONSES: Record<string, { text: string; style?: string }> = {
  "coffee": { text: "Gợi ý vibe casual minimal cho buổi cà phê ☕", style: "Casual" },
  "date": { text: "Mình nghĩ style thanh lịch sẽ hợp cho buổi hẹn hò tối nay 🌹", style: "Party" },
  "office": { text: "Office look minimal — chuyên nghiệp nhưng vẫn thoải mái 💼", style: "Office" },
  "street": { text: "Streetwear cá tính — layer áo khoác + sneakers 🔥", style: "Streetwear" },
  "korean": { text: "K-Fashion đang hot — phối layer oversized + tông đất 🇰🇷", style: "K-Fashion" },
  "party": { text: "Dạ tiệc sang trọng — sequin và phụ kiện ánh kim ✨", style: "Party" },
  "budget": { text: "Tiết kiệm nhưng vẫn chất — outfit dưới 1 triệu 💰", style: "Casual" },
  "minimal": { text: "Minimalist tinh tế — less is more ◻️", style: "Minimal" },
};

const ACTION_PROMPTS: Record<AIAction, string> = {
  regenerate: "Tạo lại outfit khác",
  more_casual: "Thoải mái hơn",
  more_luxury: "Sang trọng hơn",
  cheaper: "Tiết kiệm hơn",
  more_korean: "Hàn Quốc hơn",
};

const mockConverse = async (prompt: string): Promise<{ message: string; outfits: Outfit[]; suggestions: { label: string; prompt: string }[] }> => {
  const lower = prompt.toLowerCase();
  let response: { text: string; style?: string } = { text: "Mình gợi ý outfit phù hợp với yêu cầu của bạn ✨", style: undefined };

  for (const [key, val] of Object.entries(AI_RESPONSES)) {
    if (lower.includes(key)) { response = val; break; }
  }

  const shuffled = [...MOCK_OUTFITS].sort(() => Math.random() - 0.5);
  let filtered = shuffled;
  if (response.style) {
    filtered = shuffled.filter((o) => o.styleTags.includes(response.style!));
  }
  if (filtered.length === 0) filtered = shuffled;
  const outfits = filtered.slice(0, 3).map((o) => ({
    ...o,
    userSaved: false,
    userLiked: null,
    userHidden: false,
  }));

  const suggestions = [
    { label: "✨ Thoải mái hơn", prompt: "Làm outfit này thoải mái hơn" },
    { label: "💰 Rẻ hơn", prompt: "Outfit tương tự dưới 1 triệu" },
    { label: "🇰🇷 Hàn Quốc hơn", prompt: "Phối theo style Hàn Quốc" },
  ];

  return { message: response.text, outfits, suggestions };
};

const mockListOutfits = async (): Promise<Outfit[]> => {
  return MOCK_OUTFITS.map((o) => ({
    ...o,
    userSaved: false,
    userLiked: null,
    userHidden: false,
  }));
};

const mockGenerate = async (_req: GenerateRequest): Promise<Outfit[]> => {
  const shuffled = [...MOCK_OUTFITS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2).map((o) => ({
    ...o,
    userSaved: false,
    userLiked: null,
    userHidden: false,
  }));
};

const mockApplyAction = async (_outfitId: number, _action: AIAction): Promise<Outfit[]> => {
  const shuffled = [...MOCK_OUTFITS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 2).map((o) => ({
    ...o,
    userSaved: false,
    userLiked: null,
    userHidden: false,
  }));
};

export const recommenderService = {
  listOutfits: async (): Promise<Outfit[]> => {
    if (!apiConfig.useMockApi) {
      const { data: outfits, error } = await supabase
        .from("outfits")
        .select("id, name, image_url, is_saved, source, created_at, style_preset_id")
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      if (outfits && outfits.length > 0) {
        return outfits.map((o) => ({
          id: Number(o.id.replace(/-/g, "").slice(0, 8)),
          title: o.name ?? "Generated Outfit",
          emoji: "✨",
          image: o.image_url || FALLBACK_IMAGE,
          style: "Casual",
          styleTags: ["Casual"],
          aiMatch: true,
          aiComment: "AI-generated outfit based on your style profile.",
          totalPrice: "—",
          products: [],
          season: "all_year",
          occasion: "casual",
          mood: "Custom",
          userSaved: o.is_saved ?? false,
          userLiked: null,
          userHidden: false,
        }));
      }
      return mockListOutfits();
    }
    return apiClient.get<Outfit[]>("/api/recommender/outfits");
  },

  generate: async (req: GenerateRequest): Promise<Outfit[]> => {
    if (!apiConfig.useMockApi) {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase
        .from("outfits")
        .insert({ user_id: user?.id, name: req.prompt.slice(0, 100), source: "ai" });
      if (error) throw error;
      return mockGenerate(req);
    }
    return apiClient.post<Outfit[]>("/api/recommender/generate", { json: req });
  },

  converse: async (prompt: string): Promise<{ message: string; outfits: Outfit[]; suggestions: { label: string; prompt: string }[] }> => {
    if (apiConfig.useMockApi) {
      return apiClient.post("/api/recommender/converse", { json: { prompt } });
    }
    return mockConverse(prompt);
  },

  applyAction: async (outfitId: number, action: AIAction): Promise<Outfit[]> => {
    if (apiConfig.useMockApi) {
      return apiClient.post("/api/recommender/action", { json: { outfitId, action } });
    }
    return mockApplyAction(outfitId, action);
  },
};

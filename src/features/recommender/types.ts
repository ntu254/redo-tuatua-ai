export interface Product {
  name: string;
  price: string;
  oldPrice: string | null;
  platform: string;
  badge: string | null;
  rating: number;
  sold: string;
  brand: string;
  image?: string;
  affiliateUrl?: string;
  platformColor?: string;
}

export interface Outfit {
  id: number;
  title: string;
  emoji: string;
  image: string;
  style: string;
  styleTags: string[];
  aiMatch: boolean;
  aiComment: string;
  totalPrice: string;
  products: Product[];
  matchScore?: number;
  season?: string;
  occasion?: string;
  mood?: string;
  userSaved?: boolean;
  userLiked?: boolean | null;
  userHidden?: boolean;
}

export interface RecommenderState {
  outfits: Outfit[];
  isLoading: boolean;
  error: string | null;
  activeFilter: string;
  activePrompt: string;
  savedOutfits: number[];
  likedOutfits: Record<number, boolean | null>;
  hiddenOutfits: number[];
}

export const STYLE_FILTERS = [
  { icon: "✨", label: "Tất cả", value: "all" },
  { icon: "🧥", label: "Casual", value: "Casual" },
  { icon: "🔥", label: "Streetwear", value: "Streetwear" },
  { icon: "💼", label: "Công sở", value: "Office" },
  { icon: "🇰🇷", label: "K-Fashion", value: "K-Fashion" },
  { icon: "🌺", label: "Boho", value: "Boho" },
  { icon: "◻️", label: "Minimal", value: "Minimal" },
  { icon: "🎉", label: "Dạ tiệc", value: "Party" },
] as const;

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
}

export interface Outfit {
  id: number;
  title: string;
  emoji: string;
  image: string;
  style: string;
  aiMatch: boolean;
  aiComment: string;
  totalPrice: string;
  products: Product[];
}

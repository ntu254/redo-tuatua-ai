export interface WardrobeItem {
  id: number;
  name: string;
  category: string;
  color: string;
  tags: string[];
  image?: string;
}

export interface ActiveFilters {
  category: string[];
  style: string[];
  color: string[];
  season: string[];
}

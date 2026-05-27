import type { AffiliateProduct, AffiliatePlatform, ClickEvent, IAffiliatePlatform, PlatformConfig, SearchParams } from "./types";

export class LazadaClient implements IAffiliatePlatform {
  readonly platform: AffiliatePlatform = "Lazada";
  readonly config: PlatformConfig;

  constructor(config?: Partial<PlatformConfig>) {
    this.config = {
      platform: "Lazada",
      apiKey: config?.apiKey ?? import.meta.env.VITE_LAZADA_API_KEY ?? "",
      apiSecret: config?.apiSecret ?? import.meta.env.VITE_LAZADA_API_SECRET ?? "",
      baseUrl: config?.baseUrl ?? "https://api.lazada.vn/rest",
      isActive: config?.isActive ?? false,
    };
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.apiSecret && this.config.isActive);
  }

  async searchProducts(params: SearchParams): Promise<AffiliateProduct[]> {
    if (!this.isConfigured()) return this.mockSearch(params);
    try {
      const response = await fetch(`${this.config.baseUrl}/product/search`, {
        headers: { Authorization: this.config.apiKey! },
        body: JSON.stringify({
          q: params.query,
          limit: params.limit ?? 10,
        }),
      });
      if (!response.ok) throw new Error(`Lazada API error: ${response.status}`);
      const data = await response.json();
      return (data.result?.products ?? []).map((p: any) => this.mapProduct(p));
    } catch {
      console.warn("Lazada API failed, using mock data");
      return this.mockSearch(params);
    }
  }

  async getProductDetail(id: string): Promise<AffiliateProduct | null> {
    if (!this.isConfigured()) return null;
    return null;
  }

  async createAffiliateLink(productId: string, _url?: string): Promise<string | null> {
    if (!this.isConfigured()) return null;
    return `https://lazada.vn/products/${productId}`;
  }

  async trackClick(_event: ClickEvent): Promise<void> {
    return;
  }

  private mockSearch(params: SearchParams): AffiliateProduct[] {
    return [
      { id: "lz-1", name: "Đầm đen dáng ôm", price: 950000, currency: "VND", platform: "Lazada", brand: "Zara", rating: 4.5, sold: "678", category: "Dresses", affiliateUrl: "#" },
      { id: "lz-2", name: "Quần tây đen", price: 680000, currency: "VND", platform: "Lazada", brand: "Mango", rating: 4.7, sold: "856", category: "Bottoms", affiliateUrl: "#" },
      { id: "lz-3", name: "Giày sneaker trắng", price: 1080000, currency: "VND", platform: "Lazada", brand: "Converse", rating: 4.7, sold: "4.1k", category: "Shoes", affiliateUrl: "#" },
    ].filter((p) => p.name.toLowerCase().includes(params.query.toLowerCase())).slice(0, params.limit ?? 10);
  }

  private mapProduct(p: any): AffiliateProduct {
    return {
      id: `lazada-${p.item_id ?? p.id}`,
      name: p.name ?? p.item_name ?? "",
      price: p.price ?? 0,
      currency: "VND",
      platform: "Lazada",
      imageUrl: p.image_url,
      affiliateUrl: p.affiliate_url,
      brand: p.brand,
      rating: p.rating,
      sold: p.sold_count?.toString(),
    };
  }
}

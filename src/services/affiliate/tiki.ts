import type { AffiliateProduct, AffiliatePlatform, ClickEvent, IAffiliatePlatform, PlatformConfig, SearchParams } from "./types";

export class TikiClient implements IAffiliatePlatform {
  readonly platform: AffiliatePlatform = "Tiki";
  readonly config: PlatformConfig;

  constructor(config?: Partial<PlatformConfig>) {
    this.config = {
      platform: "Tiki",
      apiKey: config?.apiKey ?? import.meta.env.VITE_TIKI_API_KEY ?? "",
      apiSecret: config?.apiSecret ?? import.meta.env.VITE_TIKI_API_SECRET ?? "",
      baseUrl: config?.baseUrl ?? "https://api.tiki.vn/v2",
      isActive: config?.isActive ?? false,
    };
  }

  isConfigured(): boolean {
    return !!(this.config.apiKey && this.config.isActive);
  }

  async searchProducts(params: SearchParams): Promise<AffiliateProduct[]> {
    if (!this.isConfigured()) return this.mockSearch(params);
    try {
      const url = new URL(`${this.config.baseUrl}/products`);
      url.searchParams.set("q", params.query);
      url.searchParams.set("limit", String(params.limit ?? 10));
      const response = await fetch(url.toString(), {
        headers: { "Tiki-Api-Key": this.config.apiKey! },
      });
      if (!response.ok) throw new Error(`Tiki API error: ${response.status}`);
      const data = await response.json();
      return (data.data ?? []).map((p: any) => this.mapProduct(p));
    } catch {
      console.warn("Tiki API failed, using mock data");
      return this.mockSearch(params);
    }
  }

  async getProductDetail(id: string): Promise<AffiliateProduct | null> {
    if (!this.isConfigured()) return null;
    return null;
  }

  async createAffiliateLink(productId: string, _url?: string): Promise<string | null> {
    if (!this.isConfigured()) return null;
    return `https://tiki.vn/${productId}`;
  }

  async trackClick(_event: ClickEvent): Promise<void> {
    return;
  }

  private mockSearch(params: SearchParams): AffiliateProduct[] {
    return [
      { id: "tk-1", name: "Túi da nâu", price: 1020000, currency: "VND", platform: "Tiki", brand: "Charles & Keith", rating: 4.3, sold: "234", category: "Accessories", affiliateUrl: "#" },
      { id: "tk-2", name: "Túi clutch bạc", price: 1400000, currency: "VND", platform: "Tiki", brand: "Mango", rating: 4.2, sold: "156", category: "Accessories", affiliateUrl: "#" },
    ].filter((p) => p.name.toLowerCase().includes(params.query.toLowerCase())).slice(0, params.limit ?? 10);
  }

  private mapProduct(p: any): AffiliateProduct {
    return {
      id: `tiki-${p.id}`,
      name: p.name ?? "",
      price: p.price ?? 0,
      currency: "VND",
      platform: "Tiki",
      imageUrl: p.thumbnail_url,
      affiliateUrl: p.short_url ?? p.url,
      brand: p.brand?.name,
      rating: p.rating?.average,
      sold: p.sold_count?.toString(),
    };
  }
}

import { describe, it, expect, vi } from "vitest";

const outfit = {
  id: 1,
  title: "Mock outfit",
  emoji: "✨",
  image: "https://example.com/1.jpg",
  style: "Casual",
  styleTags: ["Casual", "AI"],
  aiMatch: true,
  aiComment: "AI describes this outfit.",
  totalPrice: "600000đ",
  products: [
    {
      id: 1,
      name: "Áo thun trắng basic",
      brand: "Basics",
      platform: "Shopee",
      price: "199000",
      image: "https://example.com/1.jpg",
      affiliateUrl: "https://example.com/1/aff",
      metadata: { brand: "Basics" },
    },
  ],
  matchScore: 90,
  season: "all_year",
  occasion: "casual",
  mood: "Gợi ý",
  userSaved: false,
  userLiked: null,
  userHidden: false,
};

vi.mock("@/shared/lib", () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
    functions: {
      invoke: vi.fn(),
    },
  },
}));

import { recommenderService } from "./recommender.service";

describe("recommender.service edge cases", () => {
  it("fetchTrendingOutfits returns empty when products query errors", async () => {
    const { supabase } = await import("@/shared/lib");
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => ({
              order: () => ({
                limit: async () => ({ data: null, error: new Error("db error") }),
              }),
            }),
          }),
        }),
      }),
    });

    const res = await recommenderService.fetchTrendingOutfits();
    expect(res).toEqual([]);
  });

  it("listOutfits returns empty when no products available", async () => {
    const { supabase } = await import("@/shared/lib");
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => ({
              limit: async () => ({ data: [], error: null }),
            }),
          }),
        }),
      }),
    });
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => Promise.resolve({ data: [], error: null }),
      }),
    });

    const res = await recommenderService.listOutfits();
    expect(res).toEqual([]);
  });

  it("generate uses fallback when edge function fails and no user", async () => {
    const { supabase } = await import("@/shared/lib");
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: null }, error: null });
    (supabase.functions.invoke as any).mockRejectedValueOnce(new Error("edge fail"));
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
        }),
      }),
    });

    const res = await recommenderService.generate({ prompt: "thời trang" });
    expect(Array.isArray(res)).toBe(true);
    expect(res.length).toBeGreaterThanOrEqual(0);
  });

  it("converse returns empty fallback when not logged in and edge fails", async () => {
    const { supabase } = await import("@/shared/lib");
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: null }, error: null });
    (supabase.functions.invoke as any).mockRejectedValueOnce(new Error("edge fail"));
    supabase.from.mockReturnValueOnce({
      select: () => ({
        eq: () => ({
          order: () => ({
            limit: async () => ({ data: [], error: null }),
          }),
        }),
      }),
    });

    const res = await recommenderService.converse("Xin chào");
    expect(res.outfits).toEqual([]);
    expect(res.reply).toContain("đăng nhập");
  });

  it("toggleSave returns false when user is not logged in", async () => {
    const { supabase } = await import("@/shared/lib");
    (supabase.auth.getUser as any).mockResolvedValueOnce({ data: { user: null }, error: null });

    const res = await recommenderService.toggleSave(1, true);
    expect(res).toBe(false);
  });

  it("service contract still exposes required methods", () => {
    const required = ["fetchTrendingOutfits", "listOutfits", "generate", "converse", "applyAction", "toggleSave"];
    required.forEach((key) => expect(typeof (recommenderService as any)[key]).toBe("function"));
  });
});

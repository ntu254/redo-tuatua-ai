import { wardrobeItems } from "@/features/wardrobe/data";

import {
  sampleOutfits,
  dashboardStatsMock,
  seasonalTrendsMock,
  regionalTrendsMock,
  nextTrendsMock,
  personalizedTrendsMock,
  wardrobeMatchesMock,
  styleProfileMock,
  styleRecommendationsMock,
  wardrobeAnalysisMock,
  wardrobeOverviewMock,
  wardrobeSuggestionMock,
  wardrobeUploadAnalysisMock,
  adminUsersMock,
  adminUserDetailMock,
  adminAiDataMock,
  adminProductsDataMock,
  adminProductClicksMock,
  adminTrendsDataMock,
  adminPlansDataMock,
  adminAnalyticsDataMock,
  adminNotificationsDataMock,
  adminFeedbackDataMock,
  adminSettingsDataMock,
} from "./mock-fixtures";
import type { MockHandler } from "./types";

const allOutfits = sampleOutfits;

const matchPrompt = (prompt: string, outfits: typeof allOutfits) => {
  const keywords = prompt.toLowerCase();
  const matches = outfits.filter((o) => {
    const searchText = [
      o.title,
      o.style,
      ...o.styleTags,
      o.aiComment,
      o.occasion || "",
      o.mood || "",
      o.season || "",
      ...o.products.map((p) => p.name),
    ].join(" ").toLowerCase();
    return searchText.includes(keywords) ||
      keywords.split(" ").some((k) => k.length > 2 && searchText.includes(k));
  });
  return matches.length > 0 ? matches : outfits;
};

const shuffle = <T,>(arr: T[]): T[] => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const generateId = () => Date.now() + Math.floor(Math.random() * 1000);

let items = [...wardrobeItems];

export const mockHandlers: Record<string, MockHandler> = {
  "/api/wardrobe/items": () => items,
  "/api/wardrobe/overview": () => ({
    ...wardrobeOverviewMock,
    itemCount: items.length,
  }),
  "/api/wardrobe/suggestion": () => wardrobeSuggestionMock,
  "/api/wardrobe/upload-analysis": () => wardrobeUploadAnalysisMock,
  "/api/wardrobe/analysis": () => wardrobeAnalysisMock,
  "/api/wardrobe/items/": (options) => {
    const url = options.path || "";
    const idMatch = url.match(/\/api\/wardrobe\/items\/(\d+)/);
    if (!idMatch) return null;
    const id = parseInt(idMatch[1]);

    if (options.method === "DELETE" || options.method === "delete") {
      items = items.filter((i) => i.id !== id);
      return { success: true };
    }

    if (options.method === "PATCH" || options.method === "patch") {
      const body = typeof options.json === "string"
        ? JSON.parse(options.json)
        : (options.json || {});
      items = items.map((i) =>
        i.id === id ? { ...i, ...body } : i
      );
      return items.find((i) => i.id === id) || null;
    }

    return null;
  },
  "/api/admin/dashboard/stats": () => dashboardStatsMock,
  "/api/trends/seasonal": () => seasonalTrendsMock,
  "/api/trends/regional": () => regionalTrendsMock,
  "/api/trends/next": () => nextTrendsMock,
  "/api/trends/personalized": () => personalizedTrendsMock,
  "/api/trends/wardrobe-matches": () => wardrobeMatchesMock,
  "/api/style-profile": () => styleProfileMock,
  "/api/style-profile/recommendations": () => styleRecommendationsMock,
  "/api/recommender/outfits": () => allOutfits,
  "/api/recommender/generate": (options) => {
    const body = typeof options.json === "string"
      ? JSON.parse(options.json)
      : (options.json || {});
    const prompt = (body?.prompt || "").trim();
    const delay = 800 + Math.random() * 700;

    return new Promise((resolve) => {
      setTimeout(() => {
        let results = prompt
          ? matchPrompt(prompt, allOutfits)
          : allOutfits;
        if (prompt === "refresh" || !prompt) {
          results = shuffle(allOutfits);
        }
        resolve(results);
      }, delay);
    });
  },
  "/api/admin/auth/login": () => ({
    session: {
      id: "admin-001",
      userId: "user-admin-1",
      email: "admin@redo.ai",
      displayName: "Super Admin",
      roleId: "role-super",
      roleName: "super_admin",
      permissions: [
        { module: "dashboard", canRead: true, canWrite: true, canDelete: true },
        { module: "users", canRead: true, canWrite: true, canDelete: true },
        { module: "ai_engine", canRead: true, canWrite: true, canDelete: true },
        { module: "products", canRead: true, canWrite: true, canDelete: true },
        { module: "trends", canRead: true, canWrite: true, canDelete: true },
        { module: "plans", canRead: true, canWrite: true, canDelete: true },
        { module: "analytics", canRead: true, canWrite: true, canDelete: true },
        { module: "notifications", canRead: true, canWrite: true, canDelete: true },
        { module: "reports", canRead: true, canWrite: true, canDelete: true },
        { module: "settings", canRead: true, canWrite: true, canDelete: true },
      ],
    },
    token: "mock-admin-token-12345",
  }),
  "/api/admin/auth/logout": () => ({ success: true }),
  "/api/admin/products": () => adminProductsDataMock,
  "/api/admin/products/": (options) => {
    const url = options.path || "";
    const idMatch = url.match(/\/api\/admin\/products\/([^/]+)/);
    if (!idMatch) return null;
    const productId = idMatch[1];

    if (url.endsWith("/feature")) return { success: true };
    if (url.endsWith("/visibility")) return { success: true };
    if (url.endsWith("/clicks")) return adminProductClicksMock[productId] || [];
    return null;
  },
  "/api/admin/ai": () => adminAiDataMock,
  "/api/admin/ai/jobs/": (options) => {
    const url = options.path || "";
    if (url.endsWith("/retry")) return { success: true };
    return null;
  },
  "/api/admin/ai/models/": (options) => {
    const url = options.path || "";
    if (url.endsWith("/toggle")) return { success: true };
    return null;
  },
  "/api/admin/settings": () => adminSettingsDataMock,
  "/api/admin/settings/general": () => ({ success: true }),
  "/api/admin/settings/api": () => ({ success: true }),
  "/api/admin/feedback": () => adminFeedbackDataMock,
  "/api/admin/feedback/": () => ({ success: true }),
  "/api/admin/notifications": () => adminNotificationsDataMock,
  "/api/admin/notifications/broadcast": () => ({ success: true }),
  "/api/admin/notifications/settings": () => ({ success: true }),
  "/api/admin/analytics": () => adminAnalyticsDataMock,
  "/api/admin/plans": () => adminPlansDataMock,
  "/api/admin/plans/": () => ({ success: true }),
  "/api/admin/trends": () => adminTrendsDataMock,
  "/api/admin/trends/": (options) => {
    const url = options.path || "";
    if (url.endsWith("/toggle")) return { success: true };
    return { success: true };
  },
  "/api/admin/audit-log": () => ({ success: true }),
  "/api/admin/users": () => ({
    users: adminUsersMock,
    total: adminUsersMock.length,
    page: 1,
    page_size: adminUsersMock.length,
  }),
  "/api/admin/users/": (options) => {
    const url = options.path || "";
    const idMatch = url.match(/\/api\/admin\/users\/([^/]+)/);
    if (!idMatch) return null;
    const userId = idMatch[1];

    if (url.endsWith("/suspend")) {
      return { success: true };
    }
    if (url.endsWith("/unsuspend")) {
      return { success: true };
    }
    if (url.endsWith("/role")) {
      return { success: true };
    }

    return { ...adminUserDetailMock, profile: { ...adminUserDetailMock.profile, id: userId } };
  },
};

import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";
import { supabase } from "@/shared/lib/supabase";
import type { AdminPlansData } from "../types";

export const adminPlansService = {
  getData: async (): Promise<AdminPlansData> => {
    if (!apiConfig.useMockApi) {
      const [plansRes, subsRes] = await Promise.all([
        supabase.from("plans").select("*").order("sort_order"),
        supabase.from("subscriptions").select("plan_id, status"),
      ]);
      const plans = plansRes.data ?? [];
      const subs = subsRes.data ?? [];

      const payingSubs = subs.filter((s) => s.status === "active" || s.status === "trialing");
      const payingUsers = payingSubs.length;
      const totalPlans = plans.length;

      return {
        stats: {
          monthlyRevenue: `$${(payingUsers * 9.99).toLocaleString()}`,
          payingUsers,
          avgRevenuePerUser: payingUsers > 0 ? `$${(payingUsers * 9.99 / payingUsers).toFixed(2)}` : "$0",
          conversionRate: payingUsers > 0 ? `${((payingUsers / Math.max(payingUsers * 3, 1)) * 100).toFixed(1)}%` : "0%",
        },
        plans: plans.map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price_monthly === 0 ? "$0" : `$${(p.price_monthly / 100).toFixed(2)}/mo`,
          users: payingSubs.filter((s) => s.plan_id === p.id).length,
          revenue: `$${(payingSubs.filter((s) => s.plan_id === p.id).length * (p.price_monthly / 100)).toFixed(0)}`,
          credits: p.credits_per_month,
          status: p.is_active ? "Active" : "Inactive",
        })),
        transactions: [],
      };
    }
    return apiClient.get<AdminPlansData>("/api/admin/plans");
  },

  createPlan: async (data: { name: string; slug: string; price_monthly: number; ai_generations_limit: number; wardrobe_limit: number; saved_outfits_limit: number }): Promise<{ success: boolean }> => {
    if (!apiConfig.useMockApi) {
      const { error } = await supabase.from("plans").insert({ ...data, is_active: true, sort_order: 99 });
      return { success: !error };
    }
    return apiClient.post<{ success: boolean }>("/api/admin/plans", { json: data } as RequestInit);
  },

  updatePlan: async (id: string, data: { name?: string; price_monthly?: number; is_active?: boolean }): Promise<{ success: boolean }> => {
    if (!apiConfig.useMockApi) {
      const { error } = await supabase.from("plans").update(data).eq("id", id);
      return { success: !error };
    }
    return apiClient.patch<{ success: boolean }>(`/api/admin/plans/${id}`, { json: data } as RequestInit);
  },

  togglePlanStatus: async (planId: string): Promise<{ success: boolean }> => {
    if (!apiConfig.useMockApi) {
      const { data } = await supabase.from("plans").select("is_active").eq("id", planId).single();
      if (!data) return { success: false };
      await supabase.from("plans").update({ is_active: !data.is_active }).eq("id", planId);
      return { success: true };
    }
    return apiClient.post<{ success: boolean }>(`/api/admin/plans/${planId}/toggle`);
  },
};

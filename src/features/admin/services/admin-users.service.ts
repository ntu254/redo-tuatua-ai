import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";
import { supabase } from "@/shared/lib/supabase";
import type { AdminUsersResponse, UserDetail } from "../types";

export const adminUsersService = {
  listUsers: async (): Promise<AdminUsersResponse> => {
    if (!apiConfig.useMockApi) {
      const { data } = await supabase
        .from("profiles")
        .select("id, email, display_name, avatar_url, is_banned, created_at, updated_at")
        .limit(50);
      const profiles = data ?? [];
      return {
        users: profiles.map((p) => ({
          id: p.id,
          name: p.display_name ?? p.email.split("@")[0],
          email: p.email,
          avatar_url: p.avatar_url,
          date: p.created_at.slice(0, 10),
          plan: "Free",
          status: p.is_banned ? "Suspended" : "Active",
          credits_balance: 0,
          is_banned: p.is_banned,
          ai_generations: Math.floor(Math.random() * 200),
          last_active: p.updated_at?.slice(0, 10) ?? p.created_at.slice(0, 10),
          revenue: 0,
          high_ai_usage: Math.random() > 0.8,
          suspicious: Math.random() > 0.95,
        })),
        total: profiles.length,
        page: 1,
        page_size: 50,
      };
    }
    return apiClient.get<AdminUsersResponse>("/api/admin/users");
  },

  getUserDetail: async (_userId: string): Promise<UserDetail> => {
    if (!apiConfig.useMockApi) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", _userId)
        .single();
      if (!profile) throw new Error("User not found");
      return {
        profile: {
          id: profile.id,
          name: profile.display_name ?? profile.email.split("@")[0],
          email: profile.email,
          avatar_url: profile.avatar_url,
          style_dna: profile.style_dna as Record<string, number> | null,
          favorite_colors: profile.favorite_colors ?? [],
          quiz_completed: profile.quiz_completed,
          is_banned: profile.is_banned,
          ban_reason: profile.ban_reason,
          created_at: profile.created_at,
          updated_at: profile.updated_at,
        },
        subscription: null,
        credits: { balance: 0, lifetime_earned: 0, lifetime_spent: 0, recent_transactions: [] },
        ai_usage: { total_jobs: 0, successful: 0, failed: 0, avg_confidence: null, recent_jobs: [] },
      };
    }
    return apiClient.get<UserDetail>(`/api/admin/users/${_userId}`);
  },

  suspendUser: async (userId: string, reason?: string): Promise<{ success: boolean }> => {
    if (!apiConfig.useMockApi) {
      const { error } = await supabase.from("profiles").update({ is_banned: true, ban_reason: reason ?? null }).eq("id", userId);
      return { success: !error };
    }
    return apiClient.post<{ success: boolean }>(`/api/admin/users/${userId}/suspend`, { json: { reason } } as RequestInit);
  },

  unsuspendUser: async (userId: string): Promise<{ success: boolean }> => {
    if (!apiConfig.useMockApi) {
      const { error } = await supabase.from("profiles").update({ is_banned: false, ban_reason: null }).eq("id", userId);
      return { success: !error };
    }
    return apiClient.post<{ success: boolean }>(`/api/admin/users/${userId}/unsuspend`);
  },

  adjustCredits: async (userId: string, amount: number): Promise<{ success: boolean }> => {
    if (!apiConfig.useMockApi) {
      const { data: credits } = await supabase.from("user_credits").select("id, balance").eq("user_id", userId).single();
      if (credits) {
        await supabase.from("user_credits").update({ balance: credits.balance + amount }).eq("id", credits.id);
        await supabase.from("credit_transactions").insert({ user_id: userId, amount, type: "adjustment", description: `Manual adjustment by admin` });
      }
      return { success: true };
    }
    return apiClient.post<{ success: boolean }>(`/api/admin/users/${userId}/credits`, { json: { amount } } as RequestInit);
  },

  createUser: async (data: { email: string; password: string; display_name: string; plan: string }): Promise<{ success: boolean }> => {
    if (!apiConfig.useMockApi) {
      const { error } = await supabase.from("profiles").insert({
        id: crypto.randomUUID(),
        email: data.email,
        display_name: data.display_name || null,
        is_banned: false,
        quiz_completed: false,
      });
      return { success: !error };
    }
    return apiClient.post<{ success: boolean }>("/api/admin/users", { json: data } as RequestInit);
  },

  changeRole: async (_userId: string, _roleId: string): Promise<{ success: boolean }> => {
    if (!apiConfig.useMockApi) {
      const { data: adminUser } = await supabase.from("admin_users").select("id").eq("user_id", _userId).single();
      if (adminUser) {
        await supabase.from("admin_users").update({ role_id: _roleId }).eq("user_id", _userId);
      }
      return { success: true };
    }
    return apiClient.post<{ success: boolean }>(`/api/admin/users/${_userId}/role`, { json: { roleId: _roleId } } as RequestInit);
  },
};

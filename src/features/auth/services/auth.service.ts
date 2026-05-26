import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";

export interface AuthResult {
  user: { id: string; email: string };
  session: { access_token: string };
}

export type SocialProvider = "google" | "apple";

interface MockLoginResponse {
  user: { id: string; email: string };
  token: string;
}

const MOCK_AUTH_KEY = "redo_mock_auth_session";

const saveMockSession = (session: AuthResult) => {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(MOCK_AUTH_KEY, JSON.stringify(session));
  }
};

const clearMockSession = () => {
  if (typeof window !== "undefined") {
    window.localStorage.removeItem(MOCK_AUTH_KEY);
  }
};

const getMockSession = () => {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(MOCK_AUTH_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as AuthResult;
  } catch {
    clearMockSession();
    return null;
  }
};

export const authService = {
  login: async (email: string, password: string) => {
    if (apiConfig.useMockApi) {
      const res = await apiClient.post<MockLoginResponse>("/api/auth/login", { json: { email, password } });
      const session = { user: res.user, session: { access_token: res.token } };
      saveMockSession(session);
      return session;
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return {
      user: { id: data.user.id, email: data.user.email ?? "" },
      session: { access_token: data.session?.access_token ?? "" },
    };
  },

  signup: async (email: string, password: string, displayName?: string) => {
    if (apiConfig.useMockApi) {
      const res = await apiClient.post<MockLoginResponse>("/api/auth/signup", { json: { email, password, displayName } });
      const session = { user: res.user, session: { access_token: res.token } };
      saveMockSession(session);
      return session;
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    });
    if (error) throw error;
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        email: data.user.email ?? "",
        display_name: displayName ?? null,
      });
    }
    return {
      user: { id: data.user?.id ?? "", email: data.user?.email ?? "" },
      session: { access_token: data.session?.access_token ?? "" },
    };
  },

  logout: async () => {
    if (apiConfig.useMockApi) {
      clearMockSession();
      return apiClient.post("/api/auth/logout");
    }
    await supabase.auth.signOut();
  },

  requestPasswordReset: async (email: string) => {
    if (apiConfig.useMockApi) {
      return apiClient.post("/api/auth/password-reset", { json: { email } });
    }
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });
    if (error) throw error;
    return { success: true };
  },

  updatePassword: async (password: string) => {
    if (apiConfig.useMockApi) {
      return apiClient.post("/api/auth/update-password", { json: { password } });
    }
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return { success: true };
  },

  loginWithProvider: async (provider: SocialProvider) => {
    if (apiConfig.useMockApi) {
      return { success: true };
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
    return { success: true };
  },

  exportPersonalData: async () => {
    if (apiConfig.useMockApi) {
      return apiClient.get<Record<string, unknown>>("/api/auth/export-data");
    }
    const { data: profile, error: profileError } = await supabase.from("profiles").select("*").maybeSingle();
    if (profileError) throw profileError;
    const { data: wardrobe, error: wardrobeError } = await supabase.from("wardrobe_items").select("*");
    if (wardrobeError) throw wardrobeError;
    const { data: outfits, error: outfitsError } = await supabase.from("outfits").select("*");
    if (outfitsError) throw outfitsError;
    const { data: payments, error: paymentsError } = await supabase.from("payments").select("*");
    if (paymentsError) throw paymentsError;
    const { data: invoices, error: invoicesError } = await supabase.from("invoices").select("*");
    if (invoicesError) throw invoicesError;
    return {
      exportedAt: new Date().toISOString(),
      profile,
      wardrobe,
      outfits,
      payments,
      invoices,
    };
  },

  deleteAccount: async () => {
    if (apiConfig.useMockApi) {
      return apiClient.post("/api/auth/delete-account");
    }
    const { error } = await supabase.rpc("delete_my_account");
    if (error) throw error;
    return { success: true };
  },

  getSession: async () => {
    if (apiConfig.useMockApi) {
      return getMockSession();
    }
    const { data } = await supabase.auth.getSession();
    if (!data.session) return null;
    return {
      user: { id: data.session.user.id, email: data.session.user.email ?? "" },
      session: { access_token: data.session.access_token },
    };
  },

  onAuthStateChange: (callback: (session: AuthResult | null) => void) => {
    if (apiConfig.useMockApi) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) { callback(null); return; }
      callback({
        user: { id: session.user.id, email: session.user.email ?? "" },
        session: { access_token: session.access_token },
      });
    });
  },
};

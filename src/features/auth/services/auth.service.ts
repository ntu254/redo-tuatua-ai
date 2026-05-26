import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";

export interface AuthResult {
  user: { id: string; email: string };
  session: { access_token: string };
}

interface MockLoginResponse {
  user: { id: string; email: string };
  token: string;
}

export const authService = {
  login: async (email: string, password: string) => {
    if (apiConfig.useMockApi) {
      const res = await apiClient.post<MockLoginResponse>("/api/auth/login", { json: { email, password } });
      return { user: res.user, session: { access_token: res.token } };
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
      return { user: res.user, session: { access_token: res.token } };
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
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
      return apiClient.post("/api/auth/logout");
    }
    await supabase.auth.signOut();
  },

  getSession: async () => {
    if (apiConfig.useMockApi) {
      return null;
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

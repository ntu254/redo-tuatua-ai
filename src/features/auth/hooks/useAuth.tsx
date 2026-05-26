import { authService, type AuthResult } from "@/features/auth/services/auth.service";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

interface AuthContextType {
  session: AuthResult | null;
  user: AuthResult["user"] | null;
  loading: boolean;
  refreshSession: () => Promise<AuthResult | null>;
  login: (email: string, password: string) => Promise<AuthResult>;
  signup: (email: string, password: string, displayName?: string) => Promise<AuthResult>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<AuthResult | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    const current = await authService.getSession();
    setSession(current);
    return current;
  }, []);

  useEffect(() => {
    let mounted = true;

    authService
      .getSession()
      .then((current) => {
        if (mounted) setSession(current);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    const { data } = authService.onAuthStateChange((nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const nextSession = await authService.login(email, password);
    setSession(nextSession);
    return nextSession;
  }, []);

  const signup = useCallback(async (email: string, password: string, displayName?: string) => {
    const nextSession = await authService.signup(email, password, displayName);
    setSession(nextSession);
    return nextSession;
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setSession(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      refreshSession,
      login,
      signup,
      logout,
    }),
    [loading, login, logout, refreshSession, session, signup],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

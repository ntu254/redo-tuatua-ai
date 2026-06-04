import { useQuery } from "@tanstack/react-query";
import { Crown, LogOut, Search, Sparkles, User } from "lucide-react";
import { NotificationBell } from "@/features/notifications/components/NotificationBell";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { supabase } from "@/shared/lib";
import { Button } from "@/shared/ui";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Phối đồ", href: "/recommender" },
  { label: "AI Outfit", href: "/outfit-builder" },
  { label: "Tủ đồ", href: "/wardrobe" },
  { label: "Hồ sơ phong cách", href: "/style-profile" },
  { label: "Xu hướng", href: "/trends" },
  { label: "Gói Premium", href: "/pricing" },
];

interface NavbarProps {
  compact?: boolean;
}

const Navbar = ({ compact = false }: NavbarProps) => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { user, loading: authLoading, logout } = useAuth();

  const userId = user?.id ?? "";

  const { data: credits } = useQuery({
    queryKey: ["navbar-credits", userId],
    queryFn: async () => {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plans(ai_generations_limit)")
        .eq("user_id", userId)
        .maybeSingle();
      const { data: uc } = await supabase
        .from("user_credits")
        .select("balance")
        .eq("user_id", userId)
        .maybeSingle();
      return {
        balance: uc?.balance ?? 0,
        limit: sub?.plans?.ai_generations_limit ?? 10,
      };
    },
    enabled: !!userId,
  });

  const { data: profile } = useQuery({
    queryKey: ["navbar-profile", userId],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      return data;
    },
    enabled: !!userId,
  });

  const displayName = profile?.display_name ?? user?.email?.split("@")[0] ?? "User";
  const initial = displayName[0].toUpperCase();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 border-b border-border/80 backdrop-blur-xl"
          : "bg-background/76 backdrop-blur-xl"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-6">
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <span className="font-heading text-2xl font-semibold italic tracking-tight text-foreground">
            Redo
          </span>
        </Link>

        {compact ? (
          <div className="flex flex-1 items-center justify-center max-w-md mx-auto">
            <div className="relative w-full max-w-[240px]">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full bg-secondary/40 border border-border/60 pl-8 pr-3 py-1.5 text-xs font-body rounded-md focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/50"
              />
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/60" />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-end gap-1 overflow-x-auto whitespace-nowrap pl-4 md:justify-center md:gap-2 lg:gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`shrink-0 text-xs font-body transition-colors md:text-[13px] ${
                  location.pathname === link.href
                    ? "text-foreground font-medium"
                    : "text-muted-foreground/60 hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <div className={`${compact ? "flex" : "hidden xl:flex"} items-center gap-3`}>
          {user ? (
            <>
              {!compact && (
                <div className="flex items-center gap-1.5 bg-secondary/60 px-3 py-1.5 text-xs font-body text-foreground/70">
                  <Sparkles className="w-3 h-3 text-foreground/50" />
                  <span>
                    {credits?.balance ?? 0}/{credits?.limit ?? 10}
                  </span>
                </div>
              )}

              <NotificationBell />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="w-8 h-8 rounded-md overflow-hidden hover:ring-2 hover:ring-foreground/20 transition-all"
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage src={profile?.avatar_url ?? ""} />
                      <AvatarFallback className="text-xs font-semibold bg-secondary">{initial}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <p className="truncate font-body text-sm font-semibold">{displayName}</p>
                    <p className="text-[11px] font-body text-foreground/50 truncate">{user.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="w-4 h-4" />
                      Hồ sơ
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pricing" className="flex items-center gap-2 cursor-pointer">
                      <Crown className="w-4 h-4" />
                      Gói Premium
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="flex items-center gap-2 text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : authLoading ? (
            <div className="w-5 h-5 rounded-full border-2 border-foreground/20 border-t-foreground animate-spin" />
          ) : (
            <>
              <Button
                asChild
                variant={location.pathname === "/login" ? "secondary" : "outline"}
                size="sm"
                className="rounded-md"
              >
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button asChild variant="default" size="sm" className="rounded-md">
                <Link to="/signup">Đăng ký</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

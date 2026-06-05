import { useQuery } from "@tanstack/react-query";
import { Crown, LogOut, Menu, Search, Sparkles, User } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        balance: (uc as any)?.balance ?? 0,
        limit: (sub as any)?.plans?.ai_generations_limit ?? 10,
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

  const displayName = (profile as any)?.display_name ?? user?.email?.split("@")[0] ?? "User";
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
          <div className="hidden xl:flex flex-1 items-center justify-center gap-1 xl:gap-2 2xl:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`shrink-0 text-xs font-body transition-colors md:text-sm ${
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

        <div className="flex items-center gap-2.5">
          {user ? (
            <>
              {!compact && (
                <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-secondary/60 px-3 py-1.5 text-xs font-body text-foreground/70">
                  <Sparkles className="w-3.5 h-3.5 text-foreground/50" />
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
                    className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-foreground/20 transition-all"
                  >
                    <Avatar className="w-full h-full">
                      <AvatarImage src={(profile as any)?.avatar_url ?? ""} />
                      <AvatarFallback className="text-xs font-semibold bg-secondary">{initial}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuLabel>
                    <p className="truncate font-body text-sm font-semibold">{displayName}</p>
                    <p className="text-xs font-body text-foreground/50 truncate">{user.email}</p>
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
            <div className="hidden sm:flex items-center gap-2">
              <Button
                asChild
                variant={location.pathname === "/login" ? "secondary" : "outline"}
                size="sm"
                className="rounded-full"
              >
                <Link to="/login">Đăng nhập</Link>
              </Button>
              <Button asChild variant="default" size="sm" className="rounded-full">
                <Link to="/signup">Đăng ký</Link>
              </Button>
            </div>
          )}

          {/* Hamburger Menu Trigger on Mobile/Tablet */}
          {!compact && (
            <div className="xl:hidden flex items-center">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-9 h-9 p-0 text-foreground/80 hover:text-foreground focus-visible:ring-0 focus-visible:ring-offset-0"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] sm:w-[320px] flex flex-col p-6 bg-background border-l border-border/40">
                  <SheetHeader className="text-left mb-6">
                    <SheetTitle className="font-heading text-2xl italic tracking-tight text-foreground">
                      Redo
                    </SheetTitle>
                  </SheetHeader>
                  
                  {/* Navigation Links */}
                  <div className="flex flex-col gap-4 flex-1 overflow-y-auto pr-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        to={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-sm font-body font-medium transition-colors py-1 ${
                          location.pathname === link.href
                            ? "text-foreground font-semibold border-l-2 border-foreground pl-3"
                            : "text-muted-foreground/80 hover:text-foreground pl-3"
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  {/* User Profile / Actions in mobile menu drawer */}
                  <div className="border-t border-border/30 pt-6 mt-auto">
                    {user ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={(profile as any)?.avatar_url ?? ""} />
                            <AvatarFallback className="text-xs font-semibold bg-secondary">{initial}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate font-body text-sm font-semibold text-foreground">
                              {displayName}
                            </p>
                            <p className="text-xs font-body text-foreground/50 truncate">
                              {user.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between rounded-xl bg-secondary/40 px-3.5 py-2.5 text-xs font-body text-foreground/85">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-foreground/50" />
                            Lượt tạo AI
                          </span>
                          <span className="font-semibold">
                            {credits?.balance ?? 0}/{credits?.limit ?? 10}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full w-full justify-center text-xs h-9"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              window.location.assign("/profile");
                            }}
                          >
                            Hồ sơ
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            className="rounded-full w-full justify-center text-xs h-9 bg-foreground text-background hover:bg-foreground/90"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              window.location.assign("/pricing");
                            }}
                          >
                            Nâng cấp
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full justify-center text-xs text-destructive hover:bg-destructive/10 rounded-full h-9 mt-2 gap-1.5"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            void logout();
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full w-full justify-center text-xs h-9"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.location.assign("/login");
                          }}
                        >
                          Đăng nhập
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          className="rounded-full w-full justify-center text-xs h-9 bg-foreground text-background"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            window.location.assign("/signup");
                          }}
                        >
                          Đăng ký
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

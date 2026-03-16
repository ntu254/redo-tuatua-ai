import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Phối đồ", href: "/recommender" },
  { label: "Tủ đồ", href: "/wardrobe" },
  { label: "Hồ sơ phong cách", href: "/style-profile" },
  { label: "Xu hướng", href: "/trends" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/95 border-b border-border backdrop-blur-sm"
          : "bg-background/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center gap-4 px-6">
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <span className="font-heading text-2xl font-semibold italic tracking-tight text-foreground">
            StyleAI
          </span>
        </Link>

        <div className="hidden md:flex flex-1 items-center justify-center gap-5 lg:gap-8 xl:gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-[11px] font-body font-medium uppercase tracking-[0.2em] transition-colors ${
                location.pathname === link.href
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden xl:flex items-center gap-3">
          <Button variant="accent" size="sm">
            Thử miễn phí
          </Button>
        </div>

        <button
          type="button"
          className="ml-auto text-foreground md:hidden"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="space-y-3 border-b border-border bg-background px-6 py-5 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className="block py-1.5 font-body text-sm text-muted-foreground hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="accent" size="sm" className="mt-2 w-full">
            Thử miễn phí
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

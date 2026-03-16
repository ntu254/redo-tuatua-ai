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
          ? "bg-background/90 border-b border-border/80 backdrop-blur-xl shadow-[0_16px_40px_-28px_hsl(var(--primary)/0.26)]"
          : "bg-background/76 backdrop-blur-xl"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center gap-4 px-6">
        <Link to="/" className="shrink-0 flex items-center gap-2">
          <span className="font-heading text-2xl font-semibold italic tracking-tight text-foreground">
            Redo
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2 overflow-x-auto whitespace-nowrap pl-4 md:justify-center md:gap-3 lg:gap-5 xl:gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`soft-chip shrink-0 border px-3 py-2 text-[10px] font-body font-medium uppercase tracking-[0.12em] transition-all md:px-4 md:text-[11px] ${
                location.pathname === link.href
                  ? "border-primary bg-primary text-primary-foreground shadow-[0_12px_24px_-14px_hsl(var(--primary)/0.8)]"
                  : "border-border/80 bg-background/88 text-foreground/78 hover:border-accent/30 hover:bg-secondary/92 hover:text-foreground"
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
      </div>
    </nav>
  );
};

export default Navbar;

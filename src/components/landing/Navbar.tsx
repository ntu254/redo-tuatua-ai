import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Phối đồ", href: "/recommender" },
  { label: "Tủ đồ", href: "/wardrobe" },
  { label: "Style Profile", href: "/style-profile" },
  { label: "Xu hướng", href: "/trends" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "bg-background/95 backdrop-blur-sm border-b border-border" : "bg-transparent"
    }`}>
      <div className="container mx-auto flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-heading text-2xl font-semibold italic text-foreground tracking-tight">StyleAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(l => (
            <Link key={l.href} to={l.href}
              className={`text-[11px] font-body font-medium tracking-[0.2em] uppercase transition-colors ${
                location.pathname === l.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}>{l.label}</Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="accent" size="sm">Thử miễn phí</Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background border-b border-border px-6 py-5 space-y-3">
          {navLinks.map(l => (
            <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground font-body py-1.5">{l.label}</Link>
          ))}
          <Button variant="accent" size="sm" className="w-full mt-2">Thử miễn phí</Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

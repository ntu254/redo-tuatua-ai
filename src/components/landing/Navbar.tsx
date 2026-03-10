import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navLinks = [
  { label: "Trang chủ", href: "/" },
  { label: "Phối đồ", href: "/recommender" },
  { label: "Tủ đồ", href: "/wardrobe" },
  { label: "Lookbook", href: "/lookbook" },
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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-card/90 backdrop-blur-xl border-b border-border/40" : "bg-transparent"}`}>
      <div className="container mx-auto flex items-center justify-between h-[72px] px-6">
        <Link to="/" className="flex items-center gap-2.5">
          <Sparkles className="w-5 h-5 text-accent" />
          <span className="font-heading text-xl font-semibold tracking-tight text-foreground italic">StyleAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href}
              className={`text-[13px] font-body font-medium tracking-wide uppercase transition-colors ${location.pathname === l.href ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <Button variant="accent" size="sm" className="rounded-full px-6 gap-2 font-body text-xs uppercase tracking-wider">
            Thử miễn phí <Sparkles className="w-3 h-3" />
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-card/98 backdrop-blur-xl border-b border-border px-6 py-5 space-y-3">
          {navLinks.map((l) => (
            <Link key={l.href} to={l.href} onClick={() => setMobileOpen(false)}
              className="block text-sm text-muted-foreground hover:text-foreground font-body py-1.5">{l.label}</Link>
          ))}
          <Button variant="accent" size="sm" className="w-full rounded-full gap-2 mt-2">
            Thử miễn phí <Sparkles className="w-3 h-3" />
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

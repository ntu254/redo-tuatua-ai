import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const cols = [
  { title: "Sản phẩm", links: [
    { label: "Phối đồ", href: "/recommender" },
    { label: "Xu hướng", href: "/trends" },
    { label: "Lookbook", href: "/lookbook" },
    { label: "Phong cách", href: "/quiz" },
  ]},
  { title: "Sàn TMĐT", links: [
    { label: "Shopee", href: "#" },{ label: "Lazada", href: "#" },{ label: "Tiki", href: "#" },
    { label: "Zalora", href: "#" },{ label: "TikTok Shop", href: "#" },
  ]},
  { title: "Hỗ trợ", links: [
    { label: "Hướng dẫn", href: "#" },{ label: "FAQ", href: "#" },
    { label: "Liên hệ", href: "#" },{ label: "Điều khoản", href: "#" },
  ]},
];

const Footer = () => (
  <footer className="bg-cream border-t border-border py-20">
    <div className="container mx-auto px-6">
      <div className="grid md:grid-cols-4 gap-12">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-heading text-lg font-semibold italic text-foreground">StyleAI</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed font-body">
            Trợ lý phối đồ AI — giúp phong cách cá nhân hóa dễ dàng hơn bao giờ hết.
          </p>
        </div>
        {cols.map(c => (
          <div key={c.title}>
            <p className="font-body font-semibold text-xs uppercase tracking-[0.2em] text-foreground mb-5">{c.title}</p>
            <div className="space-y-3">
              {c.links.map(l => (
                <Link key={l.label} to={l.href} className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-body">{l.label}</Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-16 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground font-body">© 2026 StyleAI. Tất cả quyền được bảo lưu.</p>
        <p className="text-xs text-muted-foreground font-body">Built with Lovable ❤️</p>
      </div>
    </div>
  </footer>
);

export default Footer;

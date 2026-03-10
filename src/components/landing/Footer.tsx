import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => (
  <footer className="bg-muted/50 border-t border-border py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="font-heading font-semibold text-foreground">StyleAI</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Trợ lý phối đồ AI — giúp phong cách cá nhân hóa trở nên dễ dàng hơn bao giờ hết. Tích hợp trực tiếp với các sàn TMĐT.
          </p>
        </div>

        {[
          {
            title: "Sản phẩm",
            links: [
              { label: "Phối đồ", href: "/recommender" },
              { label: "Xu hướng", href: "/trends" },
              { label: "Bộ sưu tập", href: "/lookbook" },
              { label: "Phong cách", href: "/quiz" },
            ],
          },
          {
            title: "Sàn TMĐT",
            links: [
              { label: "Shopee", href: "#" },
              { label: "Lazada", href: "#" },
              { label: "Tiki", href: "#" },
              { label: "Zalora", href: "#" },
              { label: "TikTok Shop", href: "#" },
            ],
          },
          {
            title: "Hỗ trợ",
            links: [
              { label: "Hướng dẫn", href: "#" },
              { label: "FAQ", href: "#" },
              { label: "Liên hệ", href: "#" },
              { label: "Điều khoản", href: "#" },
            ],
          },
        ].map((col) => (
          <div key={col.title}>
            <p className="font-heading font-semibold text-sm text-foreground mb-4">{col.title}</p>
            <div className="space-y-2.5">
              {col.links.map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">
          © 2026 StyleAI. Tất cả quyền được bảo lưu.
        </p>
        <p className="text-xs text-muted-foreground">
          Built with Lovable ❤️ và AI Styling
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;

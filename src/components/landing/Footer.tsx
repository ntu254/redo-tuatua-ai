import { Link } from "react-router-dom";

const cols = [
  { title: "Products", links: [
    { label: "Outfits", href: "/recommender" },
    { label: "Style Profile", href: "/style-profile" },
    { label: "Style Quiz", href: "/quiz" },
    { label: "Trends", href: "/trends" },
  ]},
  { title: "Platforms", links: [
    { label: "Shopee", href: "#" },
    { label: "Lazada", href: "#" },
    { label: "Tiki", href: "#" },
    { label: "Zalora", href: "#" },
    { label: "TikTok Shop", href: "#" },
  ]},
  { title: "Support", links: [
    { label: "How it works", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Contact", href: "#" },
    { label: "Terms", href: "#" },
  ]},
];

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="mag-grid grid-cols-1 md:grid-cols-4">
      <div className="p-10 md:p-12">
        <span className="font-heading text-2xl italic text-foreground">StyleAI</span>
        <p className="text-xs text-muted-foreground font-body leading-relaxed mt-4 max-w-[200px]">
          AI-powered outfit styling — making personal fashion easier than ever.
        </p>
      </div>
      {cols.map(c => (
        <div key={c.title} className="p-10 md:p-12">
          <p className="editorial-label mb-5">{c.title}</p>
          <div className="space-y-3">
            {c.links.map(l => (
              <Link key={l.label} to={l.href} className="block text-sm text-muted-foreground hover:text-foreground transition-colors font-body">{l.label}</Link>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="border-t border-border px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
      <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">© 2026 StyleAI. All rights reserved.</p>
      <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">Built with Lovable ❤️</p>
    </div>
  </footer>
);

export default Footer;

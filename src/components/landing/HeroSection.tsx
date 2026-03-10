import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImg1 from "@/assets/hero-fashion-1.jpg";
import heroImg2 from "@/assets/hero-fashion-2.jpg";

const floatingTags = [
  { label: "Casual Chic", color: "bg-accent text-accent-foreground", top: "8%", right: "2%" },
  { label: "Streetwear", color: "bg-[#3B82F6] text-accent-foreground", top: "18%", right: "15%" },
  { label: "Accessories", color: "bg-[#22C55E] text-accent-foreground", top: "13%", right: "30%" },
];

const HeroSection = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setRevealed(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-screen bg-background pt-20 overflow-hidden">
      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-8 items-center min-h-[calc(100vh-5rem)]">
        {/* Left */}
        <div className="space-y-6 max-w-xl">
          <div className="flex items-center gap-2 text-sm text-accent font-heading font-medium">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent" />
            AI Stylist · Gợi ý outfit thông minh
          </div>

          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
            <span className={`inline-block ${revealed ? "blur-text-reveal" : "opacity-0"}`}>
              Tìm Phong Cách
            </span>
            <br />
            <span className={`inline-block ${revealed ? "blur-text-reveal blur-text-reveal-delay-1" : "opacity-0"}`}>
              Riêng Của Bạn
            </span>
          </h1>

          <p className={`text-muted-foreground text-base md:text-lg leading-relaxed max-w-md ${revealed ? "blur-text-reveal blur-text-reveal-delay-2" : "opacity-0"}`}>
            Mô tả phong cách bạn muốn — AI gợi ý outfit hoàn chỉnh và
            dẫn thẳng đến sản phẩm tốt nhất trên Shopee, Lazada,
            Tiki và hơn thế nữa.
          </p>

          <div className={`flex gap-3 ${revealed ? "blur-text-reveal blur-text-reveal-delay-3" : "opacity-0"}`}>
            <Button variant="hero" size="lg" className="gap-2">
              Phối đồ ngay <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="hero-outline" size="lg">
              Xem demo
            </Button>
          </div>

          <div className={`flex items-center gap-3 ${revealed ? "blur-text-reveal blur-text-reveal-delay-4" : "opacity-0"}`}>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-background bg-muted"
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">12,400+</span> người đang dùng hôm nay
            </p>
          </div>
        </div>

        {/* Right - Fashion images */}
        <div className="relative hidden lg:block h-[600px]">
          <div className="absolute top-8 right-0 w-[320px] h-[440px] rounded-2xl overflow-hidden">
            <img
              src={heroImg1}
              alt="Fashion model in coral dress"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
          <div className="absolute bottom-4 left-4 w-[200px] h-[260px] rounded-2xl overflow-hidden">
            <img
              src={heroImg2}
              alt="Casual style outfit"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>

          {/* Floating tags */}
          {floatingTags.map((tag) => (
            <div
              key={tag.label}
              className={`absolute ${tag.color} px-3 py-1.5 rounded-full text-xs font-heading font-medium`}
              style={{ top: tag.top, right: tag.right }}
            >
              {tag.label}
            </div>
          ))}

          {/* AI chip card */}
          <div className="absolute bottom-16 right-0 bg-card rounded-xl border border-border p-3 min-w-[160px]">
            <p className="text-xs text-muted-foreground mb-1">Gợi ý hôm nay</p>
            <p className="text-sm font-heading font-semibold text-foreground">Casual Chic ✨</p>
            <div className="flex gap-1.5 mt-2">
              <span className="w-5 h-5 rounded-full bg-accent" />
              <span className="w-5 h-5 rounded-full bg-[#3B82F6]" />
              <span className="w-5 h-5 rounded-full bg-[#22C55E]" />
            </div>
          </div>
        </div>
      </div>

      {/* Partners bar */}
      <div className="border-t border-border bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <p className="text-xs text-muted-foreground text-center mb-4 font-heading uppercase tracking-widest">
            Gợi ý sản phẩm từ các sàn TMĐT hàng đầu Việt Nam
          </p>
          <div className="flex items-center justify-center gap-8 md:gap-16 text-muted-foreground">
            {["Shopee", "Lazada", "Tiki", "Zalora", "TikTok Shop"].map((name) => (
              <span key={name} className="text-sm font-heading font-medium opacity-50 hover:opacity-100 transition-opacity cursor-default">
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

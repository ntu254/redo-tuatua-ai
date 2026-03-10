import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImg1 from "@/assets/hero-fashion-1.jpg";
import heroImg2 from "@/assets/hero-fashion-2.jpg";

const floatingTags = [
  { label: "Casual Chic", bg: "bg-peach-light text-foreground", top: "6%", right: "0%" },
  { label: "Streetwear", bg: "bg-sky-light text-foreground", top: "16%", right: "18%" },
  { label: "Accessories", bg: "bg-sage-light text-foreground", top: "10%", right: "35%" },
];

const HeroSection = () => {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setRevealed(true), 100); }, []);

  return (
    <section className="relative min-h-screen bg-background pt-24 overflow-hidden">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-6rem)]">
        <div className="space-y-8 max-w-lg">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 text-xs font-body font-medium uppercase tracking-[0.2em] text-accent">
            <span className="w-8 h-px bg-accent" />
            AI Stylist · Gợi ý outfit thông minh
          </motion.div>

          <h1 className="font-heading text-5xl md:text-6xl lg:text-[4.5rem] font-semibold leading-[1.08] text-foreground">
            <span className={`inline-block ${revealed ? "blur-text-reveal" : "opacity-0"}`}>
              Tìm Phong Cách
            </span>
            <br />
            <span className={`inline-block italic ${revealed ? "blur-text-reveal blur-text-reveal-delay-1" : "opacity-0"}`}>
              Riêng Của Bạn
            </span>
          </h1>

          <p className={`text-muted-foreground text-base leading-relaxed max-w-md font-body ${revealed ? "blur-text-reveal blur-text-reveal-delay-2" : "opacity-0"}`}>
            Mô tả phong cách bạn muốn — AI gợi ý outfit hoàn chỉnh và
            dẫn thẳng đến sản phẩm tốt nhất trên Shopee, Lazada,
            Tiki và hơn thế nữa.
          </p>

          <div className={`flex gap-4 ${revealed ? "blur-text-reveal blur-text-reveal-delay-3" : "opacity-0"}`}>
            <Button variant="hero" size="lg" className="gap-2 text-sm">
              Phối đồ ngay <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="hero-outline" size="lg" className="text-sm">
              Xem demo
            </Button>
          </div>

          <div className={`flex items-center gap-3 pt-2 ${revealed ? "blur-text-reveal blur-text-reveal-delay-4" : "opacity-0"}`}>
            <div className="flex -space-x-2">
              {[0,1,2].map(i => (
                <div key={i} className="w-9 h-9 rounded-full border-2 border-background bg-cream-dark" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body">
              <span className="font-semibold text-foreground">12,400+</span> người đang dùng
            </p>
          </div>
        </div>

        {/* Right images */}
        <div className="relative hidden lg:block h-[620px]">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
            className="absolute top-4 right-0 w-[300px] h-[420px] rounded-3xl overflow-hidden">
            <img src={heroImg1} alt="Fashion editorial" className="w-full h-full object-cover" loading="eager" />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-8 left-8 w-[200px] h-[270px] rounded-3xl overflow-hidden">
            <img src={heroImg2} alt="Casual style" className="w-full h-full object-cover" loading="eager" />
          </motion.div>

          {floatingTags.map((tag, i) => (
            <motion.div key={tag.label} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8 + i * 0.15 }}
              className={`absolute ${tag.bg} px-4 py-2 rounded-full text-xs font-body font-medium`}
              style={{ top: tag.top, right: tag.right }}>
              {tag.label}
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
            className="absolute bottom-20 right-0 bg-card rounded-2xl border border-border p-4 min-w-[170px]">
            <p className="text-[11px] text-muted-foreground font-body uppercase tracking-wider mb-1.5">Gợi ý hôm nay</p>
            <p className="text-sm font-heading font-semibold text-foreground italic">Casual Chic ✨</p>
            <div className="flex gap-2 mt-3">
              <span className="w-5 h-5 rounded-full bg-peach" />
              <span className="w-5 h-5 rounded-full bg-sky" />
              <span className="w-5 h-5 rounded-full bg-sage" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Partners */}
      <div className="border-t border-border/60 bg-cream/50 mt-8">
        <div className="container mx-auto px-6 py-8">
          <p className="text-[11px] text-muted-foreground text-center mb-5 font-body uppercase tracking-[0.25em]">
            Sản phẩm từ các sàn TMĐT hàng đầu Việt Nam
          </p>
          <div className="flex items-center justify-center gap-10 md:gap-16">
            {["Shopee", "Lazada", "Tiki", "Zalora", "TikTok Shop"].map(n => (
              <span key={n} className="text-sm font-body font-medium text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default">{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

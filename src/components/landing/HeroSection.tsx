import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import heroImg1 from "@/assets/hero-fashion-1.jpg";
import heroImg2 from "@/assets/hero-fashion-2.jpg";

const HeroSection = () => {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => { setTimeout(() => setRevealed(true), 100); }, []);

  return (
    <section className="min-h-screen bg-background pt-16">
      {/* Editorial grid hero */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] min-h-[calc(100vh-4rem)]">
        {/* Left — text block */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 xl:px-28 py-24 lg:py-32">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="editorial-label mb-10">
            <span className="inline-block w-8 h-px bg-accent mr-3 align-middle" />
            AI Stylist · Issue 01
          </motion.p>

          <h1 className="font-heading text-6xl md:text-7xl lg:text-[80px] xl:text-[84px] font-light leading-[1.08] tracking-[-0.02em] text-foreground mb-8">
            <span className={`block ${revealed ? "blur-text-reveal" : "opacity-0"}`}>
              Tìm Phong Cách
            </span>
            <span className={`block italic font-normal ${revealed ? "blur-text-reveal blur-text-reveal-delay-1" : "opacity-0"}`}>
              Riêng Của Bạn
            </span>
          </h1>

          <p className={`text-muted-foreground/70 text-base leading-relaxed max-w-[420px] font-body mb-12 ${revealed ? "blur-text-reveal blur-text-reveal-delay-2" : "opacity-0"}`}>
            Mô tả phong cách bạn muốn — AI gợi ý outfit hoàn chỉnh và dẫn thẳng đến sản phẩm tốt nhất trên Shopee, Lazada, Tiki và hơn thế nữa.
          </p>

          <div className={`flex gap-4 mb-16 ${revealed ? "blur-text-reveal blur-text-reveal-delay-3" : "opacity-0"}`}>
            <Button className="bg-foreground text-background hover:bg-foreground/90 px-7 py-3.5 h-auto text-sm font-body font-medium tracking-wide rounded-none gap-2.5">
              Phối đồ ngay <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" className="border-border text-foreground hover:bg-secondary px-7 py-3.5 h-auto text-sm font-body font-medium tracking-wide rounded-none">
              Xem demo
            </Button>
          </div>

          <div className={`flex items-center gap-5 ${revealed ? "blur-text-reveal blur-text-reveal-delay-4" : "opacity-0"}`}>
            <div className="flex -space-x-2">
              {[0,1,2].map(i => <div key={i} className="w-9 h-9 rounded-full border-2 border-background bg-secondary" />)}
            </div>
            <p className="text-xs text-muted-foreground font-body">
              <span className="font-semibold text-foreground">12,400+</span> người đang dùng
            </p>
          </div>
        </div>

        {/* Right — editorial image grid: hero 70%, secondary 30% */}
        <div className="hidden lg:grid grid-rows-[2fr_1fr]">
          {/* Hero image — large, dominant */}
          <div className="mag-img-zoom relative">
            <img src={heroImg1} alt="Fashion editorial" className="w-full h-full object-cover" loading="eager" />
            {/* Overlay suggestion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-8 left-8 bg-background/85 backdrop-blur-md px-6 py-5 max-w-[260px]"
            >
              <p className="editorial-label mb-2">Gợi ý hôm nay</p>
              <p className="font-heading text-2xl italic text-foreground mb-3">Casual Chic</p>
              <div className="flex gap-2">
                <span className="w-5 h-5 rounded-full bg-accent" />
                <span className="w-5 h-5 rounded-full bg-teal" />
                <span className="w-5 h-5 rounded-full bg-foreground" />
              </div>
            </motion.div>
          </div>

          {/* Secondary images — smaller row */}
          <div className="grid grid-cols-2">
            <div className="mag-img-zoom border-t border-r border-border">
              <img src={heroImg2} alt="Casual style" className="w-full h-full object-cover" loading="eager" />
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex flex-col justify-center items-start p-8 bg-secondary border-t border-border"
            >
              <p className="editorial-label mb-4">Trending styles</p>
              <div className="flex flex-wrap gap-2">
                {["Casual Chic","Streetwear","Accessories"].map((tag, i) => (
                  <span key={tag} className={`px-4 py-2 text-xs font-body font-medium uppercase tracking-wider ${
                    i === 0 ? "bg-coral-light text-foreground" : i === 1 ? "bg-teal-light text-foreground" : "bg-background text-foreground"
                  }`}>{tag}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Partners bar */}
      <div className="border-t border-b border-border">
        <div className="container mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="editorial-label">Sản phẩm từ các sàn TMĐT hàng đầu</p>
          <div className="flex items-center gap-8 md:gap-14">
            {["Shopee","Lazada","Tiki","Zalora","TikTok Shop"].map(n => (
              <span key={n} className="text-xs font-body font-medium text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default uppercase tracking-wider">{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

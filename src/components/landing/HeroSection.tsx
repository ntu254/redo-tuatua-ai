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
      {/* Magazine grid hero */}
      <div className="mag-grid grid-cols-1 lg:grid-cols-[1fr_1fr] min-h-[calc(100vh-4rem)]">
        {/* Left — text */}
        <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20">
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="editorial-label mb-8">
            <span className="inline-block w-6 h-px bg-accent mr-3 align-middle" />
            AI Stylist · Issue 01
          </motion.p>

          <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] tracking-tight text-foreground mb-8">
            <span className={`block ${revealed ? "blur-text-reveal" : "opacity-0"}`}>
              Tìm Phong Cách
            </span>
            <span className={`block italic font-normal ${revealed ? "blur-text-reveal blur-text-reveal-delay-1" : "opacity-0"}`}>
              Riêng Của Bạn
            </span>
          </h1>

          <p className={`text-muted-foreground text-sm leading-relaxed max-w-sm font-body mb-10 ${revealed ? "blur-text-reveal blur-text-reveal-delay-2" : "opacity-0"}`}>
            Mô tả phong cách bạn muốn — AI gợi ý outfit hoàn chỉnh và dẫn thẳng đến sản phẩm tốt nhất trên Shopee, Lazada, Tiki và hơn thế nữa.
          </p>

          <div className={`flex gap-3 mb-12 ${revealed ? "blur-text-reveal blur-text-reveal-delay-3" : "opacity-0"}`}>
            <Button variant="hero" size="lg" className="gap-2">
              Phối đồ ngay <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button variant="hero-outline" size="lg">Xem demo</Button>
          </div>

          <div className={`flex items-center gap-4 ${revealed ? "blur-text-reveal blur-text-reveal-delay-4" : "opacity-0"}`}>
            <div className="flex -space-x-2">
              {[0,1,2].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-secondary" />)}
            </div>
            <p className="text-xs text-muted-foreground font-body">
              <span className="font-semibold text-foreground">12,400+</span> người đang dùng
            </p>
          </div>
        </div>

        {/* Right — magazine image grid */}
        <div className="hidden lg:grid mag-grid grid-cols-2 grid-rows-2">
          <div className="mag-img-zoom">
            <img src={heroImg1} alt="Fashion editorial" className="w-full h-full object-cover" loading="eager" />
          </div>
          <div className="flex flex-col justify-center items-center p-8 bg-secondary">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <p className="editorial-label mb-3">Gợi ý hôm nay</p>
              <p className="font-heading text-3xl italic text-foreground mb-4">Casual Chic</p>
              <div className="flex gap-2">
                <span className="w-6 h-6 rounded-full bg-accent" />
                <span className="w-6 h-6 rounded-full bg-teal" />
                <span className="w-6 h-6 rounded-full bg-foreground" />
              </div>
            </motion.div>
          </div>
          <div className="flex flex-col justify-center p-8 bg-off-white">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
              className="space-y-3">
              {["Casual Chic","Streetwear","Accessories"].map((tag, i) => (
                <span key={tag} className={`inline-block mr-2 px-4 py-1.5 text-[10px] font-body font-medium uppercase tracking-wider ${
                  i === 0 ? "bg-coral-light text-foreground" : i === 1 ? "bg-teal-light text-foreground" : "bg-secondary text-foreground"
                }`}>{tag}</span>
              ))}
            </motion.div>
          </div>
          <div className="mag-img-zoom">
            <img src={heroImg2} alt="Casual style" className="w-full h-full object-cover" loading="eager" />
          </div>
        </div>
      </div>

      {/* Partners bar — editorial strip */}
      <div className="border-t border-b border-border">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="editorial-label">Sản phẩm từ các sàn TMĐT hàng đầu</p>
          <div className="flex items-center gap-8 md:gap-12">
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

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-main-new.jpg";
import outfitImg from "@/assets/outfit-flatlay-new.jpg";

const chatMessages = [
  { role: "user" as const, text: "Tôi cần outfit đi cà phê cuối tuần" },
  { role: "ai" as const, text: "Đây là 3 gợi ý casual chic phù hợp cho bạn! ☕" },
];

const outfitCards = [
  { name: "Áo thun cotton", price: "163K", platform: "Shopee" },
  { name: "Quần jeans slim", price: "389K", platform: "Lazada" },
  { name: "Sneaker trắng", price: "329K", platform: "Tiki" },
];

const HeroSection = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setRevealed(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <section ref={sectionRef} className="min-h-screen overflow-hidden bg-background pt-20">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid min-h-[calc(100vh-5rem)] grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <motion.div style={{ y: textY }} className="py-10 lg:py-24 lg:pr-16">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="soft-chip mb-8 inline-flex items-center gap-2 border border-accent/20 bg-secondary/72 px-4 py-2 shadow-[0_14px_30px_-24px_hsl(var(--accent)/0.6)]"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span className="text-[10px] font-body font-semibold uppercase tracking-[0.25em] text-accent">
                Thời trang AI
              </span>
            </motion.div>

            <h1 className="mb-8 font-heading text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-foreground md:text-6xl xl:text-7xl">
              <span className={`block ${revealed ? "blur-text-reveal" : "opacity-0"}`}>
                Tìm Outfit Hoàn Hảo
              </span>
              <span
                className={`gradient-text block font-medium ${
                  revealed ? "blur-text-reveal blur-text-reveal-delay-1" : "opacity-0"
                }`}
              >
                Với Trợ Lý AI
              </span>
            </h1>

            <p
              className={`mb-10 max-w-md text-base leading-relaxed text-muted-foreground ${
                revealed ? "blur-text-reveal blur-text-reveal-delay-2" : "opacity-0"
              }`}
            >
              Mô tả phong cách của bạn và nhận gợi ý outfit ngay lập tức kèm link mua hàng từ Shopee,
              Lazada, Tiki và nhiều sàn khác.
            </p>

            <div
              className={`mb-14 flex flex-col gap-3 sm:flex-row ${
                revealed ? "blur-text-reveal blur-text-reveal-delay-3" : "opacity-0"
              }`}
            >
              <Button variant="accent" size="lg" className="gap-2">
                Nhận gợi ý outfit AI <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button variant="hero-outline" size="lg">
                Xem cách hoạt động
              </Button>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className={`soft-panel max-w-md p-5 ${revealed ? "" : "opacity-0"}`}
            >
              <p className="editorial-label mb-4">Xem trước AI Stylist</p>
              <div className="mb-4 space-y-3">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                    className={`max-w-[85%] rounded-[22px] px-4 py-2.5 ${
                        message.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/92 text-foreground"
                      }`}
                    >
                      <p className="text-xs font-body">{message.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                {outfitCards.map((card) => (
                  <div
                    key={card.name}
                    className="flex-1 rounded-2xl border border-border/90 bg-background/88 p-2.5"
                  >
                    <div className="mb-2 aspect-square w-full rounded-xl bg-secondary" />
                    <p className="truncate text-[10px] font-body font-medium text-foreground">{card.name}</p>
                    <div className="mt-1 flex items-center justify-between">
                      <span className="text-[10px] font-body font-semibold text-accent">{card.price}</span>
                      <span className="text-[8px] font-body uppercase text-muted-foreground">
                        {card.platform}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <div className="relative mt-12 pb-16 lg:mt-0 lg:pb-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              style={{ y: imgY }}
              className="relative mx-auto max-w-md lg:max-w-none"
            >
              <div className="mag-img-zoom aspect-[3/4] max-h-[70vh] rounded-[36px] border border-border/70 shadow-[0_34px_84px_-34px_hsl(var(--primary)/0.34)] lg:max-h-[85vh]">
                <img
                  src={heroImg}
                  alt="Thời trang editorial - Outfit được AI phối"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="soft-panel absolute bottom-6 left-4 w-56 p-4 sm:bottom-8 sm:left-6 lg:-left-12 lg:bottom-24"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-12 w-12 overflow-hidden rounded-xl">
                    <img src={outfitImg} alt="Gợi ý outfit" className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-body font-semibold text-foreground">Casual Chic Set</p>
                    <div className="mt-0.5 flex items-center gap-1">
                      <Star className="h-2.5 w-2.5 fill-accent text-accent" />
                      <span className="text-[9px] font-body text-muted-foreground">4.8 · AI phù hợp 96%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {["#F5DEB3", "#6B8E23", "#4682B4"].map((color) => (
                    <span
                      key={color}
                      className="h-4 w-4 rounded-full border border-border"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <span className="ml-auto text-[9px] font-body font-semibold text-accent">881K</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute left-4 top-6 rounded-full bg-accent px-4 py-2 text-accent-foreground shadow-[0_16px_34px_-20px_hsl(var(--accent)/0.82)] sm:left-6 lg:-left-6 lg:top-8"
              >
                <p className="text-[10px] font-body font-bold uppercase tracking-wider">AI phối đồ</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="border-y border-border/70 bg-background/55">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-6 py-6 md:flex-row">
          <p className="editorial-label">Sản phẩm từ các sàn thương mại điện tử hàng đầu</p>
          <div className="flex items-center gap-8 md:gap-12">
            {[
              { name: "Shopee", color: "text-shopee" },
              { name: "Lazada", color: "text-lazada" },
              { name: "Tiki", color: "text-tiki" },
              { name: "Zalora", color: "text-zalora" },
              { name: "TikTok Shop", color: "text-tiktok" },
            ].map((partner) => (
              <span
                key={partner.name}
                className={`text-xs font-body font-semibold uppercase tracking-wider ${partner.color} opacity-60 transition-opacity hover:opacity-100`}
              >
                {partner.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Send, Star } from "lucide-react";
import { motion } from "framer-motion";
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
  useEffect(() => { setTimeout(() => setRevealed(true), 100); }, []);

  return (
    <section className="min-h-screen bg-background pt-16 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[calc(100vh-4rem)] items-center">
          {/* Left — text + value prop */}
          <div className="py-16 lg:py-24 lg:pr-16">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-coral-light mb-8">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span className="text-[10px] font-body font-semibold uppercase tracking-[0.25em] text-accent">AI-Powered Fashion</span>
            </motion.div>

            <h1 className="font-heading text-5xl md:text-6xl xl:text-7xl font-light leading-[1.05] tracking-tight text-foreground mb-8">
              <span className={`block ${revealed ? "blur-text-reveal" : "opacity-0"}`}>
                Find Your Perfect
              </span>
              <span className={`block italic font-normal ${revealed ? "blur-text-reveal blur-text-reveal-delay-1" : "opacity-0"}`}>
                Outfit with AI
              </span>
            </h1>

            <p className={`text-muted-foreground text-base leading-relaxed max-w-md font-body mb-10 ${revealed ? "blur-text-reveal blur-text-reveal-delay-2" : "opacity-0"}`}>
              Describe your style and get instant outfit suggestions with shopping links from Shopee, Lazada, Tiki and more.
            </p>

            <div className={`flex flex-col sm:flex-row gap-3 mb-14 ${revealed ? "blur-text-reveal blur-text-reveal-delay-3" : "opacity-0"}`}>
              <Button variant="accent" size="lg" className="gap-2">
                Get AI Outfit Suggestions <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button variant="hero-outline" size="lg">See how it works</Button>
            </div>

            {/* Mini chat preview */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className={`bg-off-white border border-border p-5 max-w-md ${revealed ? "" : "opacity-0"}`}>
              <p className="editorial-label mb-4">AI Stylist Preview</p>
              <div className="space-y-3 mb-4">
                {chatMessages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`px-4 py-2.5 max-w-[85%] ${m.role === "user" ? "bg-foreground text-background" : "bg-secondary text-foreground"}`}>
                      <p className="text-xs font-body">{m.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Mini outfit cards */}
              <div className="flex gap-2">
                {outfitCards.map(c => (
                  <div key={c.name} className="flex-1 bg-background border border-border p-2.5">
                    <div className="w-full aspect-square bg-secondary mb-2" />
                    <p className="text-[10px] font-body font-medium text-foreground truncate">{c.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] font-body font-semibold text-accent">{c.price}</span>
                      <span className="text-[8px] font-body text-muted-foreground uppercase">{c.platform}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right — fashion imagery */}
          <div className="hidden lg:block relative">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative">
              {/* Main hero image */}
              <div className="mag-img-zoom aspect-[3/4] max-h-[85vh]">
                <img src={heroImg} alt="Fashion editorial - AI styled outfit" className="w-full h-full object-cover" loading="eager" />
              </div>

              {/* Floating outfit card */}
              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute -left-12 bottom-24 bg-background border border-border p-4 shadow-lg w-56">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 overflow-hidden">
                    <img src={outfitImg} alt="Outfit suggestion" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-[10px] font-body font-semibold text-foreground">Casual Chic Set</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-2.5 h-2.5 fill-accent text-accent" />
                      <span className="text-[9px] font-body text-muted-foreground">4.8 · AI Match 96%</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  {["#F5DEB3", "#6B8E23", "#4682B4"].map(c => (
                    <span key={c} className="w-4 h-4 border border-border" style={{ backgroundColor: c }} />
                  ))}
                  <span className="ml-auto text-[9px] font-body font-semibold text-accent">881K</span>
                </div>
              </motion.div>

              {/* Floating tag */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                className="absolute top-8 -left-6 bg-accent text-accent-foreground px-4 py-2">
                <p className="text-[10px] font-body font-bold uppercase tracking-wider">AI Styled</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Partners bar */}
      <div className="border-t border-b border-border">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="editorial-label">Products from top e-commerce platforms</p>
          <div className="flex items-center gap-8 md:gap-12">
            {["Shopee", "Lazada", "Tiki", "Zalora", "TikTok Shop"].map(n => (
              <span key={n} className="text-xs font-body font-medium text-muted-foreground/40 hover:text-muted-foreground transition-colors cursor-default uppercase tracking-wider">{n}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

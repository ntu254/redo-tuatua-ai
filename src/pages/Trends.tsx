import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, ArrowRight, Sparkles, Heart, Bookmark, Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import casualImg from "@/assets/style-casual-new.jpg";
import officeImg from "@/assets/style-office-new.jpg";
import partyImg from "@/assets/style-party-new.jpg";
import streetImg from "@/assets/style-streetwear-new.jpg";
import athleisureImg from "@/assets/style-athleisure-new.jpg";
import dateNightImg from "@/assets/style-datenight-new.jpg";
import minimalImg from "@/assets/style-minimal-new.jpg";
import kfashionImg from "@/assets/lookbook-kfashion.jpg";

const categories = ["All", "Summer 2026", "Color Trends", "Hot Items", "Social Media", "Runway Inspired"];

interface Trend {
  title: string;
  image: string;
  tag: string;
  hot: boolean;
  desc: string;
  featured?: boolean;
  aiInsight?: string;
  size: "sm" | "md" | "lg";
}

const trends: Trend[] = [
  {
    title: "Butter Yellow",
    image: casualImg,
    tag: "Color Trend",
    hot: true,
    desc: "The butter yellow shade dominates summer collections — versatile from casual to office wear.",
    featured: true,
    aiInsight: "Butter yellow appears in 38% of summer 2026 collections.",
    size: "lg",
  },
  {
    title: "Linen Everything",
    image: officeImg,
    tag: "Summer 2026",
    hot: true,
    desc: "Linen makes a powerful comeback, from blazers to wide-leg trousers.",
    aiInsight: "Linen searches increased 64% this season.",
    size: "md",
  },
  {
    title: "Maxi Renaissance",
    image: partyImg,
    tag: "Hot Items",
    hot: false,
    desc: "Maxi skirts return with pleats and subtle cut-outs for an elegant silhouette.",
    size: "sm",
  },
  {
    title: "Gorpcore Rising",
    image: streetImg,
    tag: "Streetwear",
    hot: true,
    desc: "Outdoor meets streetwear: windbreakers, hiking shoes, utility bags.",
    aiInsight: "Gorpcore styling requests up 45% on StyleAI.",
    size: "md",
  },
  {
    title: "Elevated Athleisure",
    image: athleisureImg,
    tag: "Hot Items",
    hot: false,
    desc: "Athleisure gets refined — mixed with blazers and premium accessories.",
    size: "sm",
  },
  {
    title: "Quiet Luxury",
    image: minimalImg,
    tag: "Summer 2026",
    hot: true,
    desc: "Premium fabrics, perfect cuts, no logos — the trend for the discerning.",
    featured: false,
    aiInsight: "Quiet luxury outfits have 2.3x higher save rates.",
    size: "lg",
  },
  {
    title: "K-Fashion Wave",
    image: kfashionImg,
    tag: "Social Media",
    hot: true,
    desc: "Korean fashion aesthetics continue to shape global trends with layered, oversized silhouettes.",
    size: "md",
  },
  {
    title: "Date Night Glam",
    image: dateNightImg,
    tag: "Runway Inspired",
    hot: false,
    desc: "Romantic, elevated evening looks with silk, satin, and understated sparkle.",
    size: "sm",
  },
];

const Trends = () => {
  const [activeFilter, setActiveFilter] = useState(0);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const navigate = useNavigate();

  const filtered = activeFilter === 0 ? trends : trends.filter(t => t.tag === categories[activeFilter]);

  const toggleSave = (i: number) => {
    setSaved(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const toggleLike = (i: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  // Masonry-style aspect ratios
  const getAspect = (size: string) => {
    switch (size) {
      case "lg": return "aspect-[3/4]";
      case "md": return "aspect-[4/5]";
      case "sm": return "aspect-[3/4]";
      default: return "aspect-[4/5]";
    }
  };

  // Grid span classes for masonry effect
  const getGridSpan = (size: string, index: number) => {
    if (size === "lg") return "md:col-span-2 md:row-span-2";
    return "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-16">
        <section className="relative overflow-hidden">
          <div className="px-6 py-20 md:py-28">
            <div className="container mx-auto max-w-5xl text-center">
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="editorial-label mb-5"
              >
                StyleAI Curated
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-5xl md:text-7xl font-light text-foreground mb-6"
              >
                Fashion <span className="italic">Trends</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="font-body text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed"
              >
                Discover the latest fashion trends curated by StyleAI.
                Explore colors, styles, and items trending right now.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8 flex items-center justify-center gap-3"
              >
                <button
                  onClick={() => navigate("/recommender")}
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[10px] font-body font-medium uppercase tracking-[0.2em] hover:bg-foreground/85 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Generate Outfit
                </button>
              </motion.div>
            </div>
          </div>
          <div className="border-b border-border" />
        </section>

        {/* Filter Bar — pill style */}
        <div className="sticky top-16 z-30 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container mx-auto max-w-6xl px-6 py-4 flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((c, i) => (
              <button
                key={c}
                onClick={() => setActiveFilter(i)}
                className={`px-5 py-2 text-[10px] font-body font-medium tracking-[0.15em] uppercase whitespace-nowrap transition-all ${
                  i === activeFilter
                    ? "bg-foreground text-background"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Masonry Grid */}
        <div className="container mx-auto max-w-7xl px-4 md:px-6 py-10 md:py-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="columns-1 md:columns-2 lg:columns-3 gap-4 md:gap-5 space-y-4 md:space-y-5"
            >
              {filtered.map((t, i) => {
                const globalIndex = trends.indexOf(t);
                const isSaved = saved.has(globalIndex);
                const isLiked = liked.has(globalIndex);

                return (
                  <motion.article
                    key={t.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className={`break-inside-avoid group cursor-pointer relative overflow-hidden bg-card ${
                      t.featured ? "lg:column-span-all" : ""
                    }`}
                  >
                    {/* Image Container */}
                    <div className={`relative overflow-hidden ${getAspect(t.size)}`}>
                      <img
                        src={t.image}
                        alt={t.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />

                      {/* Tags top-left */}
                      <div className="absolute top-4 left-4 flex flex-wrap gap-1.5">
                        <span className="bg-background/90 backdrop-blur-sm text-foreground text-[9px] font-body font-medium px-3 py-1 uppercase tracking-wider">
                          {t.tag}
                        </span>
                        {t.hot && (
                          <span className="bg-accent text-accent-foreground text-[9px] font-body font-semibold px-3 py-1 flex items-center gap-1 uppercase tracking-wider">
                            <Flame className="w-2.5 h-2.5" /> Hot
                          </span>
                        )}
                      </div>

                      {/* Save button top-right */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleSave(globalIndex); }}
                        className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-background/60 backdrop-blur-sm hover:bg-background/90 transition-all"
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-foreground text-foreground" : "text-foreground/70"}`} />
                      </button>

                      {/* Text overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                        <h3 className="font-heading text-xl md:text-2xl italic text-background leading-tight mb-1">
                          {t.title}
                        </h3>
                        <p className="text-[11px] font-body text-background/70 leading-relaxed line-clamp-2">
                          {t.desc}
                        </p>
                      </div>

                      {/* Hover actions overlay */}
                      <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/30 transition-colors duration-300 flex items-center justify-center">
                        <div className="flex gap-3 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate("/recommender"); }}
                            className="flex items-center gap-2 bg-background/95 backdrop-blur-sm text-foreground px-4 py-2.5 text-[9px] font-body font-medium uppercase tracking-[0.15em] hover:bg-background transition-colors"
                          >
                            <Wand2 className="w-3 h-3" />
                            Generate Outfit
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); toggleLike(globalIndex); }}
                            className="w-9 h-9 flex items-center justify-center bg-background/95 backdrop-blur-sm hover:bg-background transition-colors"
                          >
                            <Heart className={`w-3.5 h-3.5 ${isLiked ? "fill-accent text-accent" : "text-foreground"}`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* AI Insight */}
                    {t.aiInsight && (
                      <div className="px-5 py-3 border-t border-border bg-muted/50 flex items-start gap-2">
                        <Sparkles className="w-3 h-3 text-accent mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[9px] font-body font-semibold uppercase tracking-[0.2em] text-accent">
                            AI Insight
                          </span>
                          <p className="text-[11px] font-body text-muted-foreground leading-relaxed mt-0.5">
                            {t.aiInsight}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Bottom action */}
                    <div className="px-5 py-3 border-t border-border flex items-center justify-between">
                      <button
                        onClick={() => navigate("/recommender")}
                        className="text-[10px] font-body font-medium uppercase tracking-wider text-accent flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        Explore outfits <ArrowRight className="w-3 h-3" />
                      </button>
                      <span className="text-[9px] font-body text-muted-foreground uppercase tracking-wider">
                        {t.tag}
                      </span>
                    </div>
                  </motion.article>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CTA Section */}
        <section className="border-t border-border">
          <div className="container mx-auto max-w-3xl px-6 py-20 text-center">
            <p className="editorial-label mb-4">AI-Powered Styling</p>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground mb-4">
              Create outfits inspired by <span className="italic">trends</span>
            </h2>
            <p className="font-body text-sm text-muted-foreground mb-8 max-w-md mx-auto">
              Let StyleAI generate personalized outfits based on the trends you love.
            </p>
            <button
              onClick={() => navigate("/recommender")}
              className="inline-flex items-center gap-2 bg-foreground text-background px-8 py-3.5 text-[10px] font-body font-medium uppercase tracking-[0.2em] hover:bg-foreground/85 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              Generate Outfit from Trends
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default Trends;

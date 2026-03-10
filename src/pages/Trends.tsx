import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import TrendingSearches from "@/components/trends/TrendingSearches";
import TrendingColors from "@/components/trends/TrendingColors";
import TrendingItems from "@/components/trends/TrendingItems";
import TrendingStyles from "@/components/trends/TrendingStyles";
import AITrendInsights from "@/components/trends/AITrendInsights";
import TrendInspirationGrid from "@/components/trends/TrendInspirationGrid";

const Trends = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
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
                Discover what people are searching, wearing, and talking about in fashion right now.
                Explore trending keywords, colors, items, and styles curated by StyleAI.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8"
              >
                <button
                  onClick={() => navigate("/recommender")}
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[10px] font-body font-medium uppercase tracking-[0.2em] hover:bg-foreground/85 transition-colors"
                >
                  <Wand2 className="w-3.5 h-3.5" />
                  Generate Outfit From Trends
                </button>
              </motion.div>
            </div>
          </div>
          <div className="border-b border-border" />
        </section>

        <TrendingSearches />
        <TrendingColors />
        <TrendingItems />
        <TrendingStyles />
        <AITrendInsights />
        <TrendInspirationGrid />

        {/* CTA */}
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

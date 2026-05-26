import { Button } from "@/shared/ui";
import { motion } from "framer-motion";
import { RefreshCw, SlidersHorizontal, Sparkles } from "lucide-react";
import { STYLE_FILTERS, SMART_FILTERS } from "@/features/recommender/types";
import { useState } from "react";

interface OutfitHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onRefresh: () => void;
  isGenerating: boolean;
  outfitCount: number;
  activePrompt: string;
}

const OutfitHeader = ({ activeFilter, onFilterChange, onRefresh, isGenerating, outfitCount, activePrompt }: OutfitHeaderProps) => {
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[linear-gradient(to_bottom,#fffaf5,#fff)] backdrop-blur-xl sticky top-0 z-20"
    >
      <div className="pt-6 pb-4 px-8">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <h2 className="font-heading text-[22px] md:text-[26px] font-semibold text-foreground leading-tight">
              AI Stylist ✨
            </h2>
            <span className="text-2xl">✨</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="text-sm font-body text-accent-foreground/70 hover:text-accent-foreground"
            >
              Filters
            </button>
          </div>
        </div>

        <p className="text-[14px] font-body text-foreground/60 mb-3 max-w-md">
          Personalized outfit recommendations based on your wardrobe and style.
        </p>

        {activePrompt && (
          <div className="flex items-center gap-3 mb-4">
            <input
              type="text"
              value={activePrompt}
              onChange={(e) => setActivePrompt(e.target.value)}
              placeholder="Describe your outfit..."
              className="flex-1 bg-background/88 border border-border px-4 py-3 rounded-xl text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all placeholder:text-muted-foreground/60"
            />
            <button
              onClick={onRefresh}
              disabled={isGenerating}
              className="ml-2 bg-accent text-accent-foreground px-4 py-3 rounded-xl hover:shadow-md hover:shadow-accent/20 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" /> Generate
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="text-sm font-body text-foreground/50">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Based on your {outfitCount > 0 ? outfitCount : "24"} wardrobe items</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-accent" />
              <span>Matching your minimalist profile</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {["for_you", "your_wardrobe", "trending"].map((filter) => (
              <button
                key={filter}
                onClick={() => onFilterChange(filter)}
                className={`text-[12px] font-body font-medium px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                  smartFilter === filter
                    ? "bg-accent text-accent-foreground border-accent shadow-sm"
                    : "border-border text-foreground/60 hover:border-accent/20 hover:text-accent"
                }`}
              >
                {filter === "for_you" && "✨ For You"}
                {filter === "your_wardrobe" && "👔 Your Wardrobe"}
                {filter === "trending" && "📈 Trending"}
              </button>
            ))}
          </div>
        </div>

        {showMobileFilters && (
          <div className="mt-4 pt-3 border-t border-border/60">
            <div className="flex flex-wrap gap-2 mb-2">
              {STYLE_FILTERS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onFilterChange(tab.value)}
                  className={`text-[11px] font-body font-medium px-3 py-1 rounded-full border transition-all whitespace-nowrap ${
                    activeFilter === tab.value
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "border-border text-foreground/72 hover:border-accent/20 hover:bg-secondary/72"
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-border" />
    </motion.div>
  );
};

export default OutfitHeader;

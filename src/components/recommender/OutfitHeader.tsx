import { RefreshCw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const filterTabs = [
  { icon: "✨", label: "Tất cả" },
  { icon: "🧥", label: "Casual" },
  { icon: "🔥", label: "Streetwear" },
  { icon: "💼", label: "Công sở" },
  { icon: "🇰🇷", label: "K-Fashion" },
  { icon: "🌺", label: "Boho" },
  { icon: "◻️", label: "Minimal" },
  { icon: "🎉", label: "Dạ tiệc" },
];

interface OutfitHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const OutfitHeader = ({ activeFilter, onFilterChange }: OutfitHeaderProps) => {
  return (
    <div className="bg-background/80 backdrop-blur-sm sticky top-0 z-20">
      {/* Title bar */}
      <div className="px-8 pt-7 pb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="font-heading text-[28px] font-semibold text-foreground leading-tight">
              Gợi ý outfit từ AI
            </h2>
            <span className="text-2xl">✨</span>
          </div>
          <p className="text-[13px] font-body text-muted-foreground">
            Ý tưởng outfit cá nhân hóa được tạo bởi AI stylist của bạn
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="gap-2 text-xs rounded-full h-9 px-4 hover:shadow-sm active:scale-95 transition-all">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Bộ lọc
          </Button>
          <motion.button
            whileHover={{ rotate: 180, scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            transition={{ duration: 0.4 }}
            className="w-10 h-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center shadow-md shadow-accent/25 hover:shadow-lg hover:shadow-accent/30 transition-shadow"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>
      </div>

      {/* Filter pills */}
      <div className="px-8 pb-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {filterTabs.map((tab) => (
          <motion.button
            key={tab.label}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onFilterChange(tab.label)}
            className={`text-[12px] font-body font-medium px-4 py-2 rounded-full border transition-all whitespace-nowrap ${
              activeFilter === tab.label
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "border-border text-foreground/70 hover:border-foreground/30 hover:bg-secondary/50"
            }`}
          >
            {tab.icon} {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Subtle separator */}
      <div className="h-px bg-border" />
    </div>
  );
};

export default OutfitHeader;

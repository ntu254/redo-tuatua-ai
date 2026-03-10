import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Sparkles, ArrowRight } from "lucide-react";

interface OutfitCardProps {
  outfit: {
    id: number;
    title: string;
    emoji: string;
    image: string;
    style: string;
    aiMatch: boolean;
    totalPrice: string;
    products: { name: string }[];
  };
  index: number;
  onSelect?: (id: number) => void;
}

const OutfitCard = ({ outfit, index, onSelect }: OutfitCardProps) => {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group cursor-pointer"
      onClick={() => onSelect?.(outfit.id)}
    >
      {/* Image — dominant, 70%+ of card */}
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-4">
        <img
          src={outfit.image}
          alt={outfit.title}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Save button */}
        <button
          onClick={(e) => { e.stopPropagation(); setSaved(!saved); }}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
            saved
              ? "bg-accent text-accent-foreground"
              : "bg-background/60 text-foreground hover:bg-background/80"
          }`}
        >
          <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
        </button>

        {/* AI Match badge */}
        {outfit.aiMatch && (
          <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-background/80 backdrop-blur-md px-3 py-1.5 rounded-full">
            <Sparkles className="w-3 h-3 text-accent" />
            <span className="text-xs font-body font-semibold text-foreground">AI Match</span>
          </div>
        )}

        {/* Style tag */}
        <div className="absolute bottom-4 left-4">
          <span className="text-xs font-body font-medium tracking-wide text-background/90 uppercase">
            {outfit.style}
          </span>
        </div>

        {/* Hover CTA */}
        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
          <div className="flex items-center gap-2 bg-background text-foreground px-4 py-2 rounded-full text-sm font-body font-medium">
            Xem outfit <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Text — minimal, clean */}
      <div className="space-y-2 px-1">
        <h3 className="font-heading text-lg text-foreground leading-tight">
          {outfit.title} {outfit.emoji}
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-sm font-body text-muted-foreground">
            {outfit.products.length} sản phẩm
          </p>
          <p className="text-sm font-body font-semibold text-foreground">
            {outfit.totalPrice}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCard;

import type { WardrobeItem } from "@/features/wardrobe/types";
import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Shirt, Sparkles, Trash2 } from "lucide-react";
import { useState } from "react";

interface WardrobeItemCardProps {
  item: WardrobeItem;
  index: number;
  selected?: boolean;
  onToggleSelect?: (id: number) => void;
}

const tagColors: Record<string, string> = {
  Casual: "bg-teal-light text-teal",
  Office: "bg-secondary text-foreground/70",
  Streetwear: "bg-accent/10 text-accent",
  Minimal: "bg-muted text-muted-foreground",
  Party: "bg-accent/12 text-accent",
  Sporty: "bg-teal-light text-teal",
};

const WardrobeItemCard = ({ item, index, selected, onToggleSelect }: WardrobeItemCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.035, duration: 0.35 }}
      layout
      className={`group relative rounded-xl border overflow-hidden bg-card transition-all duration-300 cursor-pointer ${
        selected
          ? "ring-2 ring-accent border-accent shadow-md"
          : "border-border shadow-sm hover:shadow-lg hover:-translate-y-0.5"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onToggleSelect?.(item.id)}
    >
      {/* Image */}
      <div className="aspect-[4/5] bg-secondary relative flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-[1.04]" />
        ) : (
          <div className="flex flex-col items-center gap-1">
            <Shirt className="w-10 h-10 text-muted-foreground/12" strokeWidth={1} />
          </div>
        )}

        {/* Selection indicator */}
        {onToggleSelect && (
          <div className={`absolute top-2.5 left-2.5 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected
              ? "bg-accent border-accent scale-100"
              : "border-background/60 bg-foreground/20 backdrop-blur-sm scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100"
          }`}>
            {selected && <span className="text-accent-foreground text-[9px] font-bold">✓</span>}
          </div>
        )}

        {/* Hover actions */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] flex items-center justify-center gap-2"
            >
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0 }}
                className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center hover:bg-background shadow-sm transition-colors"
                title="Edit"
                onClick={(e) => e.stopPropagation()}
              >
                <Pencil className="w-3 h-3 text-foreground" />
              </motion.button>
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.04 }}
                className="w-8 h-8 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 shadow-sm transition-colors"
                title="Use in outfit"
                onClick={(e) => e.stopPropagation()}
              >
                <Sparkles className="w-3 h-3 text-accent-foreground" />
              </motion.button>
              <motion.button
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.08 }}
                className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center hover:bg-destructive/10 shadow-sm transition-colors"
                title="Remove"
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-3 h-3 text-destructive" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-[13px] font-body font-medium text-foreground truncate leading-tight">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span
            className="w-2.5 h-2.5 rounded-full border border-border/60 shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[9px] text-muted-foreground font-body uppercase tracking-wider">
            {item.category}
          </span>
        </div>
        {item.tags.length > 0 && (
          <div className="flex gap-1 mt-2 flex-wrap">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[8px] px-1.5 py-px rounded-full font-body font-medium uppercase tracking-wider leading-relaxed ${
                  tagColors[tag] || "bg-secondary text-muted-foreground"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WardrobeItemCard;

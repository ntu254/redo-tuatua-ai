import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Trash2, Sparkles, Shirt } from "lucide-react";

export interface WardrobeItem {
  id: number;
  name: string;
  category: string;
  color: string;
  tags: string[];
  image?: string;
}

interface WardrobeItemCardProps {
  item: WardrobeItem;
  index: number;
  selected?: boolean;
  onToggleSelect?: (id: number) => void;
}

const tagColors: Record<string, string> = {
  Casual: "bg-teal-light text-teal",
  Office: "bg-secondary text-foreground",
  Streetwear: "bg-accent/10 text-accent",
  Minimal: "bg-muted text-muted-foreground",
  Party: "bg-accent/15 text-accent",
  Sporty: "bg-teal-light text-teal",
};

const WardrobeItemCard = ({ item, index, selected, onToggleSelect }: WardrobeItemCardProps) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4 }}
      className={`group relative rounded-2xl border overflow-hidden bg-card shadow-sm transition-all duration-300 cursor-pointer ${
        selected ? "ring-2 ring-accent border-accent" : "border-border hover:shadow-lg hover:-translate-y-1"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onToggleSelect?.(item.id)}
    >
      {/* Image area */}
      <div className="aspect-[3/4] bg-secondary relative flex items-center justify-center overflow-hidden">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <Shirt className="w-12 h-12 text-muted-foreground/15" strokeWidth={1} />
        )}

        {/* Selection checkbox */}
        {onToggleSelect && (
          <div className={`absolute top-3 left-3 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            selected ? "bg-accent border-accent" : "border-muted-foreground/30 bg-background/60 backdrop-blur-sm opacity-0 group-hover:opacity-100"
          }`}>
            {selected && <span className="text-accent-foreground text-[10px] font-bold">✓</span>}
          </div>
        )}

        {/* Hover overlay */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-foreground/50 backdrop-blur-sm flex items-center justify-center gap-2"
            >
              <button className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors" title="Edit">
                <Pencil className="w-3.5 h-3.5 text-foreground" />
              </button>
              <button className="w-9 h-9 rounded-full bg-accent flex items-center justify-center hover:bg-accent/80 transition-colors" title="Generate outfit">
                <Sparkles className="w-3.5 h-3.5 text-accent-foreground" />
              </button>
              <button className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-destructive/10 transition-colors" title="Delete">
                <Trash2 className="w-3.5 h-3.5 text-destructive" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-3.5">
        <p className="text-sm font-body font-medium text-foreground truncate">{item.name}</p>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span
            className="w-3 h-3 rounded-full border border-border shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">
            {item.category}
          </span>
        </div>
        {item.tags.length > 0 && (
          <div className="flex gap-1 mt-2.5 flex-wrap">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className={`text-[9px] px-2 py-0.5 rounded-full font-body font-medium uppercase tracking-wider ${
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

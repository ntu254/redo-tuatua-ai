import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  ExternalLink,
  Star,
  Bookmark,
  Sparkles,
  RefreshCw,
  Share2,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const platformColors: Record<string, { bg: string; text: string; border: string }> = {
  Shopee: { bg: "bg-[hsl(14,87%,55%)]/10", text: "text-shopee", border: "border-[hsl(14,87%,55%)]/20" },
  Lazada: { bg: "bg-[hsl(236,78%,24%)]/10", text: "text-lazada", border: "border-[hsl(236,78%,24%)]/20" },
  Tiki: { bg: "bg-[hsl(210,100%,55%)]/10", text: "text-tiki", border: "border-[hsl(210,100%,55%)]/20" },
};

interface Product {
  name: string;
  price: string;
  oldPrice: string | null;
  platform: string;
  badge: string | null;
  rating: number;
  sold: string;
  brand: string;
}

interface Outfit {
  id: number;
  title: string;
  emoji: string;
  image: string;
  style: string;
  aiMatch: boolean;
  aiComment: string;
  totalPrice: string;
  products: Product[];
}

interface OutfitCardProps {
  outfit: Outfit;
  index: number;
}

const OutfitCard = ({ outfit, index }: OutfitCardProps) => {
  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex">
        {/* Left: outfit image */}
        <div className="relative w-[180px] xl:w-[200px] shrink-0">
          <div className="mag-img-zoom h-full min-h-[280px]">
            <img
              src={outfit.image}
              alt={outfit.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Hover overlay actions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: hovered ? 1 : 0 }}
            className="absolute inset-0 bg-foreground/20 flex items-center justify-center gap-2 transition-opacity"
          >
            <button
              onClick={() => setSaved(!saved)}
              className="p-2.5 rounded-full bg-background/90 backdrop-blur-sm hover:scale-110 transition-transform"
            >
              <Bookmark
                className={`w-4 h-4 ${saved ? "text-accent fill-accent" : "text-foreground"}`}
              />
            </button>
            <button className="p-2.5 rounded-full bg-background/90 backdrop-blur-sm hover:scale-110 transition-transform">
              <Share2 className="w-4 h-4 text-foreground" />
            </button>
          </motion.div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            <span className="bg-foreground/80 text-background text-[9px] font-body font-medium px-2.5 py-1 rounded-full backdrop-blur-sm">
              {outfit.style}
            </span>
            {outfit.aiMatch && (
              <span className="bg-accent text-accent-foreground text-[9px] font-body font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Best Match
              </span>
            )}
          </div>

          {/* Save icon (always visible) */}
          <button
            onClick={() => setSaved(!saved)}
            className={`absolute top-3 right-3 p-1.5 rounded-full bg-background/80 backdrop-blur-sm transition-colors ${
              saved ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" fill={saved ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Right: content */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
                {outfit.title} {outfit.emoji}
              </h3>
            </div>
            <button className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors shrink-0">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* AI comment */}
          <div className="bg-accent/5 border border-accent/10 rounded-lg px-3 py-2 mb-3">
            <p className="text-[11px] font-body text-foreground/80 leading-relaxed line-clamp-2">
              <span className="text-accent font-semibold">✨ AI:</span> {outfit.aiComment}
            </p>
          </div>

          {/* Product list */}
          <div className="space-y-2 flex-1">
            {(expanded ? outfit.products : outfit.products.slice(0, 3)).map((p, pi) => (
              <div
                key={p.name}
                className="flex items-center gap-2.5 group/item hover:bg-secondary/50 rounded-lg p-1.5 -mx-1.5 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-secondary shrink-0 overflow-hidden">
                  <img
                    src={outfit.image}
                    alt={p.name}
                    className="w-full h-full object-cover opacity-70"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span
                      className={`text-[10px] font-body font-bold ${platformColors[p.platform]?.text}`}
                    >
                      {p.platform}
                    </span>
                    {p.badge && (
                      <span
                        className={`text-[8px] font-body font-bold px-1.5 py-0.5 rounded-full ${platformColors[p.platform]?.bg} ${platformColors[p.platform]?.text}`}
                      >
                        {p.badge}
                      </span>
                    )}
                    <span className="text-[9px] font-body text-muted-foreground">· {p.brand}</span>
                  </div>
                  <p className="text-[11px] font-body font-medium text-foreground truncate">
                    {p.name}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <Star className="w-2.5 h-2.5 text-accent fill-accent" />
                    <span className="text-[10px] font-body text-foreground">{p.rating}</span>
                    <span className="text-[10px] font-body text-muted-foreground">
                      · {p.sold} đã bán
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[12px] font-body font-bold text-accent block">
                    {p.price}
                  </span>
                  {p.oldPrice && (
                    <span className="text-[10px] font-body text-muted-foreground line-through">
                      {p.oldPrice}
                    </span>
                  )}
                </div>
                <button className="p-1.5 rounded-lg bg-accent text-accent-foreground opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0">
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>

          {/* Expand toggle */}
          {outfit.products.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center gap-1 text-[11px] font-body text-muted-foreground hover:text-accent py-1 transition-colors"
            >
              {expanded ? (
                <>
                  Thu gọn <ChevronUp className="w-3 h-3" />
                </>
              ) : (
                <>
                  Xem thêm {outfit.products.length - 3} sản phẩm <ChevronDown className="w-3 h-3" />
                </>
              )}
            </button>
          )}

          {/* Footer: price + actions */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
            <div>
              <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                Ước tính
              </p>
              <p className="text-base font-heading font-bold text-accent">
                {outfit.totalPrice}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] rounded-full px-3 h-7 gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Thay đổi
              </Button>
              <Button
                variant="accent"
                size="sm"
                className="text-[10px] rounded-full px-4 h-7 gap-1"
              >
                <ShoppingCart className="w-3 h-3" /> Mua outfit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCard;

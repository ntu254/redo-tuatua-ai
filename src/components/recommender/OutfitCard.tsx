import { useState } from "react";
import { motion } from "framer-motion";
import {
  ExternalLink, Star, Bookmark, Sparkles, RefreshCw, Share2, ShoppingCart, ChevronDown, ChevronUp, Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const platformStyles: Record<string, { bg: string; text: string; icon: string }> = {
  Shopee: { bg: "bg-shopee/8", text: "text-shopee", icon: "🟠" },
  Lazada: { bg: "bg-lazada/8", text: "text-lazada", icon: "🔵" },
  Tiki: { bg: "bg-tiki/8", text: "text-tiki", icon: "🔹" },
};

interface Product {
  name: string; price: string; oldPrice: string | null; platform: string; badge: string | null; rating: number; sold: string; brand: string; image?: string;
}

interface Outfit {
  id: number; title: string; emoji: string; image: string; style: string; aiMatch: boolean; aiComment: string; totalPrice: string; products: Product[];
}

interface OutfitCardProps { outfit: Outfit; index: number; }

const OutfitCard = ({ outfit, index }: OutfitCardProps) => {
  const [saved, setSaved] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-border hover:shadow-xl hover:shadow-foreground/[0.04] transition-all duration-500 group"
    >
      <div className="flex">
        {/* Left: outfit image */}
        <div className="relative w-[200px] xl:w-[220px] shrink-0">
          <div className="mag-img-zoom h-full min-h-[320px]">
            <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover" />
          </div>
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent flex items-end justify-center pb-5 gap-3"
          >
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setSaved(!saved)}
              className="p-2.5 rounded-xl bg-background/90 backdrop-blur-md shadow-lg">
              <Bookmark className={`w-4 h-4 transition-colors ${saved ? "text-accent fill-accent" : "text-foreground"}`} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-background/90 backdrop-blur-md shadow-lg">
              <Share2 className="w-4 h-4 text-foreground" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-background/90 backdrop-blur-md shadow-lg">
              <Heart className="w-4 h-4 text-foreground" />
            </motion.button>
          </motion.div>
        </div>

        {/* Right: content */}
        <div className="flex-1 p-5 xl:p-6 flex flex-col min-w-0">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="bg-secondary text-foreground text-[10px] font-body font-medium px-2.5 py-1 rounded-lg border border-border">
              {outfit.style}
            </span>
            {outfit.aiMatch && (
              <span className="bg-accent text-accent-foreground text-[10px] font-body font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Phù hợp nhất
              </span>
            )}
          </div>

          <div className="mb-3">
            <h3 className="font-heading text-xl font-semibold text-foreground leading-tight">
              {outfit.title} {outfit.emoji}
            </h3>
          </div>

          <div className="bg-gradient-to-r from-accent/[0.06] to-transparent border border-accent/10 rounded-xl px-4 py-3 mb-4">
            <p className="text-[12px] font-body text-foreground/80 leading-relaxed">
              <span className="text-accent font-semibold inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Stylist:
              </span>{" "}
              {outfit.aiComment}
            </p>
          </div>

          <div className="space-y-1.5 flex-1">
            {(expanded ? outfit.products : outfit.products.slice(0, 3)).map((p) => (
              <motion.div key={p.name} whileHover={{ x: 2 }}
                className="flex items-center gap-3 group/item hover:bg-secondary/40 rounded-xl p-2 -mx-2 transition-colors cursor-pointer">
                <div className="w-11 h-11 rounded-xl bg-secondary shrink-0 overflow-hidden ring-1 ring-border/50">
                  <img src={p.image || outfit.image} alt={p.name} className="w-full h-full object-cover opacity-75 group-hover/item:opacity-100 transition-opacity" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px]">{platformStyles[p.platform]?.icon}</span>
                    <span className={`text-[10px] font-body font-bold ${platformStyles[p.platform]?.text}`}>{p.platform}</span>
                    {p.badge && (
                      <span className={`text-[9px] font-body font-bold px-1.5 py-0.5 rounded-md ${platformStyles[p.platform]?.bg} ${platformStyles[p.platform]?.text}`}>
                        {p.badge}
                      </span>
                    )}
                    <span className="text-[9px] font-body text-muted-foreground">· {p.brand}</span>
                  </div>
                  <p className="text-[12px] font-body font-medium text-foreground truncate">{p.name}</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <Star className="w-3 h-3 text-accent fill-accent" />
                    <span className="text-[10px] font-body font-medium text-foreground">{p.rating}</span>
                    <span className="text-[10px] font-body text-muted-foreground">· đã bán {p.sold}</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[13px] font-body font-bold text-accent block">{p.price}</span>
                  {p.oldPrice && <span className="text-[10px] font-body text-muted-foreground line-through">{p.oldPrice}</span>}
                </div>
                <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-xl bg-accent text-accent-foreground opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 shadow-sm">
                  <ExternalLink className="w-3 h-3" />
                </motion.button>
              </motion.div>
            ))}
          </div>

          {outfit.products.length > 3 && (
            <button onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center gap-1.5 text-[11px] font-body font-medium text-muted-foreground hover:text-accent py-2 transition-colors">
              {expanded ? (
                <>Thu gọn <ChevronUp className="w-3.5 h-3.5" /></>
              ) : (
                <>Xem thêm {outfit.products.length - 3} sản phẩm <ChevronDown className="w-3.5 h-3.5" /></>
              )}
            </button>
          )}

          <div className="mt-4 pt-4 border-t border-border/60 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="leading-none">
              <p className="text-[10px] font-body text-muted-foreground uppercase tracking-[0.15em] mb-1.5">Tổng ước tính</p>
              <p className="text-lg font-heading font-bold text-accent">{outfit.totalPrice}</p>
            </div>
            <Button variant="accent" size="sm"
              className="text-[11px] rounded-xl px-5 h-9 gap-1.5 whitespace-nowrap shadow-sm shadow-accent/20 hover:shadow-md hover:shadow-accent/30 active:scale-95 transition-all">
              <ShoppingCart className="w-3 h-3" /> Mua outfit
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCard;

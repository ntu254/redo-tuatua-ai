import type { Outfit } from "@/features/recommender/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Bookmark,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Heart,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { useState } from "react";

const platformStyles: Record<
  string,
  { bg: string; text: string; icon: string }
> = {
  Shopee: { bg: "bg-shopee/8", text: "text-shopee", icon: "🟠" },
  Lazada: { bg: "bg-lazada/8", text: "text-lazada", icon: "🔵" },
  Tiki: { bg: "bg-tiki/8", text: "text-tiki", icon: "🔹" },
  "TikTok Shop": { bg: "bg-[#FF0050]/8", text: "text-[#FF0050]", icon: "🎵" },
  Zalora: { bg: "bg-foreground/8", text: "text-foreground", icon: "🛍️" },
};

interface OutfitCardProps {
  outfit: Outfit;
  index: number;
  onSave: (id: number) => void;
  onLike: (id: number, liked: boolean | null) => void;
  onHide: (id: number) => void;
  onReport: (id: number) => void;
}

const OutfitCard = ({ outfit, index, onSave, onLike, onHide, onReport }: OutfitCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);

  if (outfit.userHidden) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--secondary)/0.36)_100%)] rounded-2xl overflow-hidden border border-border/60 hover:border-border hover:shadow-xl hover:shadow-foreground/[0.04] transition-all duration-500 group"
    >
      <div className="flex">
        <div className="relative w-[200px] xl:w-[220px] shrink-0">
          <div className="mag-img-zoom h-full min-h-[320px]">
            <img
              src={outfit.image}
              alt={outfit.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Match Score Badge */}
          {outfit.matchScore && (
            <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur-md shadow-sm">
              <span className="text-[10px] font-body font-bold text-accent">
                {outfit.matchScore}% match
              </span>
            </div>
          )}

          {/* Hover actions */}
          <motion.div
            initial={false}
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-transparent to-transparent flex items-end justify-center pb-5 gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSave(outfit.id)}
              className="p-2.5 rounded-xl bg-background/90 backdrop-blur-md shadow-lg"
            >
              <Bookmark
                className={`w-4 h-4 transition-colors ${outfit.userSaved ? "text-accent fill-accent" : "text-foreground"}`}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2.5 rounded-xl bg-background/90 backdrop-blur-md shadow-lg"
            >
              <Share2 className="w-4 h-4 text-foreground" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onLike(outfit.id, outfit.userLiked === true ? null : true)}
              className="p-2.5 rounded-xl bg-background/90 backdrop-blur-md shadow-lg"
            >
              <Heart
                className={`w-4 h-4 transition-colors ${outfit.userLiked === true ? "text-red-500 fill-red-500" : "text-foreground"}`}
              />
            </motion.button>
          </motion.div>
        </div>

        <div className="flex-1 p-5 xl:p-6 flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-secondary/78 text-foreground text-[10px] font-body font-medium px-2.5 py-1 rounded-lg border border-border">
                {outfit.style}
              </span>
              {outfit.aiMatch && (
                <span className="bg-accent text-accent-foreground text-[10px] font-body font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Phù hợp nhất
                </span>
              )}
            </div>

            {/* Like/Dislike inline */}
            <div className="flex items-center gap-1 shrink-0">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onLike(outfit.id, outfit.userLiked === true ? null : true)}
                className={`p-1.5 rounded-lg transition-colors ${outfit.userLiked === true ? "text-red-500 bg-red-50" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onLike(outfit.id, outfit.userLiked === false ? null : false)}
                className={`p-1.5 rounded-lg transition-colors ${outfit.userLiked === false ? "text-destructive bg-destructive/10" : "text-muted-foreground hover:text-foreground hover:bg-secondary"}`}
              >
                <ThumbsDown className="w-3.5 h-3.5" />
              </motion.button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="text-xs font-body">
                  <DropdownMenuItem onClick={() => onHide(outfit.id)}>
                    <X className="h-3.5 w-3.5 mr-2" /> Ẩn outfit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReport(outfit.id)}>
                    <AlertTriangle className="h-3.5 w-3.5 mr-2" /> Báo cáo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="mb-3">
            <h3 className="font-heading text-xl font-semibold text-foreground leading-tight">
              {outfit.title} {outfit.emoji}
            </h3>
          </div>

          <div className="bg-gradient-to-r from-secondary/88 via-secondary/46 to-transparent border border-accent/12 rounded-xl px-4 py-3 mb-4">
            <p className="text-[12px] font-body text-foreground/80 leading-relaxed">
              <span className="text-accent font-semibold inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Stylist:
              </span>{" "}
              {outfit.aiComment}
            </p>
          </div>

          <div className="space-y-1.5 flex-1">
            {(expanded ? outfit.products : outfit.products.slice(0, 3)).map(
              (p) => (
                <motion.div
                  key={p.name}
                  whileHover={{ x: 2 }}
                  className="flex items-center gap-3 group/item hover:bg-secondary/56 rounded-xl p-2 -mx-2 transition-colors"
                >
                  <div className="w-11 h-11 rounded-xl bg-secondary/78 shrink-0 overflow-hidden ring-1 ring-border/50">
                    <img
                      src={p.image || outfit.image}
                      alt={p.name}
                      className="w-full h-full object-cover opacity-75 group-hover/item:opacity-100 transition-opacity"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-[10px]">
                        {platformStyles[p.platform]?.icon}
                      </span>
                      <span
                        className={`text-[10px] font-body font-bold ${platformStyles[p.platform]?.text}`}
                      >
                        {p.platform}
                      </span>
                      {p.badge && (
                        <span
                          className={`text-[9px] font-body font-bold px-1.5 py-0.5 rounded-md ${platformStyles[p.platform]?.bg} ${platformStyles[p.platform]?.text}`}
                        >
                          {p.badge}
                        </span>
                      )}
                      <span className="text-[9px] font-body text-muted-foreground">
                        · {p.brand}
                      </span>
                    </div>
                    <p className="text-[12px] font-body font-medium text-foreground truncate">
                      {p.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Star className="w-3 h-3 text-accent fill-accent" />
                      <span className="text-[10px] font-body font-medium text-foreground">
                        {p.rating}
                      </span>
                      <span className="text-[10px] font-body text-muted-foreground">
                        · đã bán {p.sold}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[13px] font-body font-bold text-accent block">
                      {p.price}
                    </span>
                    {p.oldPrice && (
                      <span className="text-[10px] font-body text-muted-foreground line-through">
                        {p.oldPrice}
                      </span>
                    )}
                  </div>
                  <motion.a
                    href={p.affiliateUrl || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-xl bg-accent text-accent-foreground opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 shadow-sm"
                    onClick={(e) => {
                      if (!p.affiliateUrl) e.preventDefault();
                    }}
                  >
                    <ExternalLink className="w-3 h-3" />
                  </motion.a>
                </motion.div>
              ),
            )}
          </div>

          {outfit.products.length > 3 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center justify-center gap-1.5 text-[11px] font-body font-medium text-muted-foreground hover:text-accent py-2 transition-colors"
            >
              {expanded ? (
                <>
                  Thu gọn <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Xem thêm {outfit.products.length - 3} sản phẩm{" "}
                  <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}

          <div className="mt-4 pt-4 border-t border-border/60 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="leading-none">
              <p className="text-[10px] font-body text-muted-foreground uppercase tracking-[0.15em] mb-1.5">
                Tổng ước tính
              </p>
              <p className="text-lg font-heading font-bold text-accent">
                {outfit.totalPrice}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-[10px] rounded-xl h-9 px-3 gap-1 whitespace-nowrap"
                onClick={() => setCompareOpen(true)}
              >
                <ShoppingCart className="w-3 h-3" /> So sánh giá
              </Button>
              <Button
                variant="accent"
                size="sm"
                className="text-[11px] rounded-xl px-5 h-9 gap-1.5 whitespace-nowrap shadow-sm shadow-accent/20 hover:shadow-md hover:shadow-accent/30 active:scale-95 transition-all"
              >
                <ShoppingCart className="w-3 h-3" /> Mua outfit
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Price Comparison Dialog */}
      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="max-w-lg">
          <DialogDescription className="srOnly">Price comparison for {outfit.title}</DialogDescription>
          <DialogTitle className="font-body">So sánh giá — {outfit.title}</DialogTitle>
          <div className="space-y-4 mt-2">
            {outfit.products.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium font-body text-foreground truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground font-body">{p.platform} · {p.brand}</p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-sm font-bold font-body text-accent">{p.price}</p>
                  {p.oldPrice && (
                    <p className="text-xs text-muted-foreground font-body line-through">{p.oldPrice}</p>
                  )}
                </div>
                <Button variant="outline" size="sm" className="ml-3 text-xs h-8">
                  <ExternalLink className="w-3 h-3 mr-1" /> Mua
                </Button>
              </div>
            ))}
            <div className="flex items-center justify-between pt-2 border-t border-border">
              <span className="text-sm font-body font-medium text-foreground">Tổng cộng</span>
              <span className="text-lg font-heading font-bold text-accent">{outfit.totalPrice}</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OutfitCard;

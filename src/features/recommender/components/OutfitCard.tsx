import type { AIAction, Outfit } from "@/features/recommender/types";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import { motion } from "framer-motion";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  ShoppingCart,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/shared/lib";

const platformStyles: Record<string, { bg: string; text: string; icon: string }> = {
  Shopee: { bg: "bg-shopee/8", text: "text-shopee", icon: "🟠" },
  "TikTok Shop": { bg: "bg-[#FF0050]/8", text: "text-[#FF0050]", icon: "🎵" },
};

const AI_ACTIONS: { action: AIAction; label: string; icon: string }[] = [
  { action: "more_casual", label: "Thoải mái hơn", icon: "🧘" },
  { action: "more_luxury", label: "Sang trọng hơn", icon: "💎" },
  { action: "cheaper", label: "Tiết kiệm hơn", icon: "💰" },
  { action: "more_korean", label: "Hàn Quốc hơn", icon: "🇰🇷" },
];

interface OutfitCardProps {
  outfit: Outfit;
  index: number;
  onSave: (id: number) => void;
  onLike: (id: number, liked: boolean | null) => void;
  onHide: (id: number) => void;
  onReport: (id: number) => void;
  onAction: (id: number, action: AIAction) => void;
  onShare: (outfit: Outfit) => void;
}

const OutfitCard = ({ outfit, index, onSave, onLike, onHide, onReport, onAction, onShare }: OutfitCardProps) => {
  const [expanded, setExpanded] = useState(false);

  if (outfit.userHidden) return null;

  const trackAffiliateClick = async (productId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await (supabase as any).from("clicks").insert({
        user_id: user?.id || null,
        product_id: productId || null,
        outfit_id: outfit.dbId || null,
        source: "affiliate",
        traffic_source: "direct",
      });
    } catch (err) {
      console.warn("Click tracking failed:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-card rounded-xl overflow-hidden transition-all duration-300"
    >
      {/* Header: tags + actions */}
      <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {outfit.styleTags.map((tag) => (
            <span key={tag} className="bg-secondary/60 text-muted-foreground text-[10px] font-body font-medium px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {outfit.matchScore && (
            <span className="text-[11px] font-body font-bold text-foreground/50 mr-1">{outfit.matchScore}%</span>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-xs font-body">
              <DropdownMenuItem onClick={() => onHide(outfit.id)}>
                <X className="h-3.5 w-3.5 mr-2" /> Ẩn outfit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Image */}
      <div className="relative w-full h-[320px]">
        <img
          src={outfit.tryOnImage || outfit.image}
          alt={outfit.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
          <h3 className="font-heading text-lg font-semibold text-foreground leading-tight">
            {outfit.title}
          </h3>
        </div>
      </div>

      {/* AI Comment */}
      <div className="px-4 pt-3">
        <div className="bg-secondary/40 rounded-xl px-3.5 py-2.5">
          <p className="text-xs font-body text-foreground/70 leading-relaxed">
            <span className="text-foreground/50 font-semibold">Redo AI:</span> {outfit.aiComment}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 pt-3 pb-4">
        {(expanded ? outfit.products : outfit.products.slice(0, 3)).map((p, i) => (
          <div key={i} className="flex items-center gap-3 py-2">
            <div className="w-10 h-10 rounded-xl bg-secondary/60 shrink-0 overflow-hidden ring-1 ring-border/30">
              <img src={p.image || outfit.image || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80"} alt={p.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-[10px]">{platformStyles[p.platform]?.icon}</span>
                <span className={`text-[10px] font-body font-medium ${platformStyles[p.platform]?.text}`}>{p.platform}</span>
                {p.badge && (
                  <span className={`text-[9px] font-body px-1 py-0.5 rounded ${platformStyles[p.platform]?.bg} ${platformStyles[p.platform]?.text}`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="text-xs font-body text-foreground truncate">{p.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span className="text-[10px] text-muted-foreground">{p.rating} · đã bán {p.sold}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-body font-bold text-accent">{p.price}</span>
              {p.oldPrice && <span className="text-[10px] text-muted-foreground line-through block">{p.oldPrice}</span>}
            </div>
            <motion.a href={p.affiliateUrl || "#"} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-foreground text-background opacity-0 hover:opacity-100 transition-opacity shrink-0 shadow-sm"
              onClick={(e) => {
                if (!p.affiliateUrl) {
                  e.preventDefault();
                } else {
                  trackAffiliateClick(p.id);
                }
              }}
            >
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </div>
        ))}

        {outfit.products.length > 3 && (
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1 text-xs font-body text-muted-foreground hover:text-foreground py-2 transition-colors w-full"
          >
            {expanded ? <>Thu gọn <ChevronUp className="w-3.5 h-3.5" /></> : <>Xem thêm {outfit.products.length - 3} sản phẩm <ChevronDown className="w-3.5 h-3.5" /></>}
          </button>
        )}

        {/* Owned + Missing */}
        {outfit.userOwnsItems && outfit.userOwnsItems.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-secondary/40">
            <p className="text-[10px] font-body font-semibold text-foreground/60 uppercase tracking-wider mb-1">Đã có</p>
            <div className="flex flex-wrap gap-1.5">
              {outfit.userOwnsItems.map((item) => (
                <span key={item} className="text-[11px] font-body text-foreground/60 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-foreground/10 flex items-center justify-center"><span className="text-[7px]">✓</span></span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {outfit.missingItems && outfit.missingItems.length > 0 && (
          <div className="mt-2 p-2.5 rounded-xl bg-secondary/40">
            <p className="text-[10px] font-body font-semibold text-foreground/60 uppercase tracking-wider mb-1">Cần mua</p>
            <div className="space-y-1">
              {outfit.missingItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-body">
                  <span className="text-foreground/80">{item.name} <span className="text-muted-foreground/60">— {item.reason}</span></span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-foreground font-medium">{item.price}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5 text-muted-foreground">{item.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bottom bar */}
        <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Tổng</p>
            <p className="text-lg font-heading font-bold text-foreground">{outfit.totalPrice}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="text-xs rounded-xl px-5 py-2 bg-foreground text-background hover:bg-foreground/92"
              onClick={() => {
                trackAffiliateClick();
                outfit.products.forEach((p) => {
                  if (p.affiliateUrl) window.open(p.affiliateUrl, "_blank");
                });
              }}
            >
              <ShoppingCart className="w-3 h-3" /> Mua ngay
            </Button>
          </div>
        </div>

        {/* Platforms */}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">Có trên:</span>
          {[...new Set(outfit.products.map((p) => p.platform))].map((plat) => (
            <span key={plat} className="text-[10px] font-body px-1.5 py-0.5 rounded bg-secondary/60 text-foreground/60">
              {plat}
            </span>
          ))}
        </div>

        {/* AI actions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            onClick={() => onAction(outfit.id, "regenerate")}
            className="flex items-center gap-1 text-[10px] font-body font-medium px-3 py-1.5 rounded-full bg-secondary text-foreground border border-border/40 hover:bg-secondary/80 transition-all"
          >
            Tạo lại
          </motion.button>
          {AI_ACTIONS.map((a) => (
            <motion.button key={a.action} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={() => onAction(outfit.id, a.action)}
              className="text-[10px] font-body font-medium px-3 py-1.5 rounded-full border border-border/60 bg-background/40 hover:border-foreground/20 hover:text-foreground hover:bg-secondary/40 transition-all"
            >
              {a.icon} {a.label}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default OutfitCard;

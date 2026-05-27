import type { AIAction, Outfit } from "@/features/recommender/types";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
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
  Copy,
  ExternalLink,
  Heart,
  RefreshCw,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/shared/lib";

const platformStyles: Record<string, { bg: string; text: string; icon: string }> = {
  Shopee: { bg: "bg-shopee/8", text: "text-shopee", icon: "🟠" },
  Lazada: { bg: "bg-lazada/8", text: "text-lazada", icon: "🔵" },
  Tiki: { bg: "bg-tiki/8", text: "text-tiki", icon: "🔹" },
  "TikTok Shop": { bg: "bg-[#FF0050]/8", text: "text-[#FF0050]", icon: "🎵" },
  Zalora: { bg: "bg-foreground/8", text: "text-foreground", icon: "🛍️" },
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
  const [hovered, setHovered] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const handleCopyLook = () => {
    const text = `${outfit.title} ${outfit.emoji}\n${outfit.aiComment}\n\nItems:\n${outfit.products.map((p) => `• ${p.name} — ${p.price} (${p.platform})`).join("\n")}\n\nTổng: ${outfit.totalPrice}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-card rounded-2xl overflow-hidden border border-border/60 hover:border-border/80 hover:shadow-lg hover:shadow-foreground/[0.03] transition-all duration-300"
    >
      {/* Header: tags + actions */}
      <div className="px-4 pt-3.5 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-wrap">
          {outfit.styleTags.map((tag) => (
            <span key={tag} className="bg-secondary/60 text-muted-foreground text-[10px] font-body font-medium px-2 py-0.5 rounded-md border border-border/40">
              {tag}
            </span>
          ))}
          {outfit.aiMatch && (
            <span className="bg-accent/10 text-accent text-[10px] font-body font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> AI Pick
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {outfit.matchScore && (
            <span className="text-[11px] font-body font-bold text-accent mr-1">{outfit.matchScore}%</span>
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
              <DropdownMenuItem onClick={() => onReport(outfit.id)}>
                <AlertTriangle className="h-3.5 w-3.5 mr-2" /> Báo cáo
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/60 via-foreground/15 to-transparent px-4 pb-3 pt-10">
          <h3 className="font-heading text-lg font-semibold text-white leading-tight drop-shadow-sm">
            {outfit.title} {outfit.emoji}
          </h3>
        </div>

        {/* Hover actions */}
        <motion.div
          initial={false}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent flex items-end justify-center pb-4 gap-2"
        >
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onSave(outfit.id)}
            className="p-2 rounded-xl bg-background/85 backdrop-blur-md shadow-sm"
          >
            <Bookmark className={`w-4 h-4 ${outfit.userSaved ? "text-accent fill-accent" : "text-foreground"}`} />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onShare(outfit)}
            className="p-2 rounded-xl bg-background/85 backdrop-blur-md shadow-sm"
          >
            <Share2 className="w-4 h-4 text-foreground" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={() => onLike(outfit.id, outfit.userLiked === true ? null : true)}
            className="p-2 rounded-xl bg-background/85 backdrop-blur-md shadow-sm"
          >
            <Heart className={`w-4 h-4 ${outfit.userLiked === true ? "text-red-500 fill-red-500" : "text-foreground"}`} />
          </motion.button>
        </motion.div>
      </div>

      {/* AI Comment */}
      <div className="px-4 pt-3">
        <div className="bg-gradient-to-r from-accent/[0.04] to-transparent border border-accent/8 rounded-xl px-3.5 py-2.5">
          <p className="text-xs font-body text-foreground/70 leading-relaxed">
            <span className="text-accent font-semibold">Redo AI:</span> {outfit.aiComment}
          </p>
        </div>
      </div>

      {/* Products */}
      <div className="px-4 pt-3 pb-4">
        {(expanded ? outfit.products : outfit.products.slice(0, 3)).map((p, i) => (
          <div key={i} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
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
                <Star className="w-2.5 h-2.5 text-accent fill-accent" />
                <span className="text-[10px] text-muted-foreground">{p.rating} · đã bán {p.sold}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className="text-sm font-body font-bold text-accent">{p.price}</span>
              {p.oldPrice && <span className="text-[10px] text-muted-foreground line-through block">{p.oldPrice}</span>}
            </div>
            <motion.a href={p.affiliateUrl || "#"} target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              className="p-2 rounded-xl bg-accent text-accent-foreground opacity-0 hover:opacity-100 transition-opacity shrink-0 shadow-sm"
              onClick={(e) => { 
                if (!p.affiliateUrl) {
                  e.preventDefault(); 
                } else {
                  trackAffiliateClick();
                }
              }}
            >
              <ExternalLink className="w-3 h-3" />
            </motion.a>
          </div>
        ))}

        {outfit.products.length > 3 && (
          <button onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1 text-xs font-body text-muted-foreground hover:text-accent py-2 transition-colors w-full"
          >
            {expanded ? <>Thu gọn <ChevronUp className="w-3.5 h-3.5" /></> : <>Xem thêm {outfit.products.length - 3} sản phẩm <ChevronDown className="w-3.5 h-3.5" /></>}
          </button>
        )}

        {/* Owned + Missing */}
        {outfit.userOwnsItems && outfit.userOwnsItems.length > 0 && (
          <div className="mt-3 p-2.5 rounded-xl bg-teal/5 border border-teal/10">
            <p className="text-[10px] font-body font-semibold text-teal uppercase tracking-wider mb-1">Đã có</p>
            <div className="flex flex-wrap gap-1.5">
              {outfit.userOwnsItems.map((item) => (
                <span key={item} className="text-[11px] font-body text-teal/80 flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-teal/15 flex items-center justify-center"><span className="text-[7px]">✓</span></span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {outfit.missingItems && outfit.missingItems.length > 0 && (
          <div className="mt-2 p-2.5 rounded-xl bg-accent/5 border border-accent/10">
            <p className="text-[10px] font-body font-semibold text-accent uppercase tracking-wider mb-1">Cần mua</p>
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
            <p className="text-lg font-heading font-bold text-accent">{outfit.totalPrice}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="text-[10px] rounded-xl h-9 px-3 gap-1" onClick={() => setCompareOpen(true)}>
              <ShoppingCart className="w-3 h-3" /> So sánh
            </Button>
            <Button variant="accent" size="sm" className="text-xs rounded-xl px-4 h-9 gap-1.5 shadow-sm shadow-accent/20"
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
            <span key={plat} className="text-[10px] font-body px-1.5 py-0.5 rounded bg-secondary/60 text-foreground/60 border border-border/40">
              {plat}
            </span>
          ))}
          <div className="ml-auto flex items-center gap-1">
            <motion.button whileTap={{ scale: 0.85 }} onClick={handleCopyLook}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors" title="Copy look">
              {copied ? <span className="text-[10px] text-teal">OK</span> : <Copy className="w-3 h-3" />}
            </motion.button>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => onShare(outfit)}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors" title="Share">
              <Share2 className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        {/* AI actions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
            onClick={() => onAction(outfit.id, "regenerate")}
            className="flex items-center gap-1 text-[10px] font-body font-medium px-3 py-1.5 rounded-full bg-accent/8 text-accent border border-accent/20 hover:bg-accent/15 transition-all"
          >
            <RefreshCw className="w-3 h-3" /> Tạo lại
          </motion.button>
          {AI_ACTIONS.map((a) => (
            <motion.button key={a.action} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }}
              onClick={() => onAction(outfit.id, a.action)}
              className="text-[10px] font-body font-medium px-3 py-1.5 rounded-full border border-border/60 bg-background/40 hover:border-accent/20 hover:text-accent hover:bg-secondary/40 transition-all"
            >
              {a.icon} {a.label}
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={compareOpen} onOpenChange={setCompareOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl border border-border/80 bg-background/95 backdrop-blur-xl p-6">
          <DialogHeader className="flex flex-col gap-1.5 pb-4 border-b border-border/40">
            <DialogTitle className="font-heading text-lg font-bold text-foreground flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-accent" /> So sánh & Lựa chọn Sản phẩm
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground font-body">
              Chi tiết các sản phẩm trong outfit "{outfit.title}" và đề xuất tối ưu giá từ các sàn TMĐT.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {outfit.products.map((p, i) => (
              <div key={i} className="flex gap-4 p-3 bg-secondary/30 rounded-xl border border-border/40 hover:border-accent/20 transition-all">
                <div className="w-16 h-16 rounded-xl bg-secondary/80 overflow-hidden ring-1 ring-border/20 shrink-0">
                  <img src={p.image || outfit.image || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80"} alt={p.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                      <span className="text-[10px]">{platformStyles[p.platform]?.icon}</span>
                      <span className={`text-[10px] font-body font-bold uppercase tracking-wider ${platformStyles[p.platform]?.text}`}>{p.platform}</span>
                      {p.badge && (
                        <span className={`text-[9px] font-body px-1 py-0.5 rounded ${platformStyles[p.platform]?.bg} ${platformStyles[p.platform]?.text}`}>
                          {p.badge}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-body font-semibold text-foreground leading-snug line-clamp-2">{p.name}</h4>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-[10px] text-muted-foreground font-body font-medium">{p.rating}</span>
                    </div>
                    <span className="text-[10px] text-muted-foreground font-body">· đã bán {p.sold}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end justify-between shrink-0 pl-2">
                  <div className="text-right">
                    <span className="text-sm font-body font-extrabold text-accent">{p.price}</span>
                    {p.oldPrice && <span className="text-[10px] text-muted-foreground line-through block mt-0.5">{p.oldPrice}</span>}
                  </div>
                  <Button size="sm" className="h-8 rounded-lg text-[10px] px-3 gap-1 shadow-sm mt-3" variant="accent" 
                    onClick={() => {
                      trackAffiliateClick();
                      window.open(p.affiliateUrl || "#", "_blank");
                    }}
                  >
                    Mua ngay <ExternalLink className="w-2.5 h-2.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/40 text-xs font-body">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Tổng chi phí dự tính</span>
              <span className="text-base font-heading font-extrabold text-accent">{outfit.totalPrice}</span>
            </div>
            <Button variant="outline" size="sm" className="rounded-xl h-9 text-xs px-4" onClick={() => setCompareOpen(false)}>
              Đóng
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default OutfitCard;
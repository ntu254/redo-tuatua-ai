import type { AIAction, Outfit } from "@/features/recommender/types";
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
  Copy,
  ExternalLink,
  Heart,
  RefreshCw,
  Share2,
  ShoppingCart,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { useState } from "react";

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
      className="bg-[linear-gradient(180deg,hsl(var(--card))_0%,hsl(var(--secondary)/0.36)_100%)] rounded-2xl overflow-hidden border border-border/60 hover:border-border hover:shadow-xl hover:shadow-foreground/[0.04] transition-all duration-500 group"
    >
      {/* TOP SECTION: Tags + Score */}
      <div className="px-5 pt-4 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {outfit.styleTags.map((tag) => (
            <span key={tag} className="bg-secondary/78 text-foreground text-[10px] font-body font-medium px-2.5 py-1 rounded-lg border border-border">
              {tag}
            </span>
          ))}
          {outfit.aiMatch && (
            <span className="bg-accent text-accent-foreground text-[10px] font-body font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Pick
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {outfit.matchScore && (
            <div className="px-2.5 py-1 rounded-lg bg-accent/10 border border-accent/20">
              <span className="text-[11px] font-body font-bold text-accent">{outfit.matchScore}% Match</span>
            </div>
          )}
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

      {/* CENTER: AI Try-On Preview */}
      <div className="relative w-full h-[360px]">
        <img
          src={outfit.tryOnImage || outfit.image}
          alt={outfit.title}
          className="w-full h-full object-cover"
        />
        {outfit.personalization && outfit.personalization.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {outfit.personalization.map((p, i) => (
              <div key={i} className="px-2.5 py-1.5 rounded-lg bg-background/85 backdrop-blur-md shadow-sm text-[10px] font-body text-foreground/80">
                {p}
              </div>
            ))}
          </div>
        )}

        {/* Hover actions overlay */}
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
            <Bookmark className={`w-4 h-4 transition-colors ${outfit.userSaved ? "text-accent fill-accent" : "text-foreground"}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(outfit)}
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
            <Heart className={`w-4 h-4 transition-colors ${outfit.userLiked === true ? "text-red-500 fill-red-500" : "text-foreground"}`} />
          </motion.button>
        </motion.div>

        {/* Title overlay at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-foreground/70 via-foreground/20 to-transparent px-5 pb-3 pt-10">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-lg font-semibold text-white leading-tight drop-shadow-sm">
              {outfit.title} {outfit.emoji}
            </h3>
          </div>
        </div>
      </div>

      {/* AI Comment */}
      <div className="px-5 pt-3 pb-1">
        <div className="bg-gradient-to-r from-secondary/88 via-secondary/46 to-transparent border border-accent/12 rounded-xl px-4 py-3">
          <p className="text-[12px] font-body text-foreground/80 leading-relaxed">
            <span className="text-accent font-semibold inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Redo AI:
            </span>{" "}
            {outfit.aiComment}
          </p>
        </div>
      </div>

      {/* AI Confidence */}
      {outfit.aiConfidence && outfit.aiConfidence.length > 0 && (
        <div className="px-5 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {outfit.aiConfidence.map((c, i) => (
              <span
                key={i}
                className={`text-[10px] font-body px-2 py-0.5 rounded-full ${
                  c.positive
                    ? "bg-teal/8 text-teal border border-teal/20"
                    : "bg-muted/8 text-muted-foreground border border-border/40"
                }`}
              >
                {c.positive ? "✓" : "✗"} {c.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM SECTION: Items + Missing Items + Price + CTA */}
      <div className="px-5 pt-3 pb-5">
        {/* Owned Items */}
        {outfit.userOwnsItems && outfit.userOwnsItems.length > 0 && (
          <div className="mb-3 p-3 rounded-xl bg-teal/5 border border-teal/15">
            <p className="text-[10px] font-body font-semibold text-teal uppercase tracking-wider mb-1.5">Bạn đã có sẵn</p>
            <div className="flex flex-wrap gap-1.5">
              {outfit.userOwnsItems.map((item) => (
                <span key={item} className="text-[11px] font-body text-teal/80 flex items-center gap-1">
                  <span className="w-3.5 h-3.5 rounded-full bg-teal/15 flex items-center justify-center">
                    <span className="text-[8px]">✓</span>
                  </span>
                  {item}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Items */}
        {outfit.missingItems && outfit.missingItems.length > 0 && (
          <div className="mb-3 p-3 rounded-xl bg-accent/5 border border-accent/15">
            <p className="text-[10px] font-body font-semibold text-accent uppercase tracking-wider mb-1.5">Cần mua thêm</p>
            <div className="space-y-1.5">
              {outfit.missingItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-[12px] font-body">
                  <div className="flex items-center gap-1.5">
                    <span className="text-accent">→</span>
                    <span className="text-foreground/80">{item.name}</span>
                    <span className="text-muted-foreground/60 text-[10px]">— {item.reason}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-foreground font-medium">{item.price}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-foreground/5 text-muted-foreground">{item.platform}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Product Items */}
        <div className="space-y-1">
          {(expanded ? outfit.products : outfit.products.slice(0, 3)).map((p, i) => (
            <motion.div
              key={i}
              whileHover={{ x: 2 }}
              className="flex items-center gap-3 group/item hover:bg-secondary/56 rounded-xl p-2 -mx-2 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-secondary/78 shrink-0 overflow-hidden ring-1 ring-border/50">
                <img
                  src={p.image || outfit.image || "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80"}
                  alt={p.name}
                  className="w-full h-full object-cover opacity-75 group-hover/item:opacity-100 transition-opacity"
                />
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
              <motion.a
                href={p.affiliateUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-accent text-accent-foreground opacity-0 group-hover/item:opacity-100 transition-opacity shrink-0 shadow-sm"
                onClick={(e) => { if (!p.affiliateUrl) e.preventDefault(); }}
              >
                <ExternalLink className="w-3 h-3" />
              </motion.a>
            </motion.div>
          ))}
        </div>

        {outfit.products.length > 3 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center justify-center gap-1.5 text-[11px] font-body font-medium text-muted-foreground hover:text-accent py-2 transition-colors w-full"
          >
            {expanded ? (
              <>Thu gọn <ChevronUp className="w-3.5 h-3.5" /></>
            ) : (
              <>Xem thêm {outfit.products.length - 3} sản phẩm <ChevronDown className="w-3.5 h-3.5" /></>
            )}
          </button>
        )}

        {/* Bottom Bar: Price + CTA + Social */}
        <div className="mt-3 pt-3 border-t border-border/60 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-body text-muted-foreground uppercase tracking-[0.15em] mb-0.5">Tổng ước tính</p>
              <p className="text-lg font-heading font-bold text-accent">{outfit.totalPrice}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-[10px] rounded-xl h-9 px-3 gap-1" onClick={() => setCompareOpen(true)}>
                <ShoppingCart className="w-3 h-3" /> So sánh
              </Button>
              <Button variant="accent" size="sm" className="text-[11px] rounded-xl px-4 h-9 gap-1.5 shadow-sm shadow-accent/20 hover:shadow-md hover:shadow-accent/30 active:scale-95 transition-all">
                <ShoppingCart className="w-3 h-3" /> Shop This Look
              </Button>
            </div>
          </div>

          {/* Available on platforms */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-body text-muted-foreground">Available on:</span>
              {[...new Set(outfit.products.map((p) => p.platform))].map((plat) => (
                <span key={plat} className="text-[10px] font-body px-1.5 py-0.5 rounded bg-secondary text-foreground/70 border border-border/50">
                  {plat}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={handleCopyLook}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="Copy look"
              >
                {copied ? <span className="text-[10px] text-teal">Copied!</span> : <Copy className="w-3 h-3" />}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => onShare(outfit)}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                title="Share"
              >
                <Share2 className="w-3 h-3" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* AI Actions */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onAction(outfit.id, "regenerate")}
            className="flex items-center gap-1 text-[10px] font-body font-medium px-3 py-1.5 rounded-full bg-accent/8 text-accent border border-accent/20 hover:bg-accent/15 active:scale-95 transition-all"
          >
            <RefreshCw className="w-3 h-3" /> Tạo lại
          </motion.button>
          {AI_ACTIONS.map((a) => (
            <motion.button
              key={a.action}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onAction(outfit.id, a.action)}
              className="text-[10px] font-body font-medium px-3 py-1.5 rounded-full border border-border bg-background/80 hover:border-accent/20 hover:text-accent hover:bg-secondary/60 active:scale-95 transition-all"
            >
              {a.icon} {a.label}
            </motion.button>
          ))}
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
                  {p.oldPrice && <p className="text-xs text-muted-foreground font-body line-through">{p.oldPrice}</p>}
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

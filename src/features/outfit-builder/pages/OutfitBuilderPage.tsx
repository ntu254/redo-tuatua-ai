import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Flame, Loader2, ShoppingBag, Sparkles } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Navbar } from "@/shared/layout";
import { supabase } from "@/shared/lib";

interface OutfitItem {
  id: string;
  name: string;
  image_url: string;
  price: number;
  affiliate_url: string;
  brand: string;
  slot: string;
  click_count: number;
}

interface Outfit {
  style: string;
  description: string;
  items: OutfitItem[];
  total_price: number;
  trending: boolean;
}

const QUICK_PROMPTS = [
  { label: "Đi cà phê sáng ☕", text: "outfit đi cà phê sáng nhẹ nhàng thoải mái" },
  { label: "Streetwear cuối tuần 🔥", text: "streetwear cá tính cuối tuần" },
  { label: "Công sở dưới 1tr 💼", text: "outfit công sở lịch sự dưới 1 triệu" },
  { label: "Hẹn hò tối nay 🌙", text: "outfit hẹn hò lãng mạn tối nay" },
  { label: "Dạo phố mùa hè 🌴", text: "outfit dạo phố mùa hè thoáng mát" },
  { label: "Tiệc tùng sang chảnh ✨", text: "outfit tiệc tùng sang trọng nổi bật" },
];

const SLOT_LABELS: Record<string, string> = {
  top: "Áo",
  bottom: "Quần / Váy",
  shoes: "Giày",
  accessory: "Phụ kiện",
};

const SLOT_ORDER = ["top", "bottom", "shoes", "accessory"];

export default function OutfitBuilderPage() {
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [error, setError] = useState("");

  const trafficRef = searchParams.get("ref") || "direct";

  const buildOutfit = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setError("");
    setOutfit(null);
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-outfit", {
        body: { text, ref: trafficRef },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setOutfit(data.outfit);
    } catch (err) {
      setError((err as Error).message || "Không thể tạo outfit. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    buildOutfit(input);
  };

  const trackClick = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await (supabase as any).from("clicks").insert({
        product_id: productId,
        user_id: user?.id || null,
        source: "affiliate",
        traffic_source: trafficRef,
      } as any);
    } catch (err) {
      console.warn("Click tracking failed:", err);
    }
  };

  const sortedItems = [...(outfit?.items || [])].sort(
    (a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot),
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <p className="text-[11px] font-body font-semibold uppercase tracking-[0.18em] text-foreground/45 mb-3">
            AI Styling
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.05] mb-3">
            Bạn muốn mặc gì hôm nay?
          </h1>
          <p className="text-foreground/65 font-body text-base max-w-md leading-relaxed">
            Mô tả phong cách, dịp hoặc tâm trạng của bạn, AI sẽ phối một outfit hoàn chỉnh kèm link mua hàng.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="VD: đi chơi tối cá tính, dưới 2 triệu"
            className="flex-1 h-12 px-5 bg-card text-foreground placeholder:text-foreground/40 text-sm font-body outline-none focus:ring-2 focus:ring-foreground/10 transition-all"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} className="h-12 px-6 gap-2 rounded-md bg-foreground text-background hover:bg-foreground/92">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Tạo
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p.text}
              onClick={() => { setInput(p.text); buildOutfit(p.text); }}
              disabled={isLoading}
              className="text-xs font-medium px-4 py-2 rounded-md bg-secondary/50 text-foreground/70 hover:bg-secondary hover:text-foreground transition-all disabled:opacity-50"
            >
              {p.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-20"
            >
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-sm text-foreground/55 font-body">Đang phối đồ cho bạn.</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-destructive/5 p-5"
            >
              <p className="text-sm font-body text-foreground/85 mb-3">{error}</p>
              <Button onClick={() => buildOutfit(input)} variant="outline" size="sm" className="h-9 text-xs">
                Thử lại
              </Button>
            </motion.div>
          )}

          {outfit && !isLoading && (
            <motion.div
              key="outfit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
                  {outfit.style}
                </h2>
                {outfit.trending && (
                  <span className="flex items-center gap-1 text-[10px] font-body font-semibold uppercase tracking-wider text-orange-600">
                    <Flame className="w-3 h-3" /> Trending tuần này
                  </span>
                )}
              </div>
              <p className="text-sm text-foreground/65 font-body leading-relaxed mb-8 max-w-2xl">
                {outfit.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {sortedItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className="group bg-card overflow-hidden transition-colors duration-300 hover:shadow-sm"
                  >
                    <div className="aspect-[3/4] bg-secondary/50 flex items-center justify-center overflow-hidden relative">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                          loading="lazy"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-foreground/20" />
                      )}
                    </div>
                    <div className="p-3.5">
                      <span className="text-[10px] font-body font-semibold uppercase tracking-[0.12em] text-foreground/45">
                        {SLOT_LABELS[item.slot] || item.slot}
                      </span>
                      <p className="text-sm font-body font-medium text-foreground mt-1 line-clamp-1">{item.name}</p>
                      {item.brand && (
                        <p className="text-xs text-foreground/45 font-body line-clamp-1 mt-0.5">{item.brand}</p>
                      )}
                      <div className="flex items-baseline justify-between mt-2">
                        <p className="text-sm font-body font-semibold text-foreground">
                          {item.price > 0 ? `${item.price.toLocaleString()}đ` : "Liên hệ"}
                        </p>
                        {item.click_count > 5 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-foreground/55 font-body">
                            <BadgeCheck className="w-2.5 h-2.5" /> {item.click_count}
                          </span>
                        )}
                      </div>
                      {item.affiliate_url && (
                        <a
                          href={item.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackClick(item.id)}
                          className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs h-9 font-body font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors"
                        >
                          Xem sản phẩm <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {outfit.items.length > 0 && (
                <div className="flex items-center justify-between border-t border-border/30 pt-6 mt-2">
                  <div>
                    <p className="text-[10px] font-body font-semibold uppercase tracking-[0.12em] text-foreground/45 mb-1">
                      Tổng outfit
                    </p>
                    <p className="font-heading text-2xl font-semibold text-foreground tracking-tight">
                      {outfit.total_price.toLocaleString()}đ
                    </p>
                  </div>
                  <Button
                    className="gap-2 h-11 px-5 font-body font-semibold bg-foreground text-background hover:bg-foreground/92"
                    onClick={() => {
                      outfit.items.forEach((item) => {
                        if (item.affiliate_url) {
                          trackClick(item.id);
                          window.open(item.affiliate_url, "_blank");
                        }
                      });
                    }}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Mua cả outfit
                  </Button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

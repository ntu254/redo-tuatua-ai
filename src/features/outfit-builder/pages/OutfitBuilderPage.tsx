import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Flame, Loader2, ShoppingBag, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
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
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/30 to-background">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 pt-24 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
            Bạn muốn mặc gì hôm nay?
          </h1>
          <p className="text-foreground/60 max-w-md mx-auto">
            Mô tả phong cách, dịp hoặc tâm trạng — AI sẽ phối outfit hoàn hảo kèm link mua hàng.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="VD: outfit đi chơi tối cá tính dưới 2 triệu..."
            className="flex-1 h-12 px-5 rounded-xl border border-border bg-card text-foreground placeholder:text-foreground/40 text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/10 transition-all"
          />
          <Button type="submit" disabled={isLoading || !input.trim()} variant="accent" className="h-12 px-6 gap-2 rounded-xl">
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
              className="text-xs font-medium px-4 py-2 rounded-full border border-border bg-card text-foreground/70 hover:border-accent/30 hover:text-accent hover:bg-accent/5 transition-all disabled:opacity-50"
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
                <span className="w-2.5 h-2.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2.5 h-2.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2.5 h-2.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
              <p className="text-sm text-foreground/50">AI đang phối outfit cho bạn...</p>
            </motion.div>
          )}

          {error && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center py-10"
            >
              <p className="text-sm text-destructive mb-4">{error}</p>
              <Button onClick={() => buildOutfit(input)} variant="outline" size="sm">Thử lại</Button>
            </motion.div>
          )}

          {outfit && !isLoading && (
            <motion.div
              key="outfit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-accent/10 text-accent">
                  {outfit.style}
                </span>
                {outfit.trending && (
                  <span className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-orange-500/10 text-orange-600">
                    <Flame className="w-3 h-3" /> Trending
                  </span>
                )}
                <span className="text-sm text-foreground/60">{outfit.description}</span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {sortedItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-md hover:border-accent/20 transition-all"
                  >
                    <div className="aspect-[3/4] bg-secondary/50 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      ) : (
                        <ShoppingBag className="w-8 h-8 text-foreground/20" />
                      )}
                    </div>
                    <div className="p-3">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-foreground/40">
                        {SLOT_LABELS[item.slot] || item.slot}
                      </span>
                      <p className="text-sm font-medium text-foreground mt-0.5 line-clamp-1">{item.name}</p>
                      {item.brand && (
                        <p className="text-xs text-foreground/40 line-clamp-1">{item.brand}</p>
                      )}
                      <p className="text-sm font-semibold text-accent mt-1">
                        {item.price > 0 ? `${item.price.toLocaleString()}đ` : "Liên hệ"}
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {item.click_count > 5 && (
                          <span className="flex items-center gap-0.5 text-[10px] text-green-600">
                            <BadgeCheck className="w-2.5 h-2.5" /> {item.click_count} đã mua
                          </span>
                        )}
                      </div>
                      {item.affiliate_url && (
                        <a
                          href={item.affiliate_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackClick(item.id)}
                          className="mt-2 w-full inline-flex items-center justify-center gap-1 text-xs h-8 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 transition-colors"
                        >
                          Mua ngay <ArrowRight className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>

              {outfit.items.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-foreground/40">Tổng outfit</p>
                    <p className="text-xl font-bold text-foreground">
                      {outfit.total_price.toLocaleString()}đ
                    </p>
                  </div>
                  <Button
                    variant="accent"
                    className="gap-2 rounded-xl"
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
                    Mua full outfit
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

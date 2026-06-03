import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Flame, Loader2, ShoppingBag, Shirt } from "lucide-react";

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

interface TryOnCanvasProps {
  isLoading: boolean;
  outfit: Outfit | null;
  error: string;
  onRetry: () => void;
  trackClick: (productId: string) => void;
}

const SLOT_LABELS: Record<string, string> = {
  top: "Áo",
  bottom: "Quần / Váy",
  shoes: "Giày",
  accessory: "Phụ kiện",
};

const SLOT_ORDER = ["top", "bottom", "shoes", "accessory"];

export default function TryOnCanvas({
  isLoading,
  outfit,
  error,
  onRetry,
  trackClick,
}: TryOnCanvasProps) {
  const sortedItems = [...(outfit?.items || [])].sort(
    (a, b) => SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot),
  );

  return (
    <section className="flex-1 flex flex-col bg-background relative min-w-0 h-full">
      {/* Header */}
      <header className="h-16 border-b border-border/30 flex items-center justify-between px-6 shrink-0">
        <h1 className="font-heading text-xl font-semibold text-foreground">Try-On Preview</h1>
        {/* Segmented Control */}
        <div className="flex bg-secondary rounded-xl p-1">
          <button className="py-1 px-4 rounded-xl text-foreground/60 text-xs font-body hover:text-foreground transition-colors">Before</button>
          <button className="py-1 px-4 rounded-xl bg-card text-foreground text-xs font-body shadow-sm">After</button>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-card rounded-xl border border-border/50 shadow-sm flex flex-col items-center justify-center p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="w-5 h-5 text-foreground/40 animate-spin" />
              </div>
              <p className="text-sm font-body text-foreground/60">AI is creating your outfit...</p>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-card rounded-xl border border-border/50 shadow-sm flex flex-col items-center justify-center p-6"
            >
              <p className="text-sm font-body text-foreground/70 mb-4">{error}</p>
              <button onClick={onRetry} className="px-4 py-2 rounded-xl border border-foreground text-foreground text-xs font-body font-medium hover:bg-secondary/50 transition-colors cursor-pointer">
                Thử lại
              </button>
            </motion.div>
          )}

          {outfit && !isLoading && (
            <motion.div
              key="outfit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 bg-card rounded-xl border border-border/50 shadow-sm flex flex-col overflow-hidden"
            >
              {/* Outfit Header */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <h2 className="font-heading text-2xl font-semibold text-foreground tracking-tight">
                    {outfit.style}
                  </h2>
                  {outfit.trending && (
                    <span className="flex items-center gap-1 text-[10px] font-body font-semibold uppercase tracking-wider text-orange-600">
                      <Flame className="w-3 h-3" /> Trending
                    </span>
                  )}
                </div>
                <p className="text-sm font-body text-foreground/60 mt-1 leading-relaxed max-w-2xl">
                  {outfit.description}
                </p>
              </div>

              {/* Items Grid */}
              <div className="flex-1 overflow-y-auto px-6 pb-4">
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                  {sortedItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                      className="bg-background rounded-xl overflow-hidden transition-colors duration-300 hover:shadow-sm"
                    >
                      <div className="aspect-[3/4] bg-secondary/50 flex items-center justify-center overflow-hidden relative">
                        {item.image_url ? (
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
                            loading="lazy"
                          />
                        ) : (
                          <ShoppingBag className="w-8 h-8 text-foreground/20" />
                        )}
                      </div>
                      <div className="p-3.5">
                        <span className="text-[10px] font-body font-semibold uppercase tracking-wider text-foreground/45">
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
                            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs h-9 font-body font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-xl"
                          >
                            Xem sản phẩm <ArrowRight className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Total */}
                {outfit.items.length > 0 && (
                  <div className="flex items-center justify-between border-t border-border/30 pt-4 mt-4">
                    <div>
                      <p className="text-[10px] font-body font-semibold uppercase tracking-wider text-foreground/45 mb-1">
                        Tổng outfit
                      </p>
                      <p className="font-heading text-2xl font-semibold text-foreground tracking-tight">
                        {outfit.total_price.toLocaleString()}đ
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        outfit.items.forEach((item) => {
                          if (item.affiliate_url) {
                            trackClick(item.id);
                            window.open(item.affiliate_url, "_blank");
                          }
                        });
                      }}
                      className="gap-2 h-11 px-5 font-body font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-xl text-sm inline-flex items-center cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Mua cả outfit
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {!isLoading && !outfit && !error && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 bg-card rounded-xl border border-border/50 shadow-sm flex flex-col items-center justify-center p-6 relative overflow-hidden"
            >
              <div className="text-center max-w-md z-10">
                <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-foreground/40 mx-auto mb-4">
                  <Shirt className="w-8 h-8" />
                </div>
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">Ready to create magic</h2>
                <p className="text-sm font-body text-foreground/60 mb-6">Try-on results will appear here. Follow the steps in the control panel to begin.</p>
                <div className="bg-background rounded-xl border border-border/30 p-4 text-left inline-block w-full">
                  <ul className="flex flex-col gap-3">
                    <li className="flex items-center gap-3 text-foreground text-sm font-body">
                      <span className="w-5 h-5 rounded-full border-2 border-foreground/30 flex items-center justify-center text-[10px] text-foreground/40 font-body">1</span>
                      <span>Upload your Model photo</span>
                    </li>
                    <li className="flex items-center gap-3 text-foreground text-sm font-body">
                      <span className="w-5 h-5 rounded-full border-2 border-foreground/30 flex items-center justify-center text-[10px] text-foreground/40 font-body">2</span>
                      <span>Select or generate an Outfit</span>
                    </li>
                    <li className="flex items-center gap-3 text-foreground text-sm font-body">
                      <span className="w-5 h-5 rounded-full border-2 border-foreground/30 flex items-center justify-center text-[10px] text-foreground/40 font-body">3</span>
                      <span>Click Start Try-On</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Status */}
      <footer className="h-12 border-t border-border/30 flex items-center px-6 bg-background shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoading ? "bg-accent animate-pulse" : "bg-foreground/40"}`} />
          <span className="text-xs font-body text-foreground/60">
            {isLoading ? "Generating..." : "Status: Ready"}
          </span>
        </div>
      </footer>
    </section>
  );
}

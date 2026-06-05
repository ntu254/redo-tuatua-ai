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

  // Try-on props
  humanImage: string | null;
  selectedClothId: string | null;
  setSelectedClothId: (id: string | null) => void;
  setSelectedClothImage: (url: string | null) => void;
  tryOnImage: string | null;
  tryOnStatus: string;
  viewMode: "before" | "after";
  setViewMode: (v: "before" | "after") => void;
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
  humanImage,
  selectedClothId,
  setSelectedClothId,
  setSelectedClothImage,
  tryOnImage,
  tryOnStatus,
  viewMode,
  setViewMode,
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
        <div className="flex bg-secondary rounded-xl p-1 shrink-0">
          <button
            onClick={() => setViewMode("before")}
            className={`py-1.5 px-4 rounded-xl text-xs font-body transition-all cursor-pointer ${
              viewMode === "before" ? "bg-card text-foreground shadow-sm font-medium" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            Before
          </button>
          <button
            onClick={() => setViewMode("after")}
            className={`py-1.5 px-4 rounded-xl text-xs font-body transition-all cursor-pointer ${
              viewMode === "after" ? "bg-card text-foreground shadow-sm font-medium" : "text-foreground/60 hover:text-foreground"
            }`}
          >
            After
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="flex-1 p-6 overflow-hidden flex flex-col min-h-0">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full bg-card rounded-xl border border-border/50 shadow-sm flex flex-col items-center justify-center p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Loader2 className="w-5 h-5 text-foreground/40 animate-spin" />
              </div>
              <p className="text-sm font-body text-foreground/60 animate-pulse">AI is creating your outfit...</p>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="h-full bg-card rounded-xl border border-border/50 shadow-sm flex flex-col items-center justify-center p-6"
            >
              <p className="text-sm font-body text-foreground/75 mb-4 text-center max-w-sm leading-relaxed">{error}</p>
              <button onClick={onRetry} className="px-4.5 py-2 rounded-xl border border-foreground hover:bg-secondary text-foreground text-xs font-body font-semibold transition-colors cursor-pointer active:scale-95">
                Thử lại
              </button>
            </motion.div>
          )}

          {!isLoading && !error && (
            <>
              {viewMode === "before" ? (
                // --- BEFORE MODE (Outfit list) ---
                outfit ? (
                  <motion.div
                    key="outfit-before"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full bg-card rounded-xl border border-border/50 shadow-sm flex flex-col overflow-hidden"
                  >
                    {/* Outfit Header */}
                    <div className="px-6 pt-6 pb-4">
                      <div className="flex items-baseline gap-3 flex-wrap">
                        <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground tracking-tight">
                          {outfit.style}
                        </h2>
                        {outfit.trending && (
                          <span className="flex items-center gap-1 text-[10px] font-body font-bold uppercase tracking-wider text-orange-600">
                            <Flame className="w-3 h-3" /> Trending
                          </span>
                        )}
                      </div>
                      <p className="text-xs md:text-sm font-body text-foreground/60 mt-1 leading-relaxed max-w-2xl">
                        {outfit.description}
                      </p>
                    </div>

                    {/* Items Grid */}
                    <div className="flex-1 overflow-y-auto px-6 pb-4">
                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {sortedItems.map((item, i) => {
                          const isSelected = selectedClothId === item.id;
                          return (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, y: 16 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                              onClick={() => {
                                setSelectedClothId(item.id);
                                setSelectedClothImage(item.image_url);
                              }}
                              className={`bg-background rounded-xl overflow-hidden border-2 transition-all duration-300 relative cursor-pointer ${
                                isSelected
                                  ? "border-foreground shadow-md scale-[1.01]"
                                  : "border-transparent hover:border-border/60 hover:shadow-sm"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-2.5 left-2.5 bg-foreground text-background px-2.5 py-1 rounded-[6px] text-[9px] font-body font-bold uppercase tracking-wider shadow-sm z-10">
                                  Selected
                                </div>
                              )}
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
                                <p className="text-xs md:text-sm font-body font-medium text-foreground mt-1 line-clamp-1">{item.name}</p>
                                {item.brand && (
                                  <p className="text-[11px] text-foreground/45 font-body line-clamp-1 mt-0.5">{item.brand}</p>
                                )}
                                <div className="flex items-baseline justify-between mt-2">
                                  <p className="text-xs md:text-sm font-body font-semibold text-foreground">
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
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      trackClick(item.id);
                                    }}
                                    className="mt-3 w-full inline-flex items-center justify-center gap-1.5 text-xs h-9 font-body font-medium bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-xl"
                                  >
                                    Xem sản phẩm <ArrowRight className="w-3 h-3" />
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Total */}
                      {outfit.items.length > 0 && (
                        <div className="flex items-center justify-between border-t border-border/30 pt-4 mt-5">
                          <div>
                            <p className="text-[10px] font-body font-semibold uppercase tracking-wider text-foreground/45 mb-1">
                              Tổng outfit
                            </p>
                            <p className="font-heading text-xl font-bold text-foreground tracking-tight">
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
                            className="gap-2 h-11 px-5 font-body font-semibold bg-foreground text-background hover:bg-foreground/90 transition-colors rounded-xl text-xs md:text-sm inline-flex items-center cursor-pointer active:scale-95"
                          >
                            <ShoppingBag className="w-4 h-4" />
                            Mua cả outfit
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  // --- BEFORE MODE (Empty state) ---
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full bg-card rounded-xl border border-border/50 shadow-sm flex flex-col items-center justify-center p-6 relative overflow-hidden"
                  >
                    <div className="text-center max-w-md z-10">
                      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center text-foreground/40 mx-auto mb-4">
                        <Shirt className="w-8 h-8" />
                      </div>
                      <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground mb-2">Ready to create magic</h2>
                      <p className="text-xs md:text-sm font-body text-foreground/60 mb-6">Coordinate results will appear here. Follow the steps in the control panel to begin.</p>
                      <div className="bg-background rounded-xl border border-border/30 p-4 text-left inline-block w-full">
                        <ul className="flex flex-col gap-3">
                          <li className="flex items-center gap-3 text-foreground text-sm font-body">
                            <span className="w-5 h-5 rounded-full border-2 border-foreground/30 flex items-center justify-center text-[10px] text-foreground/40 font-body font-semibold">1</span>
                            <span>Upload your Model photo</span>
                          </li>
                          <li className="flex items-center gap-3 text-foreground text-sm font-body">
                            <span className="w-5 h-5 rounded-full border-2 border-foreground/30 flex items-center justify-center text-[10px] text-foreground/40 font-body font-semibold">2</span>
                            <span>Coordinate an Outfit using AI Suggestion</span>
                          </li>
                          <li className="flex items-center gap-3 text-foreground text-sm font-body">
                            <span className="w-5 h-5 rounded-full border-2 border-foreground/30 flex items-center justify-center text-[10px] text-foreground/40 font-body font-semibold">3</span>
                            <span>Select coordinated clothes or upload custom item</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )
              ) : (
                // --- AFTER MODE (Kling virtual try-on) ---
                <motion.div
                  key="tryon-after"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full bg-card rounded-xl border border-border/50 shadow-sm flex flex-col justify-center items-center overflow-hidden p-6"
                >
                  {tryOnStatus === "submitting" || tryOnStatus === "processing" ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-4 max-w-sm">
                      <Loader2 className="w-8 h-8 text-foreground/50 animate-spin" />
                      <h3 className="font-heading text-lg font-bold text-foreground">Đang xử lý thử đồ ảo...</h3>
                      <p className="text-xs font-body text-muted-foreground leading-relaxed animate-pulse">
                        Kling AI đang tiến hành tạo hình ảnh ghép. Quá trình này thông thường sẽ mất từ 10 đến 30 giây. Vui lòng đợi trong giây lát!
                      </p>
                    </div>
                  ) : tryOnStatus === "succeed" && tryOnImage ? (
                    <div className="relative max-h-full max-w-md w-full aspect-[3/4] rounded-lg overflow-hidden border border-border/40 shadow-md">
                      <img
                        src={tryOnImage}
                        alt="Try-on result"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-3 left-3 bg-teal text-white px-2.5 py-1 rounded-[6px] text-[10px] font-body font-bold uppercase tracking-wider shadow-sm z-10 flex items-center gap-1">
                        <BadgeCheck className="w-3.5 h-3.5" /> Tried-on by Kling AI
                      </div>
                    </div>
                  ) : (
                    <div className="text-center max-w-md space-y-3">
                      <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center text-foreground/30 mx-auto">
                        <Shirt className="w-6 h-6" />
                      </div>
                      <h3 className="font-heading text-lg font-bold text-foreground">Chưa có kết quả thử đồ ảo</h3>
                      <p className="text-xs font-body text-muted-foreground max-w-xs leading-relaxed mx-auto">
                        Hãy đảm bảo bạn đã tải ảnh model tại Bước 1, chọn trang phục mong muốn tại Bước 2, sau đó nhấp nút **"Start Try-On"** ở góc dưới cùng bên trái.
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Status */}
      <footer className="h-12 border-t border-border/30 flex items-center px-6 bg-background shrink-0">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isLoading || tryOnStatus === "processing" ? "bg-accent animate-pulse" : "bg-foreground/40"}`} />
          <span className="text-xs font-body text-foreground/60">
            {isLoading
              ? "Generating outfit..."
              : tryOnStatus === "submitting" || tryOnStatus === "processing"
              ? "Kling AI is processing try-on..."
              : "Status: Ready"}
          </span>
        </div>
      </footer>
    </section>
  );
}

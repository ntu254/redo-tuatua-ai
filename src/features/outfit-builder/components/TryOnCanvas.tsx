import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, BadgeCheck, Flame, Loader2, ShoppingBag, Shirt, Sparkles, X } from "lucide-react";

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
      <header className="h-20 border-b border-border/40 flex items-center justify-between px-8 shrink-0">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Kết quả AI</h1>
          <p className="editorial-label mt-1">Trải nghiệm mặc thử</p>
        </div>
        {/* Segmented Control */}
        <div className="flex bg-secondary/60 rounded-full p-1.5 shrink-0 shadow-sm border border-border/50">
          <button
            onClick={() => setViewMode("before")}
            className={`py-2 px-5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
              viewMode === "before" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            }`}
          >
            Outfit
          </button>
          <button
            onClick={() => setViewMode("after")}
            className={`py-2 px-5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
              viewMode === "after" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-background/40"
            }`}
          >
            Mặc thử
          </button>
        </div>
      </header>

      {/* Main Canvas */}
      <div className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col min-h-0 bg-background/50">
        <AnimatePresence mode="wait">
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full soft-panel rounded-[24px] flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mb-6 shadow-sm border border-accent/20">
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <h2 className="font-heading text-2xl font-semibold text-foreground">AI đang phối đồ...</h2>
              <p className="mt-2 text-sm text-muted-foreground">Đang phân tích phong cách và chọn lọc sản phẩm phù hợp nhất.</p>
            </motion.div>
          )}

          {error && !isLoading && (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="h-full soft-panel rounded-[24px] flex flex-col items-center justify-center p-8 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/10 text-destructive flex items-center justify-center mb-6 shadow-sm border border-destructive/20">
                <X className="w-8 h-8" />
              </div>
              <p className="text-sm text-foreground/80 mb-6 max-w-sm leading-relaxed font-medium">{error}</p>
              <button onClick={onRetry} className="px-6 py-2.5 rounded-full bg-foreground hover:bg-foreground/90 text-background text-sm font-semibold transition-colors cursor-pointer active:scale-95 shadow-sm">
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
                    className="h-full soft-panel rounded-[24px] flex flex-col overflow-hidden"
                  >
                    {/* Outfit Header */}
                    <div className="px-8 pt-8 pb-5 border-b border-border/40">
                      <div className="flex items-baseline justify-between flex-wrap gap-4">
                        <div>
                          <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                            {outfit.style}
                          </h2>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-3xl">
                            {outfit.description}
                          </p>
                        </div>
                        {outfit.trending && (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-accent/10 rounded-full text-[10px] font-bold uppercase tracking-wider text-accent border border-accent/20">
                            <Flame className="w-3.5 h-3.5" /> Xu hướng
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Items Grid */}
                    <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 [scrollbar-gutter:stable] bg-card/40">
                      <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
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
                              className={`bg-card rounded-[20px] overflow-hidden transition-all duration-300 relative cursor-pointer group ${
                                isSelected
                                  ? "ring-2 ring-primary shadow-md scale-[1.02]"
                                  : "ring-1 ring-border/50 hover:ring-border hover:shadow-sm"
                              }`}
                            >
                              {isSelected && (
                                <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">
                                  Đã chọn
                                </div>
                              )}
                              <div className="aspect-[3/4] bg-muted/50 flex items-center justify-center overflow-hidden relative">
                                {item.image_url ? (
                                  <img
                                    src={item.image_url}
                                    alt={item.name}
                                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    loading="lazy"
                                  />
                                ) : (
                                  <ShoppingBag className="w-8 h-8 text-muted-foreground/40" />
                                )}
                              </div>
                              <div className="p-4">
                                <span className="editorial-label text-muted-foreground">
                                  {SLOT_LABELS[item.slot] || item.slot}
                                </span>
                                <p className="text-sm font-semibold text-foreground mt-1 line-clamp-1">{item.name}</p>
                                {item.brand && (
                                  <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{item.brand}</p>
                                )}
                                <div className="flex items-center justify-between mt-3">
                                  <p className="text-sm font-bold text-foreground">
                                    {item.price > 0 ? `${item.price.toLocaleString()}đ` : "Liên hệ"}
                                  </p>
                                  {item.click_count > 5 && (
                                    <span className="flex items-center gap-1 text-[10px] text-muted-foreground font-medium">
                                      <BadgeCheck className="w-3 h-3 text-teal" /> {item.click_count}
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
                                    className="mt-4 w-full flex items-center justify-center gap-2 text-xs h-10 font-semibold bg-secondary/60 text-secondary-foreground hover:bg-secondary transition-colors rounded-full"
                                  >
                                    Xem sản phẩm <ArrowRight className="w-3.5 h-3.5" />
                                  </a>
                                )}
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Total */}
                      {outfit.items.length > 0 && (
                        <div className="flex items-center justify-between border-t border-border/40 pt-6 mt-6">
                          <div>
                            <p className="editorial-label text-muted-foreground mb-1">
                              Tổng outfit
                            </p>
                            <p className="font-heading text-2xl font-bold text-foreground tracking-tight">
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
                            className="gap-2 h-12 px-6 font-semibold bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 rounded-full text-sm inline-flex items-center cursor-pointer active:scale-95 shadow-[0_16px_34px_-18px_hsl(var(--accent)/0.62)]"
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
                    className="h-full soft-panel rounded-[24px] flex flex-col items-center justify-center p-8 relative overflow-hidden"
                  >
                    <div className="text-center max-w-md z-10">
                      <div className="w-20 h-20 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground mx-auto mb-6 shadow-sm">
                        <Shirt className="w-8 h-8" />
                      </div>
                      <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-3">Sẵn sàng phối đồ</h2>
                      <p className="text-sm text-muted-foreground mb-8 leading-relaxed">Gợi ý trang phục sẽ xuất hiện tại đây. Làm theo các bước ở bảng điều khiển để bắt đầu.</p>
                      <div className="bg-background/80 backdrop-blur-sm rounded-[20px] border border-border/50 p-6 text-left inline-block w-full shadow-sm">
                        <ul className="flex flex-col gap-4">
                          <li className="flex items-center gap-4 text-foreground text-sm font-medium">
                            <span className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[11px] font-bold shadow-sm">1</span>
                            <span>Tải ảnh người mẫu lên</span>
                          </li>
                          <li className="flex items-center gap-4 text-foreground text-sm font-medium">
                            <span className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[11px] font-bold shadow-sm">2</span>
                            <span>Thiết lập dịp mặc và phong cách</span>
                          </li>
                          <li className="flex items-center gap-4 text-foreground text-sm font-medium">
                            <span className="w-7 h-7 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center text-[11px] font-bold shadow-sm">3</span>
                            <span>Tạo outfit bằng AI</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )
              ) : (
                // --- AFTER MODE (Redo virtual try-on) ---
                <motion.div
                  key="tryon-after"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full soft-panel rounded-[24px] flex flex-col justify-center items-center overflow-hidden p-6 md:p-8"
                >
                  {tryOnStatus === "submitting" || tryOnStatus === "processing" ? (
                    <div className="flex flex-col items-center justify-center text-center space-y-5 max-w-sm">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center text-accent mb-2">
                        <Loader2 className="w-8 h-8 animate-spin" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-foreground">Đang xử lý thử đồ ảo...</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Redo đang tiến hành tạo hình ảnh ghép. Quá trình này thông thường sẽ mất từ 10 đến 30 giây. Vui lòng đợi trong giây lát!
                      </p>
                    </div>
                  ) : tryOnStatus === "succeed" && tryOnImage ? (
                    <div className="relative max-h-full max-w-md w-full aspect-[3/4] rounded-[24px] overflow-hidden border border-border/40 shadow-lg">
                      <img
                        src={tryOnImage}
                        alt="Try-on result"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-4 left-4 bg-teal text-teal-foreground px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm z-10 flex items-center gap-2">
                        <BadgeCheck className="w-4 h-4" /> Redo AI
                      </div>
                    </div>
                  ) : (
                    <div className="text-center max-w-md space-y-4">
                      <div className="w-20 h-20 rounded-full bg-secondary/80 flex items-center justify-center text-muted-foreground mx-auto shadow-sm">
                        <Shirt className="w-8 h-8" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold text-foreground">Chưa có kết quả thử đồ ảo</h3>
                      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mx-auto">
                        Hãy đảm bảo bạn đã tải ảnh model tại Bước 1, chọn trang phục mong muốn tại Bước 2, sau đó nhấp nút **"Tạo ảnh mặc thử"** ở góc dưới cùng bên trái.
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
      <footer className="h-14 border-t border-border/40 flex items-center px-8 bg-card shrink-0 shadow-[0_-4px_16px_rgba(0,0,0,0.02)] z-10">
        <div className="flex items-center gap-3">
          <div className={`w-2.5 h-2.5 rounded-full ${isLoading || tryOnStatus === "processing" ? "bg-accent animate-pulse shadow-[0_0_8px_hsl(var(--accent)/0.6)]" : "bg-muted-foreground/40"}`} />
          <span className="editorial-label text-muted-foreground">
            {isLoading
              ? "Đang phân tích dữ liệu..."
              : tryOnStatus === "submitting" || tryOnStatus === "processing"
              ? "Hệ thống đang xử lý Try-On..."
              : "Trạng thái: Sẵn sàng"}
          </span>
        </div>
      </footer>
    </section>
  );
}

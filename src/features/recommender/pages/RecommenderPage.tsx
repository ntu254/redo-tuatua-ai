import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Navbar } from "@/shared/layout";
import { recommenderService } from "@/features/recommender/services/recommender.service";
import { ChatSidebar, OutfitCard } from "../components";
import type { Outfit } from "../types";

const LOADING_STEPS = [
  "Phân tích style của bạn.",
  "Kết hợp màu sắc.",
  "Đang phối đồ.",
  "Tạo bản xem trước.",
];

const FILTER_CHIPS = ["Sang trọng", "Nữ tính", "Dưới 3 triệu", "Shopee", "TikTok Shop"];

const RecommenderPage = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [activeChips, setActiveChips] = useState<string[]>(["Sang trọng"]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
  const [activeOutfitIndex, setActiveOutfitIndex] = useState(0);
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !isGenerating) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading, isGenerating]);

  const loadOutfits = useCallback(async (text?: string) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = text
        ? await recommenderService.generate({ prompt: text })
        : await recommenderService.listOutfits();
      if (cancelledRef.current) return;
      setOutfits(data);
      setActiveOutfitIndex(0);
    } catch (error) {
      if (cancelledRef.current) return;
      const message =
        error instanceof Error ? error.message : "Không thể tải gợi ý outfit.";
      setLoadError(message);
    } finally {
      if (!cancelledRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    void loadOutfits();
    return () => {
      cancelledRef.current = true;
    };
  }, [loadOutfits]);

  const handleOutfitsGenerated = useCallback(
    (newOutfits: Outfit[], message: string) => {
      setOutfits(newOutfits);
      setActivePrompt(message);
      setIsLoading(false);
      setActiveOutfitIndex(0);
    },
    []
  );

  const filtered = outfits.filter((o) => {
    if (o.userHidden) return false;

    // Filter by price: Dưới 3 triệu
    if (activeChips.includes("Dưới 3 triệu")) {
      const priceNum = Number(o.totalPrice.replace(/[^0-9]/g, ""));
      if (priceNum > 0 && priceNum > 3000000) return false;
    }

    // Filter by platform
    const hasShopee = activeChips.includes("Shopee");
    const hasTikTok = activeChips.includes("TikTok Shop");
    if (hasShopee && !hasTikTok) {
      return o.products.some((p) => p.platform === "Shopee");
    }
    if (hasTikTok && !hasShopee) {
      return o.products.some((p) => p.platform === "TikTok Shop");
    }

    return true;
  });

  const isLoadingAny = isLoading || isGenerating;

  return (
    <div className="min-h-screen bg-background">
      <Navbar compact />

      <div className="pt-16 flex min-h-[calc(100vh-4rem)]">
        <ChatSidebar
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
          onOutfitsGenerated={handleOutfitsGenerated}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />

        <main className="flex-1 min-w-0 p-6 md:p-8 lg:p-10 max-w-4xl mx-auto space-y-6">
          {/* Header Title */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.18em] font-body text-muted-foreground/70 block mb-1">
              Gợi ý outfit
            </span>
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              {activePrompt ? `Gợi ý outfit cho: “${activePrompt}”` : "Gợi ý outfit cho bạn"}
            </h1>
          </div>

          {/* Filter Chips */}
          <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto scrollbar-hide pb-2">
            {FILTER_CHIPS.map((chip) => {
              const isSelected = activeChips.includes(chip);
              return (
                <button
                  key={chip}
                  onClick={() => {
                    if (isSelected) {
                      setActiveChips(activeChips.filter((c) => c !== chip));
                    } else {
                      setActiveChips([...activeChips, chip]);
                    }
                  }}
                  className={`text-xs font-body px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all shrink-0 ${
                    isSelected
                      ? "bg-foreground text-background border-foreground font-medium"
                      : "border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-background/30"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>

          {/* Loader or Error or Empty or Active Set Card */}
          {isLoadingAny && outfits.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="flex items-center gap-1.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse" />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse"
                  style={{ animationDelay: "150ms" }}
                />
                <span
                  className="w-1.5 h-1.5 rounded-full bg-foreground/40 animate-pulse"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
              <motion.p
                key={loadingStep}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="text-xs font-body text-muted-foreground uppercase tracking-wider font-semibold animate-pulse"
              >
                {LOADING_STEPS[loadingStep]}
              </motion.p>
            </div>
          ) : loadError ? (
            <div className="border-l-2 border-destructive pl-4 py-3 text-sm text-destructive">
              {loadError}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center max-w-md mx-auto space-y-4">
              <Sparkles className="w-8 h-8 text-muted-foreground/40 mx-auto animate-pulse" />
              <h3 className="font-heading text-lg font-bold text-foreground">
                Chưa có gợi ý phù hợp
              </h3>
              <p className="text-xs font-body text-muted-foreground leading-relaxed">
                Nhập mô tả phong cách bạn muốn ở ô bên trái hoặc điều chỉnh bộ lọc để xem các gợi ý outfit tiếp theo.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Set Tabs */}
              <div className="flex gap-2 border-b border-border/40 pb-3 overflow-x-auto scrollbar-hide">
                {filtered.map((outfit, i) => {
                  const isActive = activeOutfitIndex === i;
                  return (
                    <button
                      key={outfit.id}
                      onClick={() => setActiveOutfitIndex(i)}
                      className={`px-4 py-2 text-xs md:text-sm font-heading font-semibold border-b-2 whitespace-nowrap transition-all ${
                        isActive
                          ? "border-foreground text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      Set {i + 1}
                    </button>
                  );
                })}
              </div>

              {/* Active Outfit Set Card */}
              {filtered[activeOutfitIndex] && (
                <OutfitCard
                  outfit={filtered[activeOutfitIndex]}
                  index={activeOutfitIndex}
                />
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecommenderPage;

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, RefreshCw, Send } from "lucide-react";
import { Navbar } from "@/shared/layout";
import { recommenderService } from "@/features/recommender/services/recommender.service";
import { ChatSidebar, OutfitCard } from "../components";
import type { AIAction, Outfit } from "../types";

const LOADING_STEPS = [
  "Phân tích style của bạn.",
  "Kết hợp màu sắc.",
  "Đang phối đồ.",
  "Tạo bản xem trước.",
];

const QUICK_PROMPTS = [
  { label: "Hẹn hò tối nay", prompt: "Outfit đi hẹn hò lãng mạn" },
  { label: "Đi làm công sở", prompt: "Office look thanh lịch" },
  { label: "Cuối tuần casual", prompt: "Outfit cuối tuần thoải mái" },
  { label: "Dưới 1 triệu", prompt: "Outfit đẹp dưới 1 triệu" },
  { label: "Phong cách Hàn Quốc", prompt: "Phong cách Hàn Quốc" },
  { label: "Streetwear cá tính", prompt: "Streetwear cá tính" },
];

const SMART_FILTERS = [
  { value: "for_you", label: "For You" },
  { value: "trending", label: "Trending" },
  { value: "wardrobe", label: "Tủ đồ" },
  { value: "recent", label: "Gần đây" },
  { value: "budget", label: "Tiết kiệm" },
];

const RecommenderPage = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [smartFilter, setSmartFilter] = useState("for_you");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loadingStep, setLoadingStep] = useState(0);
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

  const handleSendPrompt = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setPrompt("");
    setIsGenerating(true);
    setActivePrompt(trimmed);
    try {
      const data = await recommenderService.generate({ prompt: trimmed });
      setOutfits(data);
    } catch {
      // fallback handled by service
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleOutfitsGenerated = useCallback(
    (newOutfits: Outfit[], message: string) => {
      setOutfits(newOutfits);
      setActivePrompt(message);
      setIsLoading(false);
    },
    []
  );

  const handleRefresh = useCallback(async () => {
    setIsGenerating(true);
    try {
      const data = await recommenderService.generate({
        prompt: activePrompt || "refresh",
      });
      setOutfits(data);
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  }, [activePrompt]);

  const handleAction = useCallback(
    async (_outfitId: number, _action: AIAction) => {
      setIsGenerating(true);
      try {
        const data = await recommenderService.generate({ prompt: _action });
        setOutfits(data);
      } catch {
        // fallback
      } finally {
        setIsGenerating(false);
      }
    },
    []
  );

  const handleSave = useCallback(async (id: number) => {
    let nextSaved = false;
    setOutfits((prev) =>
      prev.map((o) => {
        if (o.id === id) {
          nextSaved = !o.userSaved;
          return { ...o, userSaved: nextSaved };
        }
        return o;
      })
    );
    try {
      await recommenderService.toggleSave(id, nextSaved);
    } catch {
      setOutfits((prev) =>
        prev.map((o) => (o.id === id ? { ...o, userSaved: !nextSaved } : o))
      );
    }
  }, []);

  const handleLike = useCallback((id: number, liked: boolean | null) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, userLiked: liked } : o))
    );
  }, []);

  const handleHide = useCallback((id: number) => {
    setOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, userHidden: true } : o))
    );
  }, []);

  const handleReport = useCallback(
    (id: number) => {
      const outfit = outfits.find((o) => o.id === id);
      alert(`Đã báo cáo: "${outfit?.title}". Cảm ơn bạn đã phản hồi.`);
    },
    [outfits]
  );

  const handleShare = useCallback((outfit: Outfit) => {
    if (navigator.share) {
      navigator.share({
        title: outfit.title,
        text: `${outfit.title} ${outfit.emoji}\n${outfit.aiComment}\n\nTổng: ${outfit.totalPrice}`,
      }).catch(() => {});
    }
  }, []);

  const filtered = outfits.filter((o) => {
    if (o.userHidden) return false;
    if (smartFilter === "trending" && !o.aiMatch) return false;
    if (smartFilter === "budget") {
      const priceNum = Number(o.totalPrice.replace(/[^0-9]/g, ""));
      if (priceNum > 0 && priceNum > 1000000) return false;
    }
    return true;
  });

  const isLoadingAny = isLoading || isGenerating;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16 flex min-h-screen">
        <ChatSidebar
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
          onOutfitsGenerated={handleOutfitsGenerated}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />

        <main className="flex-1 min-w-0 space-y-12 md:space-y-16">
          {/* HERO */}
          <section className="px-6 md:px-10 lg:px-14 pt-16 md:pt-20">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl"
            >
              <p className="text-[11px] uppercase tracking-[0.18em] font-body text-muted-foreground/70 mb-4">
                Outfit dành cho bạn
              </p>
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-tight leading-[1.02] mb-5">
                Hôm nay bạn mặc gì?
              </h1>
              <p className="text-base md:text-lg font-body text-muted-foreground leading-relaxed max-w-xl mb-10">
                Mô tả tâm trạng, dịp, hoặc phong cách. AI sẽ phối outfit hoàn chỉnh
                với sản phẩm thật từ Shopee, TikTok Shop.
              </p>

              {/* Prompt input */}
              <div className="relative max-w-2xl">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendPrompt(prompt)}
                  placeholder="VD: đi chơi tối cá tính, dưới 2 triệu"
                  className="w-full bg-card border border-border pl-5 pr-14 py-4 text-base font-body rounded-md focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  onClick={() => handleSendPrompt(prompt)}
                  disabled={!prompt.trim() || isGenerating}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-foreground text-background p-2.5 rounded-md active:scale-95 transition-all disabled:opacity-40"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Inline quick suggestions */}
              <div className="mt-6 flex flex-wrap items-center gap-y-2">
                <span className="text-xs font-body text-muted-foreground/60 mr-1">
                  Hoặc thử:
                </span>
                {QUICK_PROMPTS.map((p, i) => (
                  <span key={p.label} className="flex items-center">
                    <button
                      onClick={() => handleSendPrompt(p.prompt)}
                      disabled={isGenerating}
                      className="text-xs font-body text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                    >
                      {p.label}
                    </button>
                    {i < QUICK_PROMPTS.length - 1 && (
                      <span className="mx-2 text-border text-xs select-none">·</span>
                    )}
                  </span>
                ))}
              </div>
            </motion.div>
          </section>

          {/* RESULTS */}
          <section className="px-6 md:px-10 lg:px-14 pb-24">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-8 pb-5 border-b border-border">
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] font-body text-muted-foreground/70 mb-2">
                  Gợi ý hôm nay
                </p>
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground tracking-tight">
                  {activePrompt ? `Cho "${activePrompt}"` : "Dành cho bạn"}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide -mx-1 px-1">
                {SMART_FILTERS.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setSmartFilter(f.value)}
                    className={`text-xs font-body font-medium px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all shrink-0 ${
                      smartFilter === f.value
                        ? "bg-foreground text-background border-foreground"
                        : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
                <button
                  onClick={handleRefresh}
                  disabled={isGenerating}
                  className="ml-1 flex items-center gap-1.5 text-xs font-body text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 shrink-0"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                </button>
              </div>
            </div>

            {isLoadingAny && outfits.length === 0 ? (
              <div className="py-20 max-w-md">
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
                  className="text-sm font-body text-muted-foreground"
                >
                  {LOADING_STEPS[loadingStep]}
                </motion.p>
              </div>
            ) : loadError ? (
              <div className="border-l-2 border-destructive pl-4 py-3 text-sm text-destructive max-w-md">
                {loadError}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 max-w-xl">
                <p className="text-[10px] uppercase tracking-[0.18em] font-body text-muted-foreground/70 mb-3">
                  Bắt đầu
                </p>
                <h3 className="font-heading text-2xl md:text-3xl font-semibold text-foreground tracking-tight leading-[1.15] mb-3">
                  Chưa có outfit nào.
                </h3>
                <p className="text-sm font-body text-muted-foreground leading-relaxed mb-8">
                  Mô tả phong cách bạn muốn ở ô phía trên, hoặc chọn một gợi ý bên
                  dưới. AI sẽ phối đồ cho bạn trong vài giây.
                </p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PROMPTS.slice(0, 4).map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handleSendPrompt(p.prompt)}
                      className="text-xs font-body px-3.5 py-2 rounded-full border border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="mb-5">
                  <span className="text-[10px] uppercase tracking-[0.18em] font-body text-muted-foreground/70">
                    {filtered.length} outfit · Gợi ý từ AI
                  </span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-7">
                  {filtered.map((outfit, i) => (
                    <OutfitCard
                      key={outfit.id}
                      outfit={outfit}
                      index={i}
                      onSave={handleSave}
                      onLike={handleLike}
                      onHide={handleHide}
                      onReport={handleReport}
                      onAction={handleAction}
                      onShare={handleShare}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        </main>
      </div>

      {/* Floating chat button (desktop only, when chat is closed) */}
      <AnimatePresence>
        {!chatOpen && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            onClick={() => setChatOpen(true)}
            className="hidden md:flex fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-foreground text-background shadow-lg items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            aria-label="Mở chat AI"
          >
            <MessageCircle className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecommenderPage;

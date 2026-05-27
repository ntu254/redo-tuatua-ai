import {
  ChatSidebar,
  OutfitCard,
} from "@/features/recommender/components";
import { recommenderService } from "@/features/recommender/services/recommender.service";
import { Navbar } from "@/shared/layout";
import { motion } from "framer-motion";
import { RefreshCw, Send, Sparkles } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AIAction, Outfit } from "../types";

const LOADING_STEPS = [
  "Đang phân tích style của bạn...",
  "Kết hợp màu sắc...",
  "Xây dựng outfit...",
  "Tạo preview thử đồ...",
];

const QUICK_PROMPTS = [
  { label: "Hẹn hò tối nay", prompt: "Outfit đi hẹn hò lãng mạn" },
  { label: "Đi làm công sở", prompt: "Office look thanh lịch" },
  { label: "Cuối tuần casual", prompt: "Outfit cuối tuần thoải mái" },
  { label: "Dưới 1 triệu", prompt: "Outfit đẹp dưới 1 triệu" },
  { label: "Hàn Quốc", prompt: "Phong cách Hàn Quốc" },
  { label: "Streetwear", prompt: "Streetwear cá tính" },
];

const RecommenderPage = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [smartFilter, setSmartFilter] = useState("for_you");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [likedMap, setLikedMap] = useState<Record<number, boolean | null>>({});
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [bannerPrompt, setBannerPrompt] = useState("");
  const cancelledRef = useRef(false);

  useEffect(() => {
    if (!isLoading && !isGenerating) return;
    const interval = setInterval(() => {
      setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1200);
    return () => clearInterval(interval);
  }, [isLoading, isGenerating]);

  const loadOutfits = useCallback(async (prompt?: string) => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const data = prompt
        ? await recommenderService.generate({ prompt })
        : await recommenderService.listOutfits();
      if (cancelledRef.current) return;
      setOutfits(data);
    } catch (error) {
      if (cancelledRef.current) return;
      const message = error instanceof Error ? error.message : "Không thể tải gợi ý outfit.";
      setLoadError(message);
    } finally {
      if (!cancelledRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    void loadOutfits();
    return () => { cancelledRef.current = true; };
  }, [loadOutfits]);

  const handleSendPrompt = useCallback(async (prompt: string) => {
    setIsGenerating(true);
    setActivePrompt(prompt);
    setBannerPrompt("");
    try {
      const data = await recommenderService.generate({ prompt });
      setOutfits(data);
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  }, []);

  const handleBannerSend = useCallback(() => {
    if (!bannerPrompt.trim()) return;
    handleSendPrompt(bannerPrompt.trim());
  }, [bannerPrompt, handleSendPrompt]);

  const handleOutfitsGenerated = useCallback((newOutfits: Outfit[], message: string) => {
    setOutfits(newOutfits);
    setActivePrompt(message);
    setIsLoading(false);
  }, []);

  const handleRefresh = useCallback(async () => {
    setIsGenerating(true);
    try {
      const data = await recommenderService.generate({ prompt: activePrompt || "refresh" });
      setOutfits(data);
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  }, [activePrompt]);

  const handleAction = useCallback(async (_outfitId: number, _action: AIAction) => {
    setIsGenerating(true);
    try {
      const data = await recommenderService.generate({ prompt: _action });
      setOutfits(data);
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  }, []);

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
    setLikedMap((prev) => ({ ...prev, [id]: liked }));
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, userLiked: liked } : o));
  }, []);

  const handleHide = useCallback((id: number) => {
    setHiddenIds((prev) => [...prev, id]);
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, userHidden: true } : o));
  }, []);

  const handleReport = useCallback((id: number) => {
    const outfit = outfits.find((o) => o.id === id);
    alert(`Đã báo cáo: "${outfit?.title}" — Cảm ơn bạn!`);
  }, [outfits]);

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
    <div className="min-h-screen bg-gradient-to-b from-background via-secondary/20 to-background">
      <Navbar />
      <div className="pt-16 flex h-screen">
        <ChatSidebar
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
          onOutfitsGenerated={handleOutfitsGenerated}
          isGenerating={isGenerating}
          setIsGenerating={setIsGenerating}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          {/* Top banner */}
          <div className="bg-background/80 backdrop-blur-xl border-b border-border/40 sticky top-0 z-20">
            <div className="px-4 md:px-8 pt-4 pb-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-teal flex items-center justify-center shadow-sm">
                    <Sparkles className="w-4 h-4 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-heading text-lg font-semibold text-foreground leading-tight">
                      AI Stylist
                    </h2>
                    <p className="text-[11px] text-muted-foreground font-body">
                      {activePrompt ? `"${activePrompt}"` : "Outfit cá nhân hóa từ AI"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 text-xs font-body text-accent hover:text-accent/80 disabled:opacity-40 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Làm mới
                </button>
              </div>

              {/* Prompt input */}
              <div className="relative mt-1">
                <input
                  type="text"
                  value={bannerPrompt}
                  onChange={(e) => setBannerPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleBannerSend()}
                  placeholder="Bạn muốn mặc gì hôm nay?..."
                  className="w-full bg-secondary/40 border border-border/60 pl-4 pr-12 py-2.5 text-sm font-body rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all placeholder:text-muted-foreground/50"
                />
                <button
                  onClick={handleBannerSend}
                  disabled={!bannerPrompt.trim() || isGenerating}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-2 rounded-lg hover:shadow-sm active:scale-95 transition-all disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Quick prompts */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide mt-2.5 pb-0.5">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p.label}
                    onClick={() => handleSendPrompt(p.prompt)}
                    disabled={isGenerating}
                    className="text-[11px] font-body px-3 py-1.5 rounded-full border border-border/50 bg-background/40 text-muted-foreground hover:border-accent/30 hover:text-accent hover:bg-accent/5 whitespace-nowrap transition-all shrink-0 disabled:opacity-40"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Filters */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide px-4 md:px-8 pb-3">
              {[
                { value: "for_you", label: "For You", icon: "✨" },
                { value: "trending", label: "Trending", icon: "📈" },
                { value: "wardrobe", label: "Tủ đồ", icon: "👔" },
                { value: "recent", label: "Gần đây", icon: "🕐" },
                { value: "budget", label: "Tiết kiệm", icon: "💰" },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => setSmartFilter(f.value)}
                  className={`text-xs font-body font-medium px-3.5 py-1.5 rounded-full border whitespace-nowrap transition-all shrink-0 ${
                    smartFilter === f.value
                      ? "bg-accent text-accent-foreground border-accent shadow-sm"
                      : "border-border/60 text-muted-foreground hover:border-accent/30 hover:text-accent bg-background/40"
                  }`}
                >
                  {f.icon} {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 md:p-6 xl:px-8">
              {isLoadingAny && outfits.length === 0 ? (
                <div className="rounded-2xl border border-border/60 bg-card/60 p-12 text-center shadow-sm backdrop-blur-sm">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <motion.p
                    key={loadingStep}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm font-body text-muted-foreground"
                  >
                    {LOADING_STEPS[loadingStep]}
                  </motion.p>
                </div>
              ) : loadError ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive shadow-sm">
                  {loadError}
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-teal/10 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-accent" strokeWidth={1.5} />
                    </div>
                  </div>
                  <p className="font-heading text-xl font-semibold text-foreground mb-2">
                    Chưa có outfit nào
                  </p>
                  <p className="text-sm font-body text-muted-foreground max-w-sm">
                    Mô tả phong cách bạn muốn ở ô bên trên, AI sẽ gợi ý ngay cho bạn!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span className="text-xs font-body text-muted-foreground">
                      {filtered.length} outfit · Gợi ý từ AI
                    </span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 xl:gap-6">
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommenderPage;

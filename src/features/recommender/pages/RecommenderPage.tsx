import {
  ChatSidebar,
  OutfitCard,
  OutfitHeader,
} from "@/features/recommender/components";
import { recommenderService } from "@/features/recommender/services/recommender.service";
import { Navbar } from "@/shared/layout";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AIAction, Outfit } from "../types";

const LOADING_STEPS = ["Analyzing your style...", "Matching colors...", "Building your outfit...", "Generating try-on preview..."];

const RecommenderPage = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [smartFilter, setSmartFilter] = useState("for_you");
  const [activeFilter, setActiveFilter] = useState("all");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [likedMap, setLikedMap] = useState<Record<number, boolean | null>>({});
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const [loadingStep, setLoadingStep] = useState(0);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const cancelledRef = useRef(false);

  // Animated loading steps
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
    try {
      const data = await recommenderService.generate({ prompt });
      setOutfits(data);
    } catch {
      // fallback
    } finally {
      setIsGenerating(false);
    }
  }, []);

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

  const handleSave = useCallback((id: number) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, userSaved: !o.userSaved } : o));
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
    alert(`Báo cáo đã gửi: "${outfit?.title}" — Cảm ơn bạn đã giúp cải thiện! 🙏`);
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
    if (activeFilter !== "all" && !o.styleTags.includes(activeFilter)) return false;
    if (o.userHidden) return false;
    return true;
  });

  const isLoadingAny = isLoading || isGenerating;

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.5)_0%,transparent_32%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--off-white))_100%)]">
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
          {/* Smart Filters */}
          <div className="bg-background/76 backdrop-blur-xl sticky top-0 z-20">
            <div className="px-8 pt-5 pb-2">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-[24px] md:text-[28px] font-semibold text-foreground leading-tight">
                    {activePrompt ? "AI Gợi ý" : "AI Stylist"}
                  </h2>
                  <span className="text-xl">✨</span>
                </div>
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className="md:hidden text-sm font-body text-accent"
                >
                  Filters
                </button>
              </div>
              <p className="text-[13px] font-body text-muted-foreground mb-4">
                {activePrompt
                  ? `Kết quả cho: "${activePrompt}"`
                  : "Outfit cá nhân hóa từ AI stylist của bạn — dựa trên style, tủ đồ và sở thích"}
              </p>

              {/* Smart Filters Row */}
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
                {["for_you", "trending", "wardrobe", "recent", "budget"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setSmartFilter(f)}
                    className={`text-[11px] md:text-[12px] font-body font-medium px-3 py-1.5 rounded-full border transition-all whitespace-nowrap ${
                      smartFilter === f
                        ? "bg-accent text-accent-foreground border-accent shadow-sm"
                        : "border-border text-foreground/60 hover:border-accent/20 hover:text-accent"
                    }`}
                  >
                    {f === "for_you" && "✨ For You"}
                    {f === "trending" && "📈 Trending"}
                    {f === "wardrobe" && "👔 Your Wardrobe"}
                    {f === "recent" && "🕐 Recent"}
                    {f === "budget" && "💰 Budget Friendly"}
                  </button>
                ))}
              </div>
            </div>

            <OutfitHeader
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              onRefresh={handleRefresh}
              isGenerating={isGenerating}
              outfitCount={filtered.length}
              activePrompt={activePrompt}
            />
          </div>

          <div className="flex-1 overflow-y-auto pb-20 md:pb-0">
            <div className="p-6 md:p-8 xl:px-10">
              {isLoadingAny && outfits.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2.5 h-2.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
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
                <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-lg font-heading font-semibold text-foreground mb-2">
                    Upload your first clothing item
                  </p>
                  <p className="text-sm font-body text-muted-foreground max-w-sm mx-auto">
                    Let AI build outfits for you based on your wardrobe, style, and preferences ✨
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                    <span className="text-[11px] font-body text-muted-foreground">
                      {filtered.length} outfit{filtered.length > 1 ? "s" : ""} · AI-generated for you
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 xl:gap-7">
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

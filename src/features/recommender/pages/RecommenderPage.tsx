import {
  ChatSidebar,
  OutfitCard,
  OutfitHeader,
} from "@/features/recommender/components";
import { recommenderService } from "@/features/recommender/services/recommender.service";
import { Navbar } from "@/shared/layout";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Outfit } from "../types";

const RecommenderPage = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activePrompt, setActivePrompt] = useState("");
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [likedMap, setLikedMap] = useState<Record<number, boolean | null>>({});
  const [hiddenIds, setHiddenIds] = useState<number[]>([]);
  const cancelledRef = useRef(false);

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
      const message =
        error instanceof Error
          ? error.message
          : "Không thể tải gợi ý outfit.";
      setLoadError(message);
    } finally {
      if (!cancelledRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    void loadOutfits();
    return () => {
      cancelledRef.current = true;
    };
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

  const handleSave = useCallback((id: number) => {
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    setOutfits((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, userSaved: !o.userSaved } : o
      )
    );
  }, []);

  const handleLike = useCallback((id: number, liked: boolean | null) => {
    setLikedMap((prev) => ({ ...prev, [id]: liked }));
    setOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, userLiked: liked } : o))
    );
  }, []);

  const handleHide = useCallback((id: number) => {
    setHiddenIds((prev) => [...prev, id]);
    setOutfits((prev) =>
      prev.map((o) => (o.id === id ? { ...o, userHidden: true } : o))
    );
  }, []);

  const handleReport = useCallback((id: number) => {
    const outfit = outfits.find((o) => o.id === id);
    const title = outfit?.title || "";
    alert(`Báo cáo đã gửi: "${title}" — Cảm ơn bạn đã giúp cải thiện chất lượng gợi ý! 🙏`);
  }, [outfits]);

  const filtered = outfits.filter((o) => {
    if (activeFilter !== "all" && !o.styleTags.includes(activeFilter)) return false;
    if (o.userHidden) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.5)_0%,transparent_32%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--off-white))_100%)]">
      <Navbar />
      <div className="pt-16 flex h-screen">
        <ChatSidebar
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
          onSendPrompt={handleSendPrompt}
          isGenerating={isGenerating}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <OutfitHeader
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            onRefresh={handleRefresh}
            isGenerating={isGenerating}
            outfitCount={filtered.length}
            activePrompt={activePrompt}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="p-8 xl:px-10">
              {isLoading ? (
                <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                  <p className="mt-3">Đang tải gợi ý outfit...</p>
                </div>
              ) : loadError ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive shadow-sm">
                  {loadError}
                </div>
              ) : filtered.length === 0 ? (
                <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-sm">
                  <p className="text-lg mb-2">🧐</p>
                  <p className="text-sm font-body text-muted-foreground">
                    Không tìm thấy outfit phù hợp.
                  </p>
                  <p className="text-xs font-body text-muted-foreground mt-1">
                    Thử thay đổi bộ lọc hoặc nhập mô tả khác bên chat nhé!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-7">
                  {filtered.map((outfit, i) => (
                    <OutfitCard
                      key={outfit.id}
                      outfit={outfit}
                      index={i}
                      onSave={handleSave}
                      onLike={handleLike}
                      onHide={handleHide}
                      onReport={handleReport}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommenderPage;

import {
  ChatSidebar,
  OutfitCard,
  OutfitHeader,
} from "@/features/recommender/components";
import { recommenderService } from "@/features/recommender/services/recommender.service";
import { Navbar } from "@/shared/layout";
import { useEffect, useState } from "react";
import type { Outfit } from "../types";

const RecommenderPage = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tất cả");
  const [outfits, setOutfits] = useState<Outfit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOutfits = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        const data = await recommenderService.listOutfits();

        if (cancelled) return;

        setOutfits(data);
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error
            ? error.message
            : "Không thể tải gợi ý outfit.";
        setLoadError(message);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadOutfits();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.5)_0%,transparent_32%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--off-white))_100%)]">
      <Navbar />
      <div className="pt-16 flex h-screen">
        <ChatSidebar
          isOpen={chatOpen}
          onToggle={() => setChatOpen(!chatOpen)}
        />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <OutfitHeader
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          <div className="flex-1 overflow-y-auto">
            <div className="p-8 xl:px-10">
              {isLoading ? (
                <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
                  Đang tải mock recommender API...
                </div>
              ) : loadError ? (
                <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive shadow-sm">
                  {loadError}
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-7">
                  {outfits.map((outfit, i) => (
                    <OutfitCard key={outfit.id} outfit={outfit} index={i} />
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

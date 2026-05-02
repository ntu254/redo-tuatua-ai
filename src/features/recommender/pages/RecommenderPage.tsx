import {
  ChatSidebar,
  OutfitCard,
  OutfitHeader,
} from "@/features/recommender/components";
import { sampleOutfits } from "@/features/recommender/data";
import { Navbar } from "@/shared/layout";
import { useState } from "react";

const RecommenderPage = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tất cả");

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
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-7">
                {sampleOutfits.map((outfit, i) => (
                  <OutfitCard key={outfit.id} outfit={outfit} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommenderPage;

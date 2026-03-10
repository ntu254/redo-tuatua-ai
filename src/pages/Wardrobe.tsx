import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/landing/Navbar";
import WardrobeHeader from "@/components/wardrobe/WardrobeHeader";
import WardrobeFilters from "@/components/wardrobe/WardrobeFilters";
import WardrobeUploadArea from "@/components/wardrobe/WardrobeUploadArea";
import WardrobeItemCard, { type WardrobeItem } from "@/components/wardrobe/WardrobeItemCard";
import AIOutfitGenerator from "@/components/wardrobe/AIOutfitGenerator";
import WardrobeEmptyState from "@/components/wardrobe/WardrobeEmptyState";

const wardrobeItems: WardrobeItem[] = [
  { id: 1, name: "Áo thun trắng basic", category: "Tops", color: "#FFFFFF", tags: ["Casual", "Minimal"] },
  { id: 2, name: "Quần jeans xanh đậm", category: "Bottoms", color: "#1C3A5F", tags: ["Casual", "Streetwear"] },
  { id: 3, name: "Áo sơ mi lụa hồng", category: "Tops", color: "#F4A0A0", tags: ["Office"] },
  { id: 4, name: "Quần âu đen", category: "Bottoms", color: "#1A1A1A", tags: ["Office", "Minimal"] },
  { id: 5, name: "Giày sneaker trắng", category: "Shoes", color: "#F5F5F5", tags: ["Casual", "Sporty"] },
  { id: 6, name: "Túi tote canvas", category: "Accessories", color: "#D2B48C", tags: ["Casual"] },
  { id: 7, name: "Áo hoodie xám", category: "Tops", color: "#808080", tags: ["Streetwear", "Casual"] },
  { id: 8, name: "Váy midi hoa", category: "Bottoms", color: "#FFB6C1", tags: ["Party"] },
  { id: 9, name: "Áo khoác denim", category: "Outerwear", color: "#5B7FAF", tags: ["Streetwear", "Casual"] },
  { id: 10, name: "Sandal quai ngang", category: "Shoes", color: "#C4A882", tags: ["Casual", "Minimal"] },
  { id: 11, name: "Kính mát tròn", category: "Accessories", color: "#2C2C2C", tags: ["Streetwear"] },
  { id: 12, name: "Áo blazer đen", category: "Outerwear", color: "#1A1A1A", tags: ["Office", "Minimal"] },
];

const Wardrobe = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? wardrobeItems
        : wardrobeItems.filter((item) => item.category === activeFilter),
    [activeFilter]
  );

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const isEmpty = wardrobeItems.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <WardrobeHeader
        itemCount={wardrobeItems.length}
        savedOutfits={5}
        aiSuggestions={18}
      />

      <div className="container mx-auto max-w-6xl px-6 pb-20">
        {isEmpty ? (
          <WardrobeEmptyState />
        ) : (
          <div className="space-y-6">
            {/* Action row: Upload + AI Generator side by side */}
            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
              <WardrobeUploadArea />
              <AIOutfitGenerator items={wardrobeItems} selectedIds={selectedIds} />
            </div>

            {/* Filter bar + selection info */}
            <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
              <WardrobeFilters active={activeFilter} onChange={setActiveFilter} />
              <AnimatePresence>
                {selectedIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-xs font-body text-accent font-medium">
                      {selectedIds.length} selected
                    </span>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="text-[10px] font-body text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                    >
                      Clear
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wardrobe grid */}
            <motion.div
              layout
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((item, i) => (
                  <WardrobeItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    selected={selectedIds.includes(item.id)}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wardrobe;

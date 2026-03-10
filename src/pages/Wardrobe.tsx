import { useState, useMemo } from "react";
import { motion } from "framer-motion";
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

const categoryMap: Record<string, string> = {
  All: "All",
  Tops: "Tops",
  Bottoms: "Bottoms",
  Shoes: "Shoes",
  Outerwear: "Outerwear",
  Accessories: "Accessories",
};

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
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
            {/* Left — main content */}
            <div className="space-y-6">
              <WardrobeUploadArea />

              <div className="flex items-center justify-between gap-4 flex-wrap">
                <WardrobeFilters active={activeFilter} onChange={setActiveFilter} />
                {selectedIds.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-body text-accent font-medium"
                  >
                    {selectedIds.length} selected — use AI panel to create outfit →
                  </motion.p>
                )}
              </div>

              {/* Grid */}
              <motion.div
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filtered.map((item, i) => (
                  <WardrobeItemCard
                    key={item.id}
                    item={item}
                    index={i}
                    selected={selectedIds.includes(item.id)}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </motion.div>
            </div>

            {/* Right sidebar — AI panel */}
            <div className="space-y-4">
              <div className="sticky top-20">
                <AIOutfitGenerator items={wardrobeItems} selectedIds={selectedIds} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wardrobe;

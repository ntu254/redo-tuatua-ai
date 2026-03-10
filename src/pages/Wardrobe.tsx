import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import WardrobeHeader from "@/components/wardrobe/WardrobeHeader";
import WardrobeFilterSidebar, { type ActiveFilters } from "@/components/wardrobe/WardrobeFilterSidebar";
import WardrobeItemCard, { type WardrobeItem } from "@/components/wardrobe/WardrobeItemCard";
import AIOutfitGenerator from "@/components/wardrobe/AIOutfitGenerator";
import WardrobeEmptyState from "@/components/wardrobe/WardrobeEmptyState";
import WardrobeUploadModal from "@/components/wardrobe/WardrobeUploadModal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
  const [filters, setFilters] = useState<ActiveFilters>({
    category: [],
    style: [],
    color: [],
    season: [],
  });
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const filtered = useMemo(() => {
    let items = wardrobeItems;

    if (filters.category.length > 0) {
      items = items.filter((item) => filters.category.includes(item.category));
    }
    if (filters.style.length > 0) {
      items = items.filter((item) =>
        item.tags.some((tag) => filters.style.includes(tag))
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return items;
  }, [filters, search]);

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
        onAddClick={() => setUploadOpen(true)}
      />

      <div className="container mx-auto max-w-7xl px-6 pb-20">
        {isEmpty ? (
          <WardrobeEmptyState />
        ) : (
          <div className="flex gap-6">
            {/* Left Sidebar — AI Generator on top, then Filters */}
            <div className="hidden lg:flex lg:flex-col w-[250px] shrink-0 gap-4">
              <AIOutfitGenerator items={wardrobeItems} selectedIds={selectedIds} />
              <WardrobeFilterSidebar filters={filters} onChange={setFilters} />
            </div>

            {/* Main Content */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Search bar + Add button */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search clothing..."
                    className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-card text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <Button
                  variant="accent"
                  size="sm"
                  className="gap-1.5 rounded-xl h-10 px-4 shrink-0"
                  onClick={() => setUploadOpen(true)}
                >
                  <Plus className="w-4 h-4" /> Add Item
                </Button>
              </div>

              {/* Selection info */}
              <AnimatePresence>
                {selectedIds.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    className="flex items-center gap-3 px-4 py-2 rounded-xl bg-accent/5 border border-accent/15"
                  >
                    <span className="text-xs font-body text-accent font-medium">
                      {selectedIds.length} item{selectedIds.length > 1 ? "s" : ""} selected
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

              {/* Results count */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-body text-muted-foreground">
                  {filtered.length} item{filtered.length !== 1 ? "s" : ""}
                  {(filters.category.length > 0 || filters.style.length > 0 || search) && " found"}
                </p>
              </div>

              {/* Wardrobe grid */}
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
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

              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <p className="text-sm text-muted-foreground font-body">
                    No items match your filters.
                  </p>
                  <button
                    onClick={() => {
                      setFilters({ category: [], style: [], color: [], season: [] });
                      setSearch("");
                    }}
                    className="text-xs text-accent font-body mt-2 underline underline-offset-2 hover:text-accent/80 transition-colors"
                  >
                    Clear all filters
                  </button>
                </motion.div>
              )}

              {/* Mobile AI Generator */}
              <div className="lg:hidden">
                <AIOutfitGenerator items={wardrobeItems} selectedIds={selectedIds} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal with AI Detection */}
      <WardrobeUploadModal open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
};

export default Wardrobe;

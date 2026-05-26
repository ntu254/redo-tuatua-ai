import {
  AIOutfitGenerator,
  WardrobeAnalysis,
  WardrobeDeleteConfirm,
  WardrobeEditModal,
  WardrobeEmptyState,
  WardrobeFilterSidebar,
  WardrobeHeader,
  WardrobeItemCard,
  WardrobeUploadModal,
} from "@/features/wardrobe/components";
import {
  defaultWardrobeFilters,
  useWardrobeFilters,
} from "@/features/wardrobe/hooks/useWardrobeFilters";
import type { WardrobeOverview } from "@/features/wardrobe/services/wardrobe.service";
import { wardrobeService } from "@/features/wardrobe/services/wardrobe.service";
import type { ActiveFilters, WardrobeAnalysis as WardrobeAnalysisType, WardrobeItem } from "@/features/wardrobe/types";
import { Navbar } from "@/shared/layout";
import { Button } from "@/shared/ui";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Plus, Search, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const WardrobePage = () => {
  const [filters, setFilters] = useState<ActiveFilters>(defaultWardrobeFilters);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [summary, setSummary] = useState<WardrobeOverview>({
    itemCount: 0,
    savedOutfits: 0,
    aiSuggestions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analysis, setAnalysis] = useState<WardrobeAnalysisType | null>(null);
  const [analysisLoading, setAnalysisLoading] = useState(false);

  // Edit/delete state
  const [editItem, setEditItem] = useState<WardrobeItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<WardrobeItem | null>(null);

  const cancelledRef = useRef(false);

  const loadWardrobe = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const [itemsData, summaryData] = await Promise.all([
        wardrobeService.listItems(),
        wardrobeService.getOverview(),
      ]);
      if (cancelledRef.current) return;
      setItems(itemsData);
      setSummary(summaryData);
    } catch (error) {
      if (cancelledRef.current) return;
      const message = error instanceof Error ? error.message : "Không thể tải dữ liệu tủ đồ.";
      setLoadError(message);
    } finally {
      if (!cancelledRef.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cancelledRef.current = false;
    void loadWardrobe();
    return () => { cancelledRef.current = true; };
  }, [loadWardrobe]);

  const filtered = useWardrobeFilters({ items, filters, search });

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleEdit = useCallback((item: WardrobeItem) => {
    setEditItem(item);
  }, []);

  const handleEditSave = useCallback(async (updated: WardrobeItem) => {
    try {
      await wardrobeService.updateItem(updated.id, {
        name: updated.name,
        category: updated.category,
        color: updated.color,
        tags: updated.tags,
        season: updated.season,
      });
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    } catch {
      // fallback: update locally anyway
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
    }
  }, []);

  const handleDelete = useCallback((item: WardrobeItem) => {
    setDeleteItem(item);
  }, []);

  const handleDeleteConfirm = useCallback(async (id: number) => {
    try {
      await wardrobeService.deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSummary((prev) => ({ ...prev, itemCount: prev.itemCount - 1 }));
      setSelectedIds((prev) => prev.filter((x) => x !== id));
    } catch {
      // fallback
      setItems((prev) => prev.filter((i) => i.id !== id));
      setSummary((prev) => ({ ...prev, itemCount: prev.itemCount - 1 }));
    }
  }, []);

  const handleSuggestOutfit = useCallback((item: WardrobeItem) => {
    setSelectedIds([item.id]);
    setSearch("");
    setFilters(defaultWardrobeFilters);
  }, []);

  const handleToggleAnalysis = useCallback(async () => {
    if (showAnalysis) {
      setShowAnalysis(false);
      return;
    }
    setAnalysisLoading(true);
    try {
      const data = await wardrobeService.getAnalysis();
      setAnalysis(data);
      setShowAnalysis(true);
    } catch {
      // fallback
    } finally {
      setAnalysisLoading(false);
    }
  }, [showAnalysis]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm">
            Đang tải mock wardrobe API...
          </div>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto max-w-7xl px-6 py-20">
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center text-sm text-destructive shadow-sm">
            {loadError}
          </div>
        </div>
      </div>
    );
  }

  const isEmpty = items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <WardrobeHeader
        itemCount={summary.itemCount}
        savedOutfits={summary.savedOutfits}
        aiSuggestions={summary.aiSuggestions}
        onAddClick={() => setUploadOpen(true)}
      />

      <div className="container mx-auto max-w-7xl px-6 pb-20">
        {isEmpty ? (
          <WardrobeEmptyState />
        ) : (
          <div className="flex gap-6">
            <div className="hidden sm:flex sm:flex-col sm:w-[190px] md:w-[220px] lg:w-[250px] shrink-0 gap-4">
              <AIOutfitGenerator items={items} selectedIds={selectedIds} />
              <WardrobeFilterSidebar filters={filters} onChange={setFilters} />
            </div>

            <div className="flex-1 min-w-0 space-y-4">
              {/* Search + actions */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40" strokeWidth={1.5} />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Tìm kiếm quần áo..."
                    className="w-full h-10 pl-10 pr-9 rounded-xl border border-border bg-card text-sm font-body text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-xl h-10 px-3 shrink-0"
                  onClick={handleToggleAnalysis}
                >
                  <BarChart3 className="w-4 h-4" /> {showAnalysis ? "Ẩn phân tích" : "Phân tích"}
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  className="gap-1.5 rounded-xl h-10 px-4 shrink-0"
                  onClick={() => setUploadOpen(true)}
                >
                  <Plus className="w-4 h-4" /> Thêm món đồ
                </Button>
              </div>

              {/* Mobile: AI Gen + Filters */}
              <div className="space-y-4 sm:hidden">
                <AIOutfitGenerator items={items} selectedIds={selectedIds} />
                <WardrobeFilterSidebar filters={filters} onChange={setFilters} />
              </div>

              {/* Analysis Section */}
              <AnimatePresence>
                {showAnalysis && analysis && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <WardrobeAnalysis analysis={analysis} />
                  </motion.div>
                )}
              </AnimatePresence>

              {analysisLoading && (
                <div className="rounded-xl border border-border bg-card p-6 text-center text-xs text-muted-foreground">
                  Đang phân tích tủ đồ...
                </div>
              )}

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
                      {selectedIds.length} món đồ đã chọn
                    </span>
                    <button
                      onClick={() => setSelectedIds([])}
                      className="text-[10px] font-body text-muted-foreground hover:text-foreground underline underline-offset-2 transition-colors"
                    >
                      Bỏ chọn
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-between">
                <p className="text-xs font-body text-muted-foreground">
                  {filtered.length} món đồ
                  {(filters.category.length > 0 || filters.style.length > 0 || search) && " được tìm thấy"}
                </p>
              </div>

              {/* Wardrobe grid */}
              <motion.div layout className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((item, i) => (
                    <WardrobeItemCard
                      key={item.id}
                      item={item}
                      index={i}
                      selected={selectedIds.includes(item.id)}
                      onToggleSelect={toggleSelect}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onSuggestOutfit={handleSuggestOutfit}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>

              {filtered.length === 0 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
                  <p className="text-sm text-muted-foreground font-body">
                    Không tìm thấy món đồ nào phù hợp.
                  </p>
                  <button
                    onClick={() => { setFilters({ category: [], style: [], color: [], season: [] }); setSearch(""); }}
                    className="text-xs text-accent font-body mt-2 underline underline-offset-2 hover:text-accent/80 transition-colors"
                  >
                    Xóa tất cả bộ lọc
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <WardrobeUploadModal open={uploadOpen} onClose={() => { setUploadOpen(false); void loadWardrobe(); }} />
      <WardrobeEditModal item={editItem} open={!!editItem} onClose={() => setEditItem(null)} onSave={handleEditSave} />
      <WardrobeDeleteConfirm item={deleteItem} open={!!deleteItem} onClose={() => setDeleteItem(null)} onConfirm={handleDeleteConfirm} />
    </div>
  );
};

export default WardrobePage;

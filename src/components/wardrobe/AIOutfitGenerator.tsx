import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shirt, ChevronRight, RefreshCw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WardrobeItem } from "./WardrobeItemCard";

interface AIOutfitGeneratorProps {
  items: WardrobeItem[];
  selectedIds: number[];
}

const mockOutfit = [
  { role: "Áo", name: "Áo thun trắng basic", color: "#FFFFFF" },
  { role: "Quần", name: "Quần jeans xanh đậm", color: "#1C3A5F" },
  { role: "Giày", name: "Giày sneaker trắng", color: "#F5F5F5" },
];

const AIOutfitGenerator = ({ items, selectedIds }: AIOutfitGeneratorProps) => {
  const [generated, setGenerated] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleGenerate = () => {
    setSpinning(true);
    setTimeout(() => { setGenerated(true); setSpinning(false); }, 1200);
  };

  const handleRegenerate = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
      className="relative overflow-hidden rounded-xl border border-teal/20 bg-gradient-to-br from-teal-light via-card to-card p-4 shadow-sm">
      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-teal/8 blur-2xl pointer-events-none" />

      <div className="relative">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-teal/15 flex items-center justify-center shrink-0">
            <Wand2 className="w-4.5 h-4.5 text-teal" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-semibold text-foreground">AI tạo outfit</p>
            <p className="text-[11px] text-muted-foreground font-body leading-snug mt-0.5">
              {selectedIds.length > 0
                ? `${selectedIds.length} món đồ đã chọn — AI sẽ phối quanh chúng`
                : "Tạo bộ outfit từ tủ đồ của bạn"}
            </p>
          </div>
        </div>

        {!generated ? (
          <Button variant="teal" className="w-full gap-2 rounded-xl shadow-sm" onClick={handleGenerate} disabled={spinning}>
            {spinning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {selectedIds.length > 0 ? "Tạo từ đã chọn" : "Tạo outfit"}
          </Button>
        ) : (
          <AnimatePresence>
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
              <p className="editorial-label">Gợi ý từ AI</p>
              <div className="space-y-1.5">
                {mockOutfit.map((piece, i) => (
                  <motion.div key={piece.role} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-background/70 border border-border/50">
                    <div className="w-8 h-8 rounded-md bg-secondary flex items-center justify-center">
                      <Shirt className="w-3.5 h-3.5 text-muted-foreground/25" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-body font-medium text-foreground truncate">{piece.name}</p>
                      <p className="text-[9px] text-muted-foreground font-body uppercase tracking-wider">{piece.role}</p>
                    </div>
                    <span className="w-3.5 h-3.5 rounded-full border border-border shrink-0" style={{ backgroundColor: piece.color }} />
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <Button variant="outline" size="sm" className="flex-1 rounded-xl gap-1 text-[11px] h-8" onClick={handleRegenerate}>
                  <RefreshCw className={`w-3 h-3 ${spinning ? "animate-spin" : ""}`} /> Tạo lại
                </Button>
                <Button variant="teal" size="sm" className="flex-1 rounded-xl gap-1 text-[11px] h-8">
                  Lưu <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  );
};

export default AIOutfitGenerator;

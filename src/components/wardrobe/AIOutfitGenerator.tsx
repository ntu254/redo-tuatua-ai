import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Shirt, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { WardrobeItem } from "./WardrobeItemCard";

interface AIOutfitGeneratorProps {
  items: WardrobeItem[];
  selectedIds: number[];
}

const mockOutfit = [
  { role: "Top", name: "Áo thun trắng basic", color: "#FFFFFF" },
  { role: "Bottom", name: "Quần jeans xanh đậm", color: "#1C3A5F" },
  { role: "Shoes", name: "Giày sneaker trắng", color: "#F5F5F5" },
];

const AIOutfitGenerator = ({ items, selectedIds }: AIOutfitGeneratorProps) => {
  const [generated, setGenerated] = useState(false);
  const [spinning, setSpinning] = useState(false);

  const handleGenerate = () => {
    setSpinning(true);
    setTimeout(() => {
      setGenerated(true);
      setSpinning(false);
    }, 1200);
  };

  const handleRegenerate = () => {
    setSpinning(true);
    setTimeout(() => setSpinning(false), 800);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-accent" />
        </div>
        <div>
          <p className="text-sm font-body font-semibold text-foreground">AI Outfit Generator</p>
          <p className="text-[10px] text-muted-foreground font-body">
            {selectedIds.length > 0
              ? `${selectedIds.length} items selected — AI will build around them`
              : "Generate outfits from your wardrobe"}
          </p>
        </div>
      </div>

      {!generated ? (
        <Button
          variant="accent"
          className="w-full gap-2 rounded-xl"
          onClick={handleGenerate}
          disabled={spinning}
        >
          {spinning ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {selectedIds.length > 0 ? "Create Outfit From Selected" : "Generate Outfit From My Wardrobe"}
        </Button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <p className="editorial-label">AI Suggestion</p>
            <div className="space-y-2">
              {mockOutfit.map((piece, i) => (
                <motion.div
                  key={piece.role}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-secondary/60"
                >
                  <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center border border-border">
                    <Shirt className="w-4 h-4 text-muted-foreground/30" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body font-medium text-foreground truncate">{piece.name}</p>
                    <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{piece.role}</p>
                  </div>
                  <span className="w-4 h-4 rounded-full border border-border shrink-0" style={{ backgroundColor: piece.color }} />
                </motion.div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" className="flex-1 rounded-xl gap-1.5 text-xs" onClick={handleRegenerate}>
                <RefreshCw className={`w-3 h-3 ${spinning ? "animate-spin" : ""}`} /> Regenerate
              </Button>
              <Button variant="accent" size="sm" className="flex-1 rounded-xl gap-1.5 text-xs">
                Save Outfit <ChevronRight className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

export default AIOutfitGenerator;

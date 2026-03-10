import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, ShoppingBag, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const WardrobeUploadArea = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const secondaryOptions = [
    { icon: Upload, label: "Upload photo" },
    { icon: Camera, label: "Take photo" },
    { icon: ShoppingBag, label: "Import from shopping" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button
          variant="accent"
          size="default"
          className="gap-2 rounded-xl"
          onClick={() => setShowOptions(!showOptions)}
        >
          <Plus className="w-4 h-4" /> Add Clothing Item
        </Button>

        {showOptions && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-2"
          >
            {secondaryOptions.map((opt) => (
              <button
                key={opt.label}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-secondary text-xs font-body text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
              >
                <opt.icon className="w-3.5 h-3.5" />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}
      </div>

      {/* Drag & drop area */}
      <motion.div
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(e) => e.preventDefault()}
        onDrop={() => setIsDragging(false)}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
          isDragging
            ? "border-accent bg-accent/5 scale-[1.01]"
            : "border-border hover:border-muted-foreground/30"
        }`}
      >
        <Upload className="w-8 h-8 text-muted-foreground/30 mb-3" strokeWidth={1.5} />
        <p className="text-sm text-muted-foreground font-body text-center">
          Drag and drop clothing images to add to your wardrobe
        </p>
        <p className="text-[10px] text-muted-foreground/60 font-body mt-1">PNG, JPG up to 10MB</p>
      </motion.div>
    </div>
  );
};

export default WardrobeUploadArea;

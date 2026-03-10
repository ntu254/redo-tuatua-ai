import { motion } from "framer-motion";
import { Shirt, Heart, Sparkles } from "lucide-react";

interface WardrobeHeaderProps {
  itemCount: number;
  savedOutfits: number;
  aiSuggestions: number;
}

const WardrobeHeader = ({ itemCount, savedOutfits, aiSuggestions }: WardrobeHeaderProps) => {
  const stats = [
    { icon: Shirt, value: itemCount, label: "Items", color: "text-accent" },
    { icon: Heart, value: savedOutfits, label: "Saved Outfits", color: "text-teal" },
    { icon: Sparkles, value: aiSuggestions, label: "AI Suggestions", color: "text-accent" },
  ];

  return (
    <div className="px-6 pt-24 pb-10">
      <div className="container mx-auto max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="editorial-label mb-3">AI-Powered Closet</p>
          <h1 className="font-heading text-5xl md:text-6xl font-light text-foreground mb-2">
            My <span className="italic">Wardrobe</span>
          </h1>
          <p className="text-muted-foreground font-body text-sm max-w-md">
            Your personal clothing collection powered by AI.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-6 mt-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="flex items-center gap-3 bg-card rounded-xl border border-border px-5 py-3.5 shadow-sm"
            >
              <div className={`w-9 h-9 rounded-lg bg-secondary flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-4 h-4" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-xl font-heading font-semibold text-foreground">{stat.value}</p>
                <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">{stat.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default WardrobeHeader;

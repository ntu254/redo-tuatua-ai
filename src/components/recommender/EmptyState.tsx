import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full text-center px-8"
    >
      <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
        <Sparkles className="w-8 h-8 text-accent" />
      </div>
      <h3 className="font-heading text-2xl font-semibold text-foreground mb-2">
        Tell StyleAI what you want to wear today
      </h3>
      <p className="text-sm font-body text-muted-foreground max-w-md mb-6">
        Describe your style, occasion, or mood — and our AI will curate the perfect outfit for you with shopping links.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {["Coffee date outfit ☕", "Streetwear weekend 🔥", "Office under 1M 💼"].map((prompt) => (
          <span
            key={prompt}
            className="text-xs font-body px-4 py-2 rounded-full border border-border text-muted-foreground"
          >
            {prompt}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default EmptyState;

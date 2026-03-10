import { motion } from "framer-motion";
import { Shirt, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const WardrobeEmptyState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 px-6"
  >
    <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center mb-6">
      <Shirt className="w-10 h-10 text-muted-foreground/20" strokeWidth={1} />
    </div>
    <h3 className="font-heading text-2xl text-foreground mb-2 italic">Your wardrobe is empty</h3>
    <p className="text-sm text-muted-foreground font-body text-center max-w-sm mb-6">
      Start building your digital wardrobe. Add your clothes and let AI create perfect outfits for you.
    </p>
    <Button variant="accent" className="gap-2 rounded-xl">
      <Plus className="w-4 h-4" /> Add your first clothing item
    </Button>
  </motion.div>
);

export default WardrobeEmptyState;

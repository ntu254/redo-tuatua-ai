import { Heart, Eye } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import dateNightImg from "@/assets/style-datenight-new.jpg";
import streetImg from "@/assets/style-streetwear-new.jpg";
import officeImg from "@/assets/style-office-new.jpg";
import athleisureImg from "@/assets/style-athleisure-new.jpg";
import casualImg from "@/assets/style-casual-new.jpg";
import kfashionImg from "@/assets/lookbook-kfashion.jpg";

const looks = [
  { image: dateNightImg, tag: "Date Night", saved: 342 },
  { image: streetImg, tag: "Streetwear", saved: 528 },
  { image: officeImg, tag: "Office Chic", saved: 415 },
  { image: athleisureImg, tag: "Athleisure", saved: 289 },
  { image: casualImg, tag: "Casual", saved: 631 },
  { image: kfashionImg, tag: "K-Fashion", saved: 487 },
];

const TrendingLookbook = () => {
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const toggleLike = (i: number) => {
    setLiked(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <section className="bg-background">
      <div className="border-b border-border px-6 py-16 text-center">
        <p className="editorial-label mb-4">Trending Now</p>
        <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
          Lookbook <span className="italic">inspiration</span>
        </h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3">
        {looks.map((look, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="group relative overflow-hidden cursor-pointer"
          >
            <div className="aspect-[3/4]">
              <img src={look.image} alt={look.tag} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>

            {/* Hover overlay */}
            <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/40 transition-colors duration-300 flex items-end">
              <div className="p-5 w-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block text-[9px] font-body uppercase tracking-[0.3em] text-background/80 bg-background/20 backdrop-blur-sm px-3 py-1 mb-2">{look.tag}</span>
                <div className="flex items-center justify-between">
                  <button className="flex items-center gap-2 text-background/80 hover:text-accent transition-colors">
                    <Eye className="w-4 h-4" />
                    <span className="text-[10px] font-body font-medium uppercase tracking-wider">View Outfit</span>
                  </button>
                  <button onClick={() => toggleLike(i)}
                    className="flex items-center gap-1.5 text-background/80 hover:text-accent transition-colors">
                    <Heart className={`w-4 h-4 ${liked.has(i) ? "fill-accent text-accent" : ""}`} />
                    <span className="text-[10px] font-body">{look.saved + (liked.has(i) ? 1 : 0)}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Style tag always visible */}
            <div className="absolute top-4 left-4">
              <span className="text-[9px] font-body uppercase tracking-[0.25em] text-background bg-foreground/60 backdrop-blur-sm px-3 py-1">{look.tag}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TrendingLookbook;

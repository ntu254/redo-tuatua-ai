import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import streetImg from "@/assets/style-streetwear-new.jpg";
import minimalImg from "@/assets/style-minimal-new.jpg";
import kfashionImg from "@/assets/lookbook-kfashion.jpg";
import athleisureImg from "@/assets/style-athleisure-new.jpg";
import officeImg from "@/assets/style-office-new.jpg";

const styles = [
  { name: "Gorpcore", image: streetImg, desc: "Outdoor meets streetwear — utility bags, hiking shoes, windbreakers." },
  { name: "Quiet Luxury", image: minimalImg, desc: "Premium fabrics, perfect cuts, no logos. The art of understated elegance." },
  { name: "K-Fashion", image: kfashionImg, desc: "Korean aesthetics shaping global trends with layered, oversized silhouettes." },
  { name: "Athleisure", image: athleisureImg, desc: "Refined sportswear mixed with blazers and premium accessories." },
  { name: "Minimalist Office", image: officeImg, desc: "Clean lines and neutral palettes for modern professional style." },
];

const TrendingStyles = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 md:py-20 border-t border-border">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="editorial-label mb-3">Fashion Aesthetics</p>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
              Trending <span className="italic">Styles</span>
            </h2>
          </div>
          <Sparkles className="w-5 h-5 text-muted-foreground hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-px bg-border">
          {styles.map((s, i) => (
            <motion.button
              key={s.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              onClick={() => navigate("/recommender")}
              className="group relative overflow-hidden bg-background"
            >
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={s.image}
                  alt={s.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="font-heading text-lg italic text-background mb-1">{s.name}</h3>
                  <p className="text-[10px] font-body text-background/70 leading-relaxed line-clamp-2">{s.desc}</p>
                  <div className="mt-2 flex items-center gap-1 text-[9px] font-body font-medium uppercase tracking-wider text-background/80 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore <ArrowRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingStyles;

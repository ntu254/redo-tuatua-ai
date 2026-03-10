import { motion } from "framer-motion";
import { Palette, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const colors = [
  {
    name: "Butter Yellow",
    hex: "#F5D76E",
    desc: "The pastel shade dominating summer collections.",
    stat: "Appears in 38% of summer 2026 runways.",
  },
  {
    name: "Sage Green",
    hex: "#9CAF88",
    desc: "A calming natural tone for everyday elegance.",
    stat: "Searches up 52% this season.",
  },
  {
    name: "Cherry Red",
    hex: "#C0392B",
    desc: "Bold and confident — the statement color of the year.",
    stat: "Featured in 27% of luxury campaigns.",
  },
  {
    name: "Soft Beige",
    hex: "#D4C5B2",
    desc: "The foundation of quiet luxury wardrobes.",
    stat: "Most saved neutral tone on StyleAI.",
  },
  {
    name: "Lavender",
    hex: "#B39DDB",
    desc: "Romantic pastel energy from runway to streetwear.",
    stat: "Growing 35% in social media mentions.",
  },
];

const TrendingColors = () => {
  const navigate = useNavigate();

  return (
    <section className="py-14 md:py-20 border-t border-border">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="editorial-label mb-3">Color Intelligence</p>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
              Trending <span className="italic">Colors</span>
            </h2>
          </div>
          <Palette className="w-5 h-5 text-muted-foreground hidden md:block" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {colors.map((c, i) => (
            <motion.button
              key={c.name}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              onClick={() => navigate("/recommender")}
              className="group text-left"
            >
              <div
                className="w-full aspect-[4/3] mb-3 transition-transform duration-500 group-hover:scale-[1.03]"
                style={{ backgroundColor: c.hex }}
              />
              <h3 className="font-heading text-base italic text-foreground mb-1">{c.name}</h3>
              <p className="text-[11px] font-body text-muted-foreground leading-relaxed mb-2">
                {c.desc}
              </p>
              <p className="text-[9px] font-body font-medium uppercase tracking-wider text-accent">
                {c.stat}
              </p>
              <div className="mt-2 flex items-center gap-1 text-[9px] font-body font-medium uppercase tracking-wider text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                Explore <ArrowRight className="w-2.5 h-2.5" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingColors;

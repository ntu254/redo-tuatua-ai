import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import casualImg from "@/assets/style-casual-new.jpg";
import streetImg from "@/assets/style-streetwear-new.jpg";
import minimalImg from "@/assets/style-minimal-new.jpg";
import officeImg from "@/assets/style-office-new.jpg";
import athleisureImg from "@/assets/style-athleisure-new.jpg";
import dateNightImg from "@/assets/style-datenight-new.jpg";

const styles = [
  { label: "Casual", image: casualImg, tag: "Everyday" },
  { label: "Streetwear", image: streetImg, tag: "Urban" },
  { label: "Minimal", image: minimalImg, tag: "Clean" },
  { label: "Office", image: officeImg, tag: "Professional" },
  { label: "Athleisure", image: athleisureImg, tag: "Active" },
  { label: "Date Night", image: dateNightImg, tag: "Elegant" },
];

const StyleExplorer = () => (
  <section className="bg-background">
    <div className="border-b border-border px-6 py-16 text-center">
      <p className="editorial-label mb-4">Style Explorer</p>
      <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
        Discover your <span className="italic">fashion identity</span>
      </h2>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
      {styles.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="group relative cursor-pointer overflow-hidden"
        >
          <div className="aspect-[3/4]">
            <img src={s.image} alt={s.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          </div>
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent flex flex-col justify-end p-5">
            <span className="text-[9px] font-body uppercase tracking-[0.3em] text-background/60 mb-1">{s.tag}</span>
            <p className="font-heading text-xl italic text-background mb-3">{s.label}</p>
            <div className="flex items-center gap-1.5 text-background/70 group-hover:text-accent transition-colors">
              <span className="text-[10px] font-body font-medium uppercase tracking-wider">Explore outfits</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </section>
);

export default StyleExplorer;

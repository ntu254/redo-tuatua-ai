import { useState } from "react";
import { motion } from "framer-motion";
import { Flame, ArrowRight } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";
import athleisureImg from "@/assets/style-athleisure.jpg";

const categories = ["Tất cả", "Mùa hè 2026", "Màu sắc", "Item hot", "MXH"];

const trends = [
  { title: "Butter Yellow thống trị mùa hè", image: casualImg, tag: "Màu sắc", hot: true,
    desc: "Vàng bơ tiếp tục là xu hướng mạnh. Dễ phối, phù hợp từ casual đến công sở." },
  { title: "Linen — chất liệu must-have", image: officeImg, tag: "Mùa hè 2026", hot: true,
    desc: "Linen trở lại mạnh mẽ, từ blazer đến quần suông rộng." },
  { title: "Maxi skirt: chiều dài mới", image: partyImg, tag: "Item hot", hot: false,
    desc: "Váy maxi hot trở lại với xếp ly và cut-out tinh tế." },
  { title: "Gorpcore chưa hạ nhiệt", image: streetImg, tag: "MXH", hot: true,
    desc: "Outdoor-meets-streetwear: áo gió, giày hiking, túi utility." },
  { title: "Athleisure nâng cấp", image: athleisureImg, tag: "Item hot", hot: false,
    desc: "Athleisure nay được mix elegant với blazer và phụ kiện sang trọng." },
  { title: "Quiet Luxury", image: officeImg, tag: "Mùa hè 2026", hot: true,
    desc: "Chất liệu tốt, form đẹp, không logo — trend cho người sành điệu." },
];

const Trends = () => {
  const [activeFilter, setActiveFilter] = useState(0);
  const filtered = activeFilter === 0 ? trends : trends.filter(t => t.tag === categories[activeFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="border-b border-border px-6 py-12">
          <div className="container mx-auto max-w-5xl">
            <p className="editorial-label mb-3">Xu hướng thời trang</p>
            <h1 className="font-heading text-4xl font-light text-foreground">
              Trend <span className="italic">đang hot</span>
            </h1>
          </div>
        </div>

        <div className="border-b border-border flex overflow-x-auto">
          {categories.map((c, i) => (
            <button key={c} onClick={() => setActiveFilter(i)}
              className={`px-8 py-4 text-[11px] font-body font-medium tracking-[0.2em] uppercase transition-all border-r border-border whitespace-nowrap ${
                i === activeFilter ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}>{c}</button>
          ))}
        </div>

        <div className="mag-grid grid-cols-1 md:grid-cols-2">
          {filtered.map((t, i) => (
            <motion.article key={t.title} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="editorial-card cursor-pointer group">
              <div className="relative mag-img-zoom aspect-[16/10]">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover" />
                <div className="absolute top-4 left-4 flex gap-1">
                  <span className="bg-background/90 text-foreground text-[9px] font-body font-medium px-3 py-1 uppercase tracking-wider">{t.tag}</span>
                  {t.hot && (
                    <span className="bg-accent text-accent-foreground text-[9px] font-body font-semibold px-3 py-1 flex items-center gap-1 uppercase tracking-wider">
                      <Flame className="w-2.5 h-2.5" /> Hot
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6 border-t border-border">
                <h3 className="font-heading text-xl italic text-foreground mb-2">{t.title}</h3>
                <p className="text-xs text-muted-foreground font-body leading-relaxed mb-4">{t.desc}</p>
                <button className="text-[10px] font-body font-medium uppercase tracking-wider text-accent flex items-center gap-1 group-hover:gap-2 transition-all">
                  Xem chi tiết <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Trends;

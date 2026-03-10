import { motion } from "framer-motion";
import { TrendingUp, Flame, Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";
import athleisureImg from "@/assets/style-athleisure.jpg";

const trendCategories = ["Tất cả", "Mùa hè 2026", "Màu sắc", "Item hot", "MXH"];

const trends = [
  { title: "Tông Butter Yellow thống trị mùa hè", image: casualImg, tag: "Màu sắc", hot: true,
    desc: "Vàng bơ tiếp tục là xu hướng mạnh. Dễ phối, phù hợp nhiều kiểu dáng từ casual đến công sở." },
  { title: "Linen — chất liệu must-have", image: officeImg, tag: "Mùa hè 2026", hot: true,
    desc: "Linen trở lại mạnh mẽ với thiết kế hiện đại hơn, từ blazer đến quần suông rộng." },
  { title: "Maxi skirt: chiều dài mới", image: partyImg, tag: "Item hot", hot: false,
    desc: "Váy maxi đang hot trở lại với nhiều biến tấu từ xếp ly đến cut-out tinh tế." },
  { title: "Gorpcore vẫn chưa hạ nhiệt", image: streetImg, tag: "MXH", hot: true,
    desc: "Phong cách outdoor-meets-streetwear: áo gió, giày hiking, túi utility vẫn là combo ưa thích." },
  { title: "Athleisure nâng cấp", image: athleisureImg, tag: "Item hot", hot: false,
    desc: "Không còn chỉ để tập gym, athleisure nay được mix elegant với blazer và phụ kiện sang trọng." },
  { title: "Quiet Luxury — sang trọng thầm lặng", image: officeImg, tag: "Mùa hè 2026", hot: true,
    desc: "Less is more: chất liệu tốt, form đẹp, không logo. Ít nhưng chất — trend cho người sành điệu." },
];

const Trends = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <div className="pt-28 pb-20 px-6">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12">
          <p className="text-[11px] font-body uppercase tracking-[0.3em] text-muted-foreground mb-3">Xu hướng thời trang</p>
          <h1 className="font-heading text-3xl md:text-4xl font-semibold italic text-foreground">
            Trend đang hot
          </h1>
          <div className="editorial-divider mt-4" />
        </div>

        <div className="flex gap-2 mb-10 overflow-x-auto pb-2">
          {trendCategories.map((c, i) => (
            <button key={c} className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all whitespace-nowrap ${
              i === 0 ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
            }`}>{c}</button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {trends.map((t, i) => (
            <motion.article key={t.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="bg-card rounded-3xl border border-border overflow-hidden editorial-card group cursor-pointer">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={t.image} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-card/90 backdrop-blur-sm text-foreground text-[10px] font-body font-medium px-3 py-1 rounded-full">{t.tag}</span>
                  {t.hot && (
                    <span className="bg-accent text-accent-foreground text-[10px] font-body font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                      <Flame className="w-2.5 h-2.5" /> Hot
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{t.title}</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed mb-4">{t.desc}</p>
                <button className="text-xs font-body font-medium text-accent flex items-center gap-1 hover:gap-2 transition-all">
                  Xem chi tiết <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default Trends;

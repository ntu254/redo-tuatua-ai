import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";
import athleisureImg from "@/assets/style-athleisure.jpg";

const platformColors: Record<string, string> = {
  Shopee: "bg-shopee",
  Lazada: "bg-lazada",
  Tiki: "bg-tiki",
  Zalora: "bg-zalora",
};

interface Product { name: string; price: string; platform: string; }
interface StyleData { label: string; image: string; products: Product[]; swatches: string[]; desc: string; }

const styles: StyleData[] = [
  { label: "Casual", image: casualImg, desc: "Thoải mái, tự nhiên cho ngày thường", swatches: ["#F5DEB3","#6B8E23","#4682B4"],
    products: [
      { name: "Áo thun cotton basic unisex", price: "163.000đ", platform: "Shopee" },
      { name: "Quần jeans slim-fit xanh nhạt", price: "389.000đ", platform: "Lazada" },
      { name: "Sneaker low-top trắng", price: "329.000đ", platform: "Tiki" },
      { name: "Túi tote canvas beige", price: "135.000đ", platform: "Shopee" },
    ]},
  { label: "Công sở", image: officeImg, desc: "Lịch sự, chuyên nghiệp cho nơi làm việc", swatches: ["#1C1C1C","#F5F5F5","#B0C4DE"],
    products: [
      { name: "Áo sơ mi lụa trắng slim", price: "450.000đ", platform: "Lazada" },
      { name: "Quần âu ống đứng đen", price: "380.000đ", platform: "Shopee" },
      { name: "Giày oxford da nâu", price: "520.000đ", platform: "Tiki" },
      { name: "Đồng hồ minimalist bạc", price: "890.000đ", platform: "Zalora" },
    ]},
  { label: "Dạ tiệc", image: partyImg, desc: "Nổi bật, sang trọng cho buổi tối", swatches: ["#FFD700","#8B0000","#000000"],
    products: [
      { name: "Đầm sequin vàng midi", price: "1.250.000đ", platform: "Zalora" },
      { name: "Clutch ánh kim bạc", price: "320.000đ", platform: "Shopee" },
      { name: "Giày cao gót strappy đen", price: "650.000đ", platform: "Lazada" },
      { name: "Bông tai pha lê dáng dài", price: "189.000đ", platform: "Tiki" },
    ]},
  { label: "Streetwear", image: streetImg, desc: "Cá tính, năng động theo phong cách đường phố", swatches: ["#2F4F4F","#FF6347","#F0E68C"],
    products: [
      { name: "Hoodie oversize graphic", price: "420.000đ", platform: "Shopee" },
      { name: "Quần cargo túi hộp xám", price: "350.000đ", platform: "Lazada" },
      { name: "Giày chunky sneaker", price: "780.000đ", platform: "Tiki" },
      { name: "Mũ bucket hat đen", price: "125.000đ", platform: "Shopee" },
    ]},
  { label: "Athleisure", image: athleisureImg, desc: "Khỏe khoắn, năng động cho vận động", swatches: ["#000000","#FF1493","#00CED1"],
    products: [
      { name: "Áo tank top dry-fit", price: "220.000đ", platform: "Shopee" },
      { name: "Legging tập gym seamless", price: "380.000đ", platform: "Lazada" },
      { name: "Giày training nhẹ", price: "690.000đ", platform: "Tiki" },
      { name: "Bình nước thể thao 750ml", price: "95.000đ", platform: "Shopee" },
    ]},
];

const StylePicker = () => {
  const [active, setActive] = useState(0);
  const current = styles[active];

  return (
    <section className="py-28 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-[11px] font-body uppercase tracking-[0.3em] text-muted-foreground mb-4">Phong cách của bạn</p>
          <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground italic">
            Chọn phong cách, nhận gợi ý ngay
          </h2>
          <div className="editorial-divider mx-auto mt-6" />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          {styles.map((s, i) => (
            <button key={s.label} onClick={() => setActive(i)}
              className={`px-6 py-2.5 rounded-full text-sm font-body font-medium transition-all duration-300 ${
                i === active ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>{s.label}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }} className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden aspect-[3/4] max-h-[540px]">
              <img src={current.image} alt={current.label} className="w-full h-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-foreground/60 to-transparent">
                <p className="text-[11px] font-body uppercase tracking-wider text-background/70">Phong cách</p>
                <p className="font-heading text-2xl font-semibold text-background italic">{current.label}</p>
                <p className="text-xs text-background/80 font-body mt-1">{current.desc}</p>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                {current.swatches.map(c => (
                  <span key={c} className="w-6 h-6 rounded-full border-2 border-card/60" style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-body uppercase tracking-[0.25em] text-muted-foreground mb-5">
                Sản phẩm gợi ý từ các sàn TMĐT
              </p>
              {current.products.map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-4 bg-card rounded-2xl border border-border p-4 editorial-card cursor-pointer">
                  <div className="w-14 h-14 rounded-xl bg-cream flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-body font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-sm text-accent font-body font-semibold">{p.price}</p>
                  </div>
                  <span className={`${platformColors[p.platform]} text-accent-foreground text-[10px] font-body font-semibold px-3 py-1 rounded-full`}>
                    {p.platform}
                  </span>
                </motion.div>
              ))}
              <Button variant="accent" className="w-full mt-5 gap-2 rounded-full font-body">
                Xem toàn bộ outfit này <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default StylePicker;

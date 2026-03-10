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

interface Product {
  name: string;
  price: string;
  platform: string;
}

interface StyleData {
  label: string;
  image: string;
  products: Product[];
  swatches: string[];
}

const styles: StyleData[] = [
  {
    label: "Casual",
    image: casualImg,
    swatches: ["#F5DEB3", "#6B8E23", "#4682B4"],
    products: [
      { name: "Áo thun cotton basic unisex", price: "163.000đ", platform: "Shopee" },
      { name: "Quần jeans slim-fit xanh nhạt", price: "389.000đ", platform: "Lazada" },
      { name: "Sneaker low-top trắng", price: "329.000đ", platform: "Tiki" },
      { name: "Túi tote canvas beige", price: "135.000đ", platform: "Shopee" },
    ],
  },
  {
    label: "Công sở",
    image: officeImg,
    swatches: ["#1C1C1C", "#F5F5F5", "#B0C4DE"],
    products: [
      { name: "Áo sơ mi lụa trắng slim", price: "450.000đ", platform: "Lazada" },
      { name: "Quần âu ống đứng đen", price: "380.000đ", platform: "Shopee" },
      { name: "Giày oxford da nâu", price: "520.000đ", platform: "Tiki" },
      { name: "Đồng hồ minimalist bạc", price: "890.000đ", platform: "Zalora" },
    ],
  },
  {
    label: "Dạ tiệc",
    image: partyImg,
    swatches: ["#FFD700", "#8B0000", "#000000"],
    products: [
      { name: "Đầm sequin vàng midi", price: "1.250.000đ", platform: "Zalora" },
      { name: "Clutch ánh kim bạc", price: "320.000đ", platform: "Shopee" },
      { name: "Giày cao gót strappy đen", price: "650.000đ", platform: "Lazada" },
      { name: "Bông tai pha lê dáng dài", price: "189.000đ", platform: "Tiki" },
    ],
  },
  {
    label: "Streetwear",
    image: streetImg,
    swatches: ["#2F4F4F", "#FF6347", "#F0E68C"],
    products: [
      { name: "Hoodie oversize graphic", price: "420.000đ", platform: "Shopee" },
      { name: "Quần cargo túi hộp xám", price: "350.000đ", platform: "Lazada" },
      { name: "Giày chunky sneaker", price: "780.000đ", platform: "Tiki" },
      { name: "Mũ bucket hat đen", price: "125.000đ", platform: "Shopee" },
    ],
  },
  {
    label: "Athleisure",
    image: athleisureImg,
    swatches: ["#000000", "#FF1493", "#00CED1"],
    products: [
      { name: "Áo tank top dry-fit", price: "220.000đ", platform: "Shopee" },
      { name: "Legging tập gym seamless", price: "380.000đ", platform: "Lazada" },
      { name: "Giày training nhẹ", price: "690.000đ", platform: "Tiki" },
      { name: "Bình nước thể thao 750ml", price: "95.000đ", platform: "Shopee" },
    ],
  },
];

const StylePicker = () => {
  const [active, setActive] = useState(0);
  const current = styles[active];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <span className="inline-block text-xs font-heading uppercase tracking-widest text-muted-foreground border border-border rounded-full px-4 py-1.5 mb-4">
            Phong cách của bạn
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
            Chọn phong cách, nhận gợi ý ngay
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {styles.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setActive(i)}
              className={`px-5 py-2 rounded-full text-sm font-heading font-medium transition-all ${
                i === active
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          >
            {/* Image */}
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4] max-h-[520px]">
              <img
                src={current.image}
                alt={current.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-primary/80 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-xl">
                <p className="text-xs opacity-80">Phong cách</p>
                <p className="font-heading font-semibold">{current.label}</p>
              </div>
              <div className="absolute bottom-4 right-4 flex gap-1">
                {current.swatches.map((c) => (
                  <span
                    key={c}
                    className="w-5 h-5 rounded-full border border-card/50"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            {/* Products */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-heading uppercase tracking-wider mb-4">
                Sản phẩm gợi ý từ các sàn thương mại điện tử
              </p>

              {current.products.map((p, i) => (
                <motion.div
                  key={p.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 bg-card rounded-xl border border-border p-4 hover:border-accent/30 transition-colors"
                >
                  <div className="w-14 h-14 rounded-lg bg-muted flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <p className="text-sm text-muted-foreground">{p.price}</p>
                  </div>
                  <span
                    className={`${platformColors[p.platform]} text-accent-foreground text-[10px] font-heading font-semibold px-2.5 py-1 rounded-full`}
                  >
                    {p.platform}
                  </span>
                </motion.div>
              ))}

              <Button variant="accent" className="w-full mt-4 gap-2">
                Xem toàn bộ outfit này <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-muted-foreground">Đang xem outfit:</span>
                <div className="flex gap-1.5">
                  {styles.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-colors ${
                        i === active ? "bg-accent" : "bg-border"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default StylePicker;

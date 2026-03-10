import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, Heart, ExternalLink, Sparkles, ChevronLeft, ChevronRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import ChatSidebar from "@/components/recommender/ChatSidebar";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";

interface Product {
  name: string;
  price: string;
  oldPrice?: string;
  platform: string;
  brand: string;
  image: string;
}

interface Outfit {
  id: number;
  title: string;
  emoji: string;
  image: string;
  style: string;
  aiMatch: boolean;
  totalPrice: string;
  products: Product[];
}

const outfits: Outfit[] = [
  {
    id: 1, title: "Casual Chic Hàng Ngày", emoji: "🧡", image: casualImg,
    style: "Casual · Minimalist", aiMatch: true, totalPrice: "1.099.000đ",
    products: [
      { name: "Áo thun basic oversize cotton", price: "189.000đ", oldPrice: "250.000đ", platform: "Shopee", brand: "YODY", image: casualImg },
      { name: "Quần jeans ống rộng high waist", price: "390.000đ", oldPrice: "450.000đ", platform: "Lazada", brand: "Routine", image: casualImg },
      { name: "Sneakers trắng basic unisex", price: "520.000đ", platform: "Tiki", brand: "Ananas", image: casualImg },
      { name: "Túi tote vải canvas", price: "120.000đ", platform: "Shopee", brand: "Local Brand", image: casualImg },
    ],
  },
  {
    id: 2, title: "Streetwear Trendy", emoji: "🧢", image: streetImg,
    style: "Streetwear · K-Fashion", aiMatch: true, totalPrice: "875.000đ",
    products: [
      { name: "Hoodie vintage wash oversized", price: "350.000đ", platform: "Shopee", brand: "MLB", image: streetImg },
      { name: "Cargo pants túi hộp 6 túi", price: "430.000đ", oldPrice: "560.000đ", platform: "Lazada", brand: "5S Fashion", image: streetImg },
      { name: "Mũ bucket Corduroy", price: "95.000đ", platform: "Shopee", brand: "Local Brand", image: streetImg },
      { name: "Giày chunky sneaker", price: "680.000đ", platform: "Tiki", brand: "Fila", image: streetImg },
    ],
  },
  {
    id: 3, title: "Office Elegant", emoji: "💼", image: officeImg,
    style: "Công sở · Thanh lịch", aiMatch: false, totalPrice: "1.280.000đ",
    products: [
      { name: "Áo sơ mi lụa trắng cổ V", price: "450.000đ", platform: "Lazada", brand: "IVY moda", image: officeImg },
      { name: "Quần âu đen ống đứng slim", price: "380.000đ", oldPrice: "420.000đ", platform: "Shopee", brand: "Aristino", image: officeImg },
      { name: "Giày cao gót mũi nhọn 5cm", price: "450.000đ", platform: "Tiki", brand: "Vascara", image: officeImg },
    ],
  },
  {
    id: 4, title: "Night Out Glam", emoji: "✨", image: partyImg,
    style: "Dạ tiệc · Party", aiMatch: false, totalPrice: "1.570.000đ",
    products: [
      { name: "Đầm sequin vàng midi", price: "1.250.000đ", platform: "Shopee", brand: "Elise", image: partyImg },
      { name: "Clutch ánh kim bạc", price: "320.000đ", oldPrice: "400.000đ", platform: "Lazada", brand: "Charles & Keith", image: partyImg },
    ],
  },
];

const platformColor: Record<string, string> = {
  Shopee: "text-shopee",
  Lazada: "text-lazada",
  Tiki: "text-tiki",
};

/* ─── Product Card ─── */
const ProductCard = ({ product }: { product: Product }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    className="group relative bg-background rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
  >
    {/* Image */}
    <div className="aspect-square overflow-hidden bg-secondary">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
    </div>

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-300 pointer-events-none" />
    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-2">
      <button className="p-2 rounded-full bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-accent transition-colors">
        <Heart className="w-4 h-4" />
      </button>
      <button className="p-2 rounded-full bg-background/90 backdrop-blur-sm text-muted-foreground hover:text-foreground transition-colors">
        <ExternalLink className="w-4 h-4" />
      </button>
    </div>

    {/* Info */}
    <div className="p-4 space-y-2.5">
      <p className={`text-xs font-body font-semibold uppercase tracking-wider ${platformColor[product.platform] || "text-muted-foreground"}`}>
        {product.platform} · {product.brand}
      </p>
      <p className="text-sm font-body font-medium text-foreground leading-snug line-clamp-2">
        {product.name}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-base font-body font-bold text-foreground">{product.price}</span>
        {product.oldPrice && (
          <span className="text-xs font-body text-muted-foreground line-through">{product.oldPrice}</span>
        )}
      </div>
    </div>
  </motion.div>
);

/* ─── Recommender Page ─── */
const Recommender = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const outfit = outfits[activeIndex];

  const prev = () => setActiveIndex(i => (i - 1 + outfits.length) % outfits.length);
  const next = () => setActiveIndex(i => (i + 1) % outfits.length);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex h-screen">
        <ChatSidebar />

        {/* Main content */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            {/* Split layout: 45% image | 55% products */}
            <div className="grid grid-cols-[45%_55%] min-h-full">

              {/* LEFT — Outfit hero image */}
              <div className="sticky top-0 h-screen flex flex-col bg-secondary/30">
                <div className="flex-1 relative overflow-hidden">
                  <motion.img
                    key={outfit.id}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    src={outfit.image}
                    alt={outfit.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation arrows */}
                  <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background/80 backdrop-blur-sm text-foreground hover:bg-background transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* AI Match badge */}
                  {outfit.aiMatch && (
                    <div className="absolute top-6 left-6 flex items-center gap-2 bg-background/85 backdrop-blur-md px-4 py-2 rounded-full">
                      <Sparkles className="w-3.5 h-3.5 text-accent" />
                      <span className="text-xs font-body font-semibold text-foreground">AI Match</span>
                    </div>
                  )}

                  {/* Outfit counter */}
                  <div className="absolute top-6 right-6 bg-background/85 backdrop-blur-md px-4 py-2 rounded-full">
                    <span className="text-xs font-body font-medium text-foreground">
                      {activeIndex + 1} / {outfits.length}
                    </span>
                  </div>
                </div>

                {/* Outfit info bar */}
                <div className="p-8 bg-background border-t border-border">
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs font-body font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">
                        {outfit.style}
                      </p>
                      <h2 className="font-heading text-2xl font-semibold text-foreground leading-tight">
                        {outfit.title} {outfit.emoji}
                      </h2>
                    </div>

                    <div className="flex items-center gap-3 text-sm font-body text-muted-foreground">
                      <span>{outfit.products.length} sản phẩm</span>
                      <span className="w-1 h-1 rounded-full bg-border" />
                      <span>Ước tính: <span className="font-semibold text-foreground">{outfit.totalPrice}</span></span>
                    </div>

                    <div className="flex gap-4">
                      <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90 h-12 text-sm font-body font-medium tracking-wide rounded-lg gap-2">
                        <ShoppingBag className="w-4 h-4" /> Mua cả outfit
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSaved(!saved)}
                        className={`h-12 px-5 rounded-lg border-border ${saved ? "text-accent border-accent" : ""}`}
                      >
                        <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT — Product grid */}
              <div className="pl-14 pr-10 py-12">
                <div className="mb-10">
                  <p className="text-xs font-body font-medium uppercase tracking-[0.3em] text-muted-foreground mb-3">
                    Recommended items
                  </p>
                  <h3 className="font-heading text-xl text-foreground">
                    Sản phẩm trong outfit
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-x-6 gap-y-7">
                  {outfit.products.map((product, i) => (
                    <ProductCard key={`${outfit.id}-${i}`} product={product} />
                  ))}
                </div>

                {/* Outfit thumbnails */}
                <div className="mt-16 pt-10 border-t border-border">
                  <p className="text-xs font-body font-medium uppercase tracking-[0.3em] text-muted-foreground mb-6">
                    Các outfit khác
                  </p>
                  <div className="flex gap-4">
                    {outfits.map((o, i) => (
                      <button
                        key={o.id}
                        onClick={() => setActiveIndex(i)}
                        className={`relative w-20 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                          i === activeIndex ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={o.image} alt={o.title} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommender;

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import ChatSidebar from "@/components/recommender/ChatSidebar";
import OutfitCard from "@/components/recommender/OutfitCard";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";

const filterTabs = [
  { icon: "✨", label: "Tất cả", active: true },
  { icon: "🧥", label: "Casual" },
  { icon: "🇰🇷", label: "K-Fashion" },
  { icon: "💼", label: "Business" },
  { icon: "🌺", label: "Boho" },
];

const sampleOutfits = [
  {
    id: 1, title: "Casual Chic Hàng Ngày", emoji: "🧡", image: casualImg,
    style: "Casual · Minimalist", aiMatch: true, totalPrice: "1.099.000đ",
    products: [
      { name: "Áo thun basic oversize cotton" },
      { name: "Quần jeans ống rộng high waist" },
      { name: "Sneakers trắng basic unisex" },
    ],
  },
  {
    id: 2, title: "Streetwear Trendy", emoji: "🧢", image: streetImg,
    style: "Streetwear · K-Fashion", aiMatch: true, totalPrice: "875.000đ",
    products: [
      { name: "Hoodie vintage wash oversized" },
      { name: "Cargo pants túi hộp 6 túi" },
      { name: "Mũ bucket Corduroy" },
    ],
  },
  {
    id: 3, title: "Office Elegant", emoji: "💼", image: officeImg,
    style: "Công sở · Thanh lịch", aiMatch: false, totalPrice: "1.280.000đ",
    products: [
      { name: "Áo sơ mi lụa trắng cổ V" },
      { name: "Quần âu đen ống đứng slim" },
      { name: "Giày cao gót mũi nhọn 5cm" },
    ],
  },
  {
    id: 4, title: "Night Out Glam", emoji: "✨", image: partyImg,
    style: "Dạ tiệc · Party", aiMatch: false, totalPrice: "1.570.000đ",
    products: [
      { name: "Đầm sequin vàng midi" },
      { name: "Clutch ánh kim bạc" },
    ],
  },
];

const Recommender = () => {
  const [selectedOutfit, setSelectedOutfit] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex h-screen">
        {/* Chat sidebar */}
        <ChatSidebar />

        {/* Right panel — outfit suggestions */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden bg-secondary/30">
          {/* Page header — 48px section spacing */}
          <div className="px-10 pt-12 pb-8">
            <div className="max-w-[1280px] mx-auto flex items-end justify-between">
              <div>
                <p className="text-xs font-body font-medium uppercase tracking-[0.3em] text-muted-foreground mb-3">
                  Curated for you
                </p>
                <h1 className="font-heading text-[32px] font-semibold text-foreground leading-tight">
                  Gợi ý Outfit AI
                </h1>
                <p className="text-sm font-body text-muted-foreground mt-2">
                  Được cá nhân hóa dựa trên phong cách của bạn
                </p>
              </div>
              <Button variant="outline" size="sm" className="gap-2 text-xs rounded-full px-5 py-2.5 h-auto">
                <RefreshCw className="w-3.5 h-3.5" /> Làm mới
              </Button>
            </div>
          </div>

          {/* Filter tabs — 48px spacing from header */}
          <div className="px-10 pb-8">
            <div className="max-w-[1280px] mx-auto flex gap-3 overflow-x-auto">
              {filterTabs.map(tab => (
                <button key={tab.label}
                  className={`text-sm font-body px-5 py-2.5 rounded-full border transition-all duration-300 whitespace-nowrap ${
                    tab.active
                      ? "bg-foreground text-background border-foreground"
                      : "border-border text-muted-foreground hover:border-foreground hover:text-foreground bg-background"
                  }`}>
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Outfit grid — image-first cards */}
          <div className="flex-1 overflow-y-auto px-10 pb-12">
            <div className="max-w-[1280px] mx-auto grid grid-cols-2 xl:grid-cols-3 gap-8">
              {sampleOutfits.map((outfit, index) => (
                <OutfitCard
                  key={outfit.id}
                  outfit={outfit}
                  index={index}
                  onSelect={setSelectedOutfit}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommender;

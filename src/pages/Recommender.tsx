import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import ChatSidebar from "@/components/recommender/ChatSidebar";
import OutfitHeader from "@/components/recommender/OutfitHeader";
import OutfitCard from "@/components/recommender/OutfitCard";
import casualImg from "@/assets/style-casual-new.jpg";
import officeImg from "@/assets/style-office-new.jpg";
import partyImg from "@/assets/style-party-new.jpg";
import streetImg from "@/assets/style-streetwear-new.jpg";

import prodTshirt from "@/assets/products/tshirt-white-basic.jpg";
import prodJeans from "@/assets/products/jeans-wide-leg.jpg";
import prodSneakers from "@/assets/products/sneakers-white.jpg";
import prodHoodie from "@/assets/products/hoodie-vintage.jpg";
import prodCargo from "@/assets/products/cargo-pants.jpg";
import prodBucketHat from "@/assets/products/bucket-hat.jpg";
import prodSilkBlouse from "@/assets/products/silk-blouse.jpg";
import prodBlackTrousers from "@/assets/products/black-trousers.jpg";
import prodBlackHeels from "@/assets/products/black-heels.jpg";
import prodSequinDress from "@/assets/products/sequin-dress.jpg";
import prodSilverClutch from "@/assets/products/silver-clutch.jpg";

const sampleOutfits = [
  {
    id: 1,
    title: "Casual Chic Hàng Ngày",
    emoji: "🧡",
    image: casualImg,
    style: "Casual · Minimalist",
    aiMatch: true,
    aiComment:
      "Bộ outfit phù hợp minimalist của bạn, dễ phối và thích hợp từ đi học đến cà phê cuối tuần!",
    totalPrice: "1.099.000đ",
    products: [
      { name: "Áo thun basic oversize cotton", price: "189.000đ", oldPrice: "250.000đ", platform: "Shopee", badge: "Bestseller", rating: 4.8, sold: "12.4k", brand: "YODY", image: prodTshirt },
      { name: "Quần jeans ống rộng high waist", price: "390.000đ", oldPrice: "450.000đ", platform: "Lazada", badge: null, rating: 4.6, sold: "8.2k", brand: "Routine", image: prodJeans },
      { name: "Sneakers trắng basic unisex", price: "520.000đ", oldPrice: null, platform: "Tiki", badge: "Freeship", rating: 4.7, sold: "5.1k", brand: "Ananas", image: prodSneakers },
    ],
  },
  {
    id: 2,
    title: "Streetwear Trendy",
    emoji: "🧢",
    image: streetImg,
    style: "Streetwear · K-Fashion",
    aiMatch: true,
    aiComment:
      "Inspired bởi K-Street đang hot, mix tones earth với điểm nhấn nổi bật. Chuẩn cho cuối tuần!",
    totalPrice: "875.000đ",
    products: [
      { name: "Hoodie vintage wash oversized", price: "350.000đ", oldPrice: null, platform: "Shopee", badge: "Hot", rating: 4.9, sold: "20.1k", brand: "MLB", image: prodHoodie },
      { name: "Cargo pants túi hộp 6 túi", price: "430.000đ", oldPrice: "560.000đ", platform: "Lazada", badge: null, rating: 4.5, sold: "6.8k", brand: "5S Fashion", image: prodCargo },
      { name: "Mũ bucket Corduroy", price: "95.000đ", oldPrice: null, platform: "Shopee", badge: null, rating: 4.7, sold: "15.3k", brand: "Local Brand", image: prodBucketHat },
    ],
  },
  {
    id: 3,
    title: "Office Elegant",
    emoji: "💼",
    image: officeImg,
    style: "Công sở · Thanh lịch",
    aiMatch: false,
    aiComment:
      "Phong cách công sở hiện đại, tinh tế nhưng không nhàm chán. Phù hợp meeting và after-work dinner!",
    totalPrice: "1.280.000đ",
    products: [
      { name: "Áo sơ mi lụa trắng cổ V", price: "450.000đ", oldPrice: null, platform: "Lazada", badge: "Premium", rating: 4.9, sold: "3.2k", brand: "IVY moda", image: prodSilkBlouse },
      { name: "Quần âu đen ống đứng slim", price: "380.000đ", oldPrice: "420.000đ", platform: "Shopee", badge: null, rating: 4.5, sold: "7.1k", brand: "Aristino", image: prodBlackTrousers },
      { name: "Giày cao gót mũi nhọn 5cm", price: "450.000đ", oldPrice: null, platform: "Tiki", badge: "Freeship", rating: 4.6, sold: "4.5k", brand: "Vascara", image: prodBlackHeels },
    ],
  },
  {
    id: 4,
    title: "Night Out Glam",
    emoji: "✨",
    image: partyImg,
    style: "Dạ tiệc · Party",
    aiMatch: false,
    aiComment:
      "Outfit nổi bật cho đêm tiệc! Sequin mix cùng phụ kiện ánh kim, bạn sẽ là tâm điểm mọi ánh nhìn.",
    totalPrice: "1.570.000đ",
    products: [
      { name: "Đầm sequin vàng midi", price: "1.250.000đ", oldPrice: null, platform: "Shopee", badge: "Hot", rating: 4.8, sold: "2.1k", brand: "Elise", image: prodSequinDress },
      { name: "Clutch ánh kim bạc", price: "320.000đ", oldPrice: "400.000đ", platform: "Lazada", badge: null, rating: 4.4, sold: "1.8k", brand: "Charles & Keith", image: prodSilverClutch },
    ],
  },
];

const Recommender = () => {
  const [chatOpen, setChatOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tất cả");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(var(--secondary)/0.5)_0%,transparent_32%),linear-gradient(180deg,hsl(var(--background))_0%,hsl(var(--off-white))_100%)]">
      <Navbar />
      <div className="pt-16 flex h-screen">
        <ChatSidebar isOpen={chatOpen} onToggle={() => setChatOpen(!chatOpen)} />

        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <OutfitHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />

          {/* Outfit grid with generous spacing */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-8 xl:px-10">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 xl:gap-7">
                {sampleOutfits.map((outfit, i) => (
                  <OutfitCard key={outfit.id} outfit={outfit} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommender;

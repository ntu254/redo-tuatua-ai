import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, ExternalLink, Star, Bookmark, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";

const platformColors: Record<string, { bg: string; text: string }> = {
  Shopee: { bg: "bg-shopee/10", text: "text-shopee" },
  Lazada: { bg: "bg-lazada/10", text: "text-lazada" },
  Tiki: { bg: "bg-tiki/10", text: "text-tiki" },
};

interface ChatMsg { role: "user" | "ai"; text: string; }

const quickSuggestions = [
  { icon: "👔", label: "Outfit đi làm thanh lịch" },
  { icon: "🇰🇷", label: "K-Fashion cuối tuần" },
  { icon: "❤️", label: "Outfit hẹn hò lãng mạn" },
  { icon: "✈️", label: "Trang phục du lịch" },
];

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
    style: "Casual · Minimalist", aiMatch: true,
    aiComment: "Bộ outfit phù hợp minimalist của bạn, dễ phối và thích hợp từ đi học đến cà phê cuối tuần!",
    totalPrice: "1.099.000đ",
    products: [
      { name: "Áo thun basic oversize cotton", price: "189.000đ", oldPrice: "250.000đ", platform: "Shopee", badge: "Bestseller", rating: 4.8, sold: "12.4k", brand: "YODY" },
      { name: "Quần jeans ống rộng high waist", price: "390.000đ", oldPrice: "450.000đ", platform: "Lazada", badge: null, rating: 4.6, sold: "8.2k", brand: "Routine" },
      { name: "Sneakers trắng basic unisex", price: "520.000đ", oldPrice: null, platform: "Tiki", badge: "Freeship", rating: 4.7, sold: "5.1k", brand: "Ananas" },
    ],
  },
  {
    id: 2, title: "Streetwear Trendy", emoji: "🧢", image: streetImg,
    style: "Streetwear · K-Fashion", aiMatch: true,
    aiComment: "Inspired bởi K-Street đang hot, mix tones earth với điểm nhấn nổi bật. Chuẩn cho cuối tuần và chụp ảnh ngoài trời!",
    totalPrice: "875.000đ",
    products: [
      { name: "Hoodie vintage wash oversized", price: "350.000đ", oldPrice: null, platform: "Shopee", badge: "Hot", rating: 4.9, sold: "20.1k", brand: "MLB" },
      { name: "Cargo pants túi hộp 6 túi", price: "430.000đ", oldPrice: "560.000đ", platform: "Lazada", badge: null, rating: 4.5, sold: "6.8k", brand: "5S Fashion" },
      { name: "Mũ bucket Corduroy", price: "95.000đ", oldPrice: null, platform: "Shopee", badge: null, rating: 4.7, sold: "15.3k", brand: "Local Brand" },
    ],
  },
  {
    id: 3, title: "Office Elegant", emoji: "💼", image: officeImg,
    style: "Công sở · Thanh lịch", aiMatch: false,
    aiComment: "Phong cách công sở hiện đại, tinh tế nhưng không nhàm chán. Phù hợp meeting và after-work dinner!",
    totalPrice: "1.280.000đ",
    products: [
      { name: "Áo sơ mi lụa trắng cổ V", price: "450.000đ", oldPrice: null, platform: "Lazada", badge: "Premium", rating: 4.9, sold: "3.2k", brand: "IVY moda" },
      { name: "Quần âu đen ống đứng slim", price: "380.000đ", oldPrice: "420.000đ", platform: "Shopee", badge: null, rating: 4.5, sold: "7.1k", brand: "Aristino" },
      { name: "Giày cao gót mũi nhọn 5cm", price: "450.000đ", oldPrice: null, platform: "Tiki", badge: "Freeship", rating: 4.6, sold: "4.5k", brand: "Vascara" },
    ],
  },
  {
    id: 4, title: "Night Out Glam", emoji: "✨", image: partyImg,
    style: "Dạ tiệc · Party", aiMatch: false,
    aiComment: "Outfit nổi bật cho đêm tiệc! Sequin mix cùng phụ kiện ánh kim, bạn sẽ là tâm điểm của mọi ánh nhìn.",
    totalPrice: "1.570.000đ",
    products: [
      { name: "Đầm sequin vàng midi", price: "1.250.000đ", oldPrice: null, platform: "Shopee", badge: "Hot", rating: 4.8, sold: "2.1k", brand: "Elise" },
      { name: "Clutch ánh kim bạc", price: "320.000đ", oldPrice: "400.000đ", platform: "Lazada", badge: null, rating: 4.4, sold: "1.8k", brand: "Charles & Keith" },
    ],
  },
];

const Recommender = () => {
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "ai", text: "Xin chào bạn! 👋✨ Mình là StyleAI — trợ lý thời trang thông minh của bạn.\nHãy nói cho mình biết bạn muốn mặc gì hôm nay nhé!" },
  ]);
  const [input, setInput] = useState("");
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const sendMsg = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setChat(c => [...c, { role: "user", text: msg }]);
    setInput("");
    setTimeout(() => {
      setChat(c => [...c, { role: "ai", text: `Tuyệt vời! 🎨 Với "${msg}", mình đã cập nhật gợi ý outfit bên phải cho bạn rồi nhé!` }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex h-screen">
        {/* Chat sidebar */}
        <div className="w-full md:w-[320px] lg:w-[340px] border-r border-border flex flex-col bg-background shrink-0">
          {/* Header */}
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h2 className="font-heading text-base font-semibold text-foreground">StyleAI Assistant</h2>
                <span className="flex items-center gap-1.5 text-[11px] font-body text-teal">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" /> Đang hoạt động
                </span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-accent" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 text-[13px] font-body leading-relaxed rounded-2xl whitespace-pre-line ${
                  m.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-sm"
                    : "bg-secondary text-foreground rounded-bl-sm"
                }`}>{m.text}</div>
              </motion.div>
            ))}
          </div>

          {/* Quick suggestions */}
          <div className="px-4 pb-2">
            <p className="text-[11px] font-body text-muted-foreground mb-2">Gợi ý nhanh:</p>
            <div className="flex flex-wrap gap-1.5">
              {quickSuggestions.map(s => (
                <button key={s.label} onClick={() => sendMsg(s.label)}
                  className="text-[11px] font-body px-3 py-1.5 border border-border rounded-full hover:border-accent hover:text-accent transition-colors bg-background">
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMsg()}
                placeholder="Mô tả outfit bạn muốn... ✨"
                className="w-full bg-secondary border-0 px-4 py-3 pr-12 text-sm font-body rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30" />
              <button onClick={() => sendMsg()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-2 rounded-lg hover:opacity-90 transition-opacity">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right panel — outfit suggestions */}
        <div className="hidden md:flex flex-1 flex-col overflow-hidden">
          {/* Top bar */}
          <div className="p-6 border-b border-border flex items-start justify-between">
            <div>
              <h2 className="font-heading text-2xl text-foreground">Gợi ý Outfit AI ✨</h2>
              <p className="text-sm font-body text-muted-foreground mt-1">Được cá nhân hóa dựa trên phong cách của bạn 💜</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2 text-xs rounded-full">
              <RefreshCw className="w-3.5 h-3.5" /> Làm mới gợi ý
            </Button>
          </div>

          {/* Filter tabs */}
          <div className="px-6 py-3 border-b border-border flex gap-2 overflow-x-auto">
            {filterTabs.map(tab => (
              <button key={tab.label}
                className={`text-xs font-body px-4 py-2 rounded-full border transition-colors whitespace-nowrap ${
                  tab.active
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-border text-foreground hover:border-accent/50"
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Outfit cards - scrollable */}
          <div className="flex-1 overflow-y-auto px-6 py-6 grid grid-cols-2 gap-6 auto-rows-min content-start">
            {sampleOutfits.map(outfit => (
              <motion.div key={outfit.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                {/* Image on top */}
                <div className="relative aspect-[4/3]">
                  <div className="mag-img-zoom h-full">
                    <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover" />
                  </div>
                  <button onClick={() => setSaved(s => { const n = new Set(s); n.has(outfit.id) ? n.delete(outfit.id) : n.add(outfit.id); return n; })}
                    className={`absolute top-3 right-3 p-1.5 rounded-md bg-background/80 backdrop-blur-sm ${saved.has(outfit.id) ? "text-accent" : "text-muted-foreground"}`}>
                    <Bookmark className="w-4 h-4" fill={saved.has(outfit.id) ? "currentColor" : "none"} />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-foreground/80 text-background text-[9px] font-body font-medium px-2.5 py-1 rounded backdrop-blur-sm">
                      {outfit.style}
                    </span>
                  </div>
                </div>

                {/* Content below */}
                <div className="p-5">
                  {/* Title */}
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-heading text-base text-foreground">{outfit.title} {outfit.emoji}</h3>
                    {outfit.aiMatch && (
                      <span className="text-[10px] font-body font-medium text-accent flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> AI Match
                      </span>
                    )}
                  </div>

                  {/* AI comment */}
                  <div className="bg-accent/5 border border-accent/10 rounded-md px-3 py-2 mb-4">
                    <p className="text-[11px] font-body text-foreground/80 leading-relaxed line-clamp-2">
                      <span className="text-accent font-semibold">✨ AI:</span> {outfit.aiComment}
                    </p>
                  </div>

                  {/* Product list */}
                  <div className="space-y-3">
                    {outfit.products.map(p => (
                      <div key={p.name} className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-secondary shrink-0 overflow-hidden">
                          <img src={outfit.image} alt={p.name} className="w-full h-full object-cover opacity-70" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-[10px] font-body font-semibold ${platformColors[p.platform]?.text}`}>{p.platform}</span>
                            {p.badge && (
                              <span className={`text-[8px] font-body font-semibold px-1.5 py-0.5 rounded ${platformColors[p.platform]?.bg} ${platformColors[p.platform]?.text}`}>
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[12px] font-body font-medium text-foreground truncate">{p.name}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Star className="w-2.5 h-2.5 text-accent fill-accent" />
                            <span className="text-[10px] font-body text-foreground">{p.rating}</span>
                            <span className="text-[10px] font-body text-muted-foreground">· {p.sold} đã bán</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[12px] font-body font-bold text-accent">{p.price}</span>
                          {p.oldPrice && (
                            <span className="text-[10px] font-body text-muted-foreground line-through block">{p.oldPrice}</span>
                          )}
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => setLiked(s => { const n = new Set(s); const key = outfit.id * 100 + outfit.products.indexOf(p); n.has(key) ? n.delete(key) : n.add(key); return n; })}
                            className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-accent transition-colors">
                            <Heart className="w-3 h-3" />
                          </button>
                          <button className="p-1.5 rounded-md bg-accent text-accent-foreground">
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                    <p className="text-[12px] font-body text-foreground">
                      Ước tính: <span className="font-bold text-accent">{outfit.totalPrice}</span>
                    </p>
                    <Button variant="accent" size="sm" className="gap-1.5 text-[10px] rounded-full px-4 h-7">
                      Mua cả outfit 🛒
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommender;

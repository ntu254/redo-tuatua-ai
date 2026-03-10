import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";

const platformBadge: Record<string, string> = { Shopee: "bg-shopee", Lazada: "bg-lazada", Tiki: "bg-tiki" };

interface ChatMsg { role: "user" | "ai"; text: string; }

const sampleOutfits = [
  { id: 1, title: "Coffee Date Casual", image: casualImg, style: "Casual", occasion: "Cà phê",
    products: [
      { name: "Áo thun cotton trắng", price: "163.000đ", platform: "Shopee", rating: 4.8, brand: "YODY" },
      { name: "Quần jeans slim xanh nhạt", price: "389.000đ", platform: "Lazada", rating: 4.6, brand: "Routine" },
      { name: "Sneaker trắng cổ thấp", price: "329.000đ", platform: "Tiki", rating: 4.7, brand: "Ananas" },
    ]},
  { id: 2, title: "Office Elegance", image: officeImg, style: "Công sở", occasion: "Đi làm",
    products: [
      { name: "Áo sơ mi lụa trắng", price: "450.000đ", platform: "Lazada", rating: 4.9, brand: "IVY moda" },
      { name: "Quần âu đen ống đứng", price: "380.000đ", platform: "Shopee", rating: 4.5, brand: "Aristino" },
    ]},
  { id: 3, title: "Night Out Glam", image: partyImg, style: "Dạ tiệc", occasion: "Tiệc tối",
    products: [
      { name: "Đầm sequin vàng midi", price: "1.250.000đ", platform: "Shopee", rating: 4.8, brand: "Elise" },
      { name: "Clutch ánh kim bạc", price: "320.000đ", platform: "Lazada", rating: 4.4, brand: "Charles & Keith" },
    ]},
  { id: 4, title: "Street Style", image: streetImg, style: "Streetwear", occasion: "Đi chơi",
    products: [
      { name: "Hoodie oversize graphic", price: "420.000đ", platform: "Shopee", rating: 4.6, brand: "MLB" },
      { name: "Quần cargo xám", price: "350.000đ", platform: "Lazada", rating: 4.5, brand: "5S Fashion" },
    ]},
];

const Recommender = () => {
  const [chat, setChat] = useState<ChatMsg[]>([
    { role: "ai", text: "Xin chào! Mình là AI Stylist 👋 Hôm nay bạn muốn mặc đi đâu?" },
  ]);
  const [input, setInput] = useState("");
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const sendMsg = () => {
    if (!input.trim()) return;
    const msg = input.trim();
    setChat(c => [...c, { role: "user", text: msg }]);
    setInput("");
    setTimeout(() => {
      setChat(c => [...c, { role: "ai", text: `Tuyệt! Với "${msg}", mình đã chuẩn bị outfit bên phải cho bạn 🎨` }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 flex h-screen">
        {/* Chat sidebar */}
        <div className="w-full md:w-[360px] border-r border-border flex flex-col bg-background">
          <div className="p-6 border-b border-border">
            <p className="editorial-label mb-1">AI Stylist</p>
            <h2 className="font-heading text-xl italic text-foreground">Trò chuyện</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {chat.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] px-4 py-3 text-sm font-body leading-relaxed ${
                  m.role === "user" ? "bg-foreground text-background" : "bg-secondary text-foreground"
                }`}>{m.text}</div>
              </motion.div>
            ))}
          </div>
          <div className="p-4 border-t border-border">
            <div className="relative">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMsg()}
                placeholder="Bạn muốn mặc gì..."
                className="w-full bg-secondary border-0 px-4 py-3 pr-12 text-sm font-body focus:outline-none focus:ring-1 focus:ring-accent" />
              <button onClick={sendMsg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-2">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Outfit grid */}
        <div className="hidden md:block flex-1 overflow-y-auto">
          <div className="p-8 border-b border-border">
            <p className="editorial-label mb-1">Outfit gợi ý</p>
            <h2 className="font-heading text-2xl italic text-foreground">Phối đồ cho bạn</h2>
          </div>
          <div className="mag-grid grid-cols-2">
            {sampleOutfits.map(outfit => (
              <div key={outfit.id} className="editorial-card">
                <div className="relative mag-img-zoom aspect-[4/3]">
                  <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover" />
                  <button onClick={() => setLiked(s => { const n = new Set(s); n.has(outfit.id) ? n.delete(outfit.id) : n.add(outfit.id); return n; })}
                    className={`absolute top-3 right-3 p-2 bg-background/80 ${liked.has(outfit.id) ? "text-accent" : "text-muted-foreground"}`}>
                    <Heart className="w-4 h-4" fill={liked.has(outfit.id) ? "currentColor" : "none"} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex gap-1">
                    <span className="bg-background/90 text-foreground text-[9px] font-body font-medium px-3 py-1 uppercase tracking-wider">{outfit.style}</span>
                  </div>
                </div>
                <div className="p-5 border-t border-border">
                  <h3 className="font-heading text-lg italic text-foreground mb-3">{outfit.title}</h3>
                  <div className="space-y-2 border-t border-border pt-3">
                    {outfit.products.map(p => (
                      <div key={p.name} className="flex items-center justify-between gap-2 py-1">
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-body text-foreground truncate">{p.name}</p>
                          <span className="text-[11px] text-accent font-body font-semibold">{p.price}</span>
                          <span className="text-[10px] text-muted-foreground font-body ml-2">{p.brand}</span>
                        </div>
                        <span className={`${platformBadge[p.platform]} text-accent-foreground text-[8px] font-body font-semibold px-2 py-0.5 uppercase`}>{p.platform}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="accent" size="sm" className="w-full mt-3 gap-1 text-[10px]">
                    Mua outfit <ExternalLink className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommender;

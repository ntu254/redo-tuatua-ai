import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Heart, ExternalLink, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";

const platformBadge: Record<string, string> = {
  Shopee: "bg-shopee",
  Lazada: "bg-lazada",
  Tiki: "bg-tiki",
};

interface ChatMsg { role: "user" | "ai"; text: string; }

const sampleOutfits = [
  {
    id: 1, title: "Coffee Date Casual", image: casualImg, style: "Casual", occasion: "Đi cà phê",
    products: [
      { name: "Áo thun cotton trắng", price: "163.000đ", platform: "Shopee", rating: 4.8, brand: "YODY" },
      { name: "Quần jeans slim xanh nhạt", price: "389.000đ", platform: "Lazada", rating: 4.6, brand: "Routine" },
      { name: "Sneaker trắng cổ thấp", price: "329.000đ", platform: "Tiki", rating: 4.7, brand: "Ananas" },
    ],
  },
  {
    id: 2, title: "Office Elegance", image: officeImg, style: "Công sở", occasion: "Đi làm",
    products: [
      { name: "Áo sơ mi lụa trắng", price: "450.000đ", platform: "Lazada", rating: 4.9, brand: "IVY moda" },
      { name: "Quần âu đen ống đứng", price: "380.000đ", platform: "Shopee", rating: 4.5, brand: "Aristino" },
      { name: "Giày oxford nâu", price: "520.000đ", platform: "Tiki", rating: 4.7, brand: "Pierre Cardin" },
    ],
  },
  {
    id: 3, title: "Night Out Glam", image: partyImg, style: "Dạ tiệc", occasion: "Tiệc tối",
    products: [
      { name: "Đầm sequin vàng midi", price: "1.250.000đ", platform: "Shopee", rating: 4.8, brand: "Elise" },
      { name: "Clutch ánh kim bạc", price: "320.000đ", platform: "Lazada", rating: 4.4, brand: "Charles & Keith" },
    ],
  },
  {
    id: 4, title: "Street Style", image: streetImg, style: "Streetwear", occasion: "Đi chơi",
    products: [
      { name: "Hoodie oversize graphic", price: "420.000đ", platform: "Shopee", rating: 4.6, brand: "MLB" },
      { name: "Quần cargo xám", price: "350.000đ", platform: "Lazada", rating: 4.5, brand: "5S Fashion" },
    ],
  },
];

const initialChat: ChatMsg[] = [
  { role: "ai", text: "Xin chào! Mình là AI Stylist 👋 Hôm nay bạn muốn mặc đi đâu? Mình sẽ gợi ý outfit phù hợp nhất cho bạn." },
];

const Recommender = () => {
  const [chat, setChat] = useState<ChatMsg[]>(initialChat);
  const [input, setInput] = useState("");
  const [liked, setLiked] = useState<Set<number>>(new Set());

  const sendMsg = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setChat(c => [...c, { role: "user", text: userMsg }]);
    setInput("");
    setTimeout(() => {
      setChat(c => [...c, {
        role: "ai",
        text: `Tuyệt vời! Với "${userMsg}", mình đã chuẩn bị một số outfit phù hợp bên phải cho bạn. Hãy xem và chọn set nào ưng ý nhất nhé! 🎨`,
      }]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-[72px] flex h-[calc(100vh)]">
        {/* Sidebar chat */}
        <div className="w-full md:w-[380px] border-r border-border flex flex-col bg-card">
          <div className="p-5 border-b border-border">
            <h2 className="font-heading text-lg font-semibold italic text-foreground">AI Stylist</h2>
            <p className="text-xs text-muted-foreground font-body mt-1">Trò chuyện để nhận gợi ý outfit</p>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {chat.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm font-body leading-relaxed ${
                  m.role === "user"
                    ? "bg-accent text-accent-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                }`}>{m.text}</div>
              </motion.div>
            ))}
          </div>

          <div className="p-4 border-t border-border">
            <div className="relative">
              <input type="text" value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMsg()}
                placeholder="Hôm nay bạn muốn mặc gì..."
                className="w-full bg-background border border-border rounded-xl px-4 py-3 pr-12 text-sm font-body focus:outline-none focus:ring-2 focus:ring-accent/20" />
              <button onClick={sendMsg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-2 rounded-lg">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Outfit grid */}
        <div className="hidden md:block flex-1 overflow-y-auto p-8">
          <div className="mb-6">
            <p className="text-[11px] font-body uppercase tracking-[0.25em] text-muted-foreground mb-2">Outfit gợi ý</p>
            <h2 className="font-heading text-2xl font-semibold italic text-foreground">Phối đồ cho bạn</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {sampleOutfits.map((outfit) => (
              <motion.div key={outfit.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-card rounded-3xl border border-border overflow-hidden editorial-card">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={outfit.image} alt={outfit.title} className="w-full h-full object-cover" />
                  <button onClick={() => setLiked(s => { const n = new Set(s); n.has(outfit.id) ? n.delete(outfit.id) : n.add(outfit.id); return n; })}
                    className={`absolute top-3 right-3 p-2 rounded-full bg-card/80 backdrop-blur-sm ${liked.has(outfit.id) ? "text-rose" : "text-muted-foreground"}`}>
                    <Heart className="w-4 h-4" fill={liked.has(outfit.id) ? "currentColor" : "none"} />
                  </button>
                  <div className="absolute bottom-3 left-3 flex gap-2">
                    <span className="bg-card/90 backdrop-blur-sm text-foreground text-[10px] font-body font-medium px-3 py-1 rounded-full">{outfit.style}</span>
                    <span className="bg-card/90 backdrop-blur-sm text-foreground text-[10px] font-body font-medium px-3 py-1 rounded-full">{outfit.occasion}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground mb-3">{outfit.title}</h3>
                  <div className="space-y-2.5">
                    {outfit.products.map((p) => (
                      <div key={p.name} className="flex items-center justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-body text-foreground truncate">{p.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-accent font-body font-semibold">{p.price}</span>
                            <span className="text-[10px] text-muted-foreground font-body">{p.brand}</span>
                            <span className="flex items-center text-[10px] text-muted-foreground">
                              <Star className="w-2.5 h-2.5 fill-current text-amber-400 mr-0.5" />{p.rating}
                            </span>
                          </div>
                        </div>
                        <span className={`${platformBadge[p.platform]} text-accent-foreground text-[9px] font-body font-semibold px-2 py-0.5 rounded-full`}>{p.platform}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="accent" size="sm" className="w-full mt-4 rounded-full font-body text-xs gap-1">
                    Mua outfit này <ExternalLink className="w-3 h-3" />
                  </Button>
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

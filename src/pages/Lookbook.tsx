import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Bookmark, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import casualImg from "@/assets/style-casual.jpg";
import officeImg from "@/assets/style-office.jpg";
import partyImg from "@/assets/style-party.jpg";
import streetImg from "@/assets/style-streetwear.jpg";
import athleisureImg from "@/assets/style-athleisure.jpg";
import heroImg1 from "@/assets/hero-fashion-1.jpg";

const categories = ["Tất cả", "Đi học", "Đi làm", "Dạo phố", "Du lịch", "Hẹn hò", "Dự tiệc"];

const looks = [
  { id: 1, title: "Morning Coffee", concept: "Dạo phố", image: casualImg,
    desc: "Outfit nhẹ nhàng cho buổi sáng cà phê cuối tuần",
    palette: ["#F5DEB3","#6B8E23","#4682B4"],
    items: ["Áo thun cotton","Quần jeans","Sneaker trắng","Túi tote"] },
  { id: 2, title: "Office Ready", concept: "Đi làm", image: officeImg,
    desc: "Lịch sự, chuyên nghiệp nhưng không nhàm chán",
    palette: ["#1C1C1C","#F5F5F5","#B0C4DE"],
    items: ["Sơ mi lụa trắng","Quần âu đen","Oxford nâu","Đồng hồ bạc"] },
  { id: 3, title: "Evening Glamour", concept: "Dự tiệc", image: partyImg,
    desc: "Tỏa sáng trong buổi tiệc tối đặc biệt",
    palette: ["#FFD700","#8B0000","#000000"],
    items: ["Đầm sequin","Clutch bạc","Cao gót đen","Bông tai pha lê"] },
  { id: 4, title: "Urban Explorer", concept: "Dạo phố", image: streetImg,
    desc: "Cá tính đường phố cho ngày năng động",
    palette: ["#2F4F4F","#FF6347","#F0E68C"],
    items: ["Hoodie graphic","Cargo xám","Chunky sneaker","Bucket hat"] },
  { id: 5, title: "Weekend Active", concept: "Du lịch", image: athleisureImg,
    desc: "Khỏe khoắn, thoải mái cho kỳ nghỉ",
    palette: ["#000000","#FF1493","#00CED1"],
    items: ["Tank top dry-fit","Legging seamless","Training shoe","Bình nước"] },
  { id: 6, title: "Romantic Date", concept: "Hẹn hò", image: heroImg1,
    desc: "Nữ tính, duyên dáng cho buổi hẹn đáng nhớ",
    palette: ["#FF6B6B","#FFE4E1","#8B4513"],
    items: ["Đầm coral","Túi cói","Sandal da","Vòng tay vàng"] },
];

const Lookbook = () => {
  const [activeFilter, setActiveFilter] = useState(0);
  const [saved, setSaved] = useState<Set<number>>(new Set());

  const filtered = activeFilter === 0 ? looks : looks.filter(l => l.concept === categories[activeFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <p className="text-[11px] font-body uppercase tracking-[0.3em] text-muted-foreground mb-3">Lookbook</p>
            <h1 className="font-heading text-4xl md:text-5xl font-semibold italic text-foreground">
              Cảm hứng phối đồ
            </h1>
            <p className="text-muted-foreground font-body mt-3 text-sm max-w-md mx-auto">
              Các bộ outfit mẫu theo từng concept — lưu lại hoặc để AI tạo outfit tương tự
            </p>
            <div className="editorial-divider mx-auto mt-6" />
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {categories.map((c, i) => (
              <button key={c} onClick={() => setActiveFilter(i)}
                className={`px-5 py-2 rounded-full text-sm font-body font-medium transition-all ${
                  i === activeFilter ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}>{c}</button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((look, i) => (
              <motion.div key={look.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-card rounded-3xl border border-border overflow-hidden editorial-card group">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <img src={look.image} alt={look.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-foreground/60 to-transparent">
                    <span className="text-[10px] font-body uppercase tracking-wider text-background/70">{look.concept}</span>
                    <h3 className="font-heading text-xl font-semibold text-background italic">{look.title}</h3>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button onClick={() => setSaved(s => { const n=new Set(s); n.has(look.id)?n.delete(look.id):n.add(look.id); return n; })}
                      className={`p-2 rounded-full bg-card/80 backdrop-blur-sm transition-colors ${saved.has(look.id) ? "text-accent" : "text-muted-foreground"}`}>
                      <Bookmark className="w-4 h-4" fill={saved.has(look.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-muted-foreground font-body mb-4">{look.desc}</p>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">Palette</span>
                    {look.palette.map(c => <span key={c} className="w-4 h-4 rounded-full border border-border" style={{ backgroundColor: c }} />)}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {look.items.map(item => (
                      <span key={item} className="text-[10px] font-body bg-cream text-muted-foreground px-2.5 py-1 rounded-full">{item}</span>
                    ))}
                  </div>
                  <Button variant="accent" size="sm" className="w-full mt-4 rounded-full font-body text-xs gap-1">
                    Mua outfit này <ArrowRight className="w-3 h-3" />
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

export default Lookbook;

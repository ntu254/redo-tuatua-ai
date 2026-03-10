import { useState } from "react";
import { motion } from "framer-motion";
import { Bookmark, ArrowRight } from "lucide-react";
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
  { id: 1, title: "Morning Coffee", concept: "Dạo phố", image: casualImg, desc: "Outfit nhẹ nhàng cho buổi sáng cuối tuần",
    palette: ["#F5DEB3","#6B8E23","#4682B4"], items: ["Áo thun cotton","Quần jeans","Sneaker trắng","Túi tote"] },
  { id: 2, title: "Office Ready", concept: "Đi làm", image: officeImg, desc: "Chuyên nghiệp nhưng không nhàm chán",
    palette: ["#1C1C1C","#F5F5F5","#B0C4DE"], items: ["Sơ mi lụa","Quần âu đen","Oxford nâu","Đồng hồ bạc"] },
  { id: 3, title: "Evening Glamour", concept: "Dự tiệc", image: partyImg, desc: "Tỏa sáng trong tiệc tối",
    palette: ["#FFD700","#8B0000","#000000"], items: ["Đầm sequin","Clutch bạc","Cao gót đen","Bông tai"] },
  { id: 4, title: "Urban Explorer", concept: "Dạo phố", image: streetImg, desc: "Cá tính cho ngày năng động",
    palette: ["#2F4F4F","#FF6347","#F0E68C"], items: ["Hoodie graphic","Cargo xám","Chunky sneaker","Bucket hat"] },
  { id: 5, title: "Weekend Active", concept: "Du lịch", image: athleisureImg, desc: "Khỏe khoắn cho kỳ nghỉ",
    palette: ["#000000","#FF1493","#00CED1"], items: ["Tank top","Legging","Training shoe","Bình nước"] },
  { id: 6, title: "Romantic Date", concept: "Hẹn hò", image: heroImg1, desc: "Nữ tính cho buổi hẹn đáng nhớ",
    palette: ["#FF6B6B","#FFE4E1","#8B4513"], items: ["Đầm coral","Túi cói","Sandal da","Vòng tay"] },
];

const Lookbook = () => {
  const [activeFilter, setActiveFilter] = useState(0);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const filtered = activeFilter === 0 ? looks : looks.filter(l => l.concept === categories[activeFilter]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="border-b border-border px-6 py-12 text-center">
          <p className="editorial-label mb-3">Lookbook</p>
          <h1 className="font-heading text-4xl md:text-5xl font-light text-foreground">
            Cảm hứng <span className="italic">phối đồ</span>
          </h1>
          <p className="text-muted-foreground font-body mt-3 text-sm max-w-md mx-auto">
            Outfit mẫu theo concept — lưu lại hoặc để AI tạo tương tự
          </p>
        </div>

        <div className="border-b border-border flex flex-wrap justify-center">
          {categories.map((c, i) => (
            <button key={c} onClick={() => setActiveFilter(i)}
              className={`px-6 py-4 text-[11px] font-body font-medium tracking-[0.2em] uppercase transition-all border-r border-border last:border-r-0 ${
                i === activeFilter ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}>{c}</button>
          ))}
        </div>

        <div className="mag-grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((look, i) => (
            <motion.div key={look.id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="editorial-card group">
              <div className="relative mag-img-zoom aspect-[3/4]">
                <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-foreground/50 to-transparent">
                  <p className="text-[9px] font-body uppercase tracking-[0.3em] text-background/60">{look.concept}</p>
                  <h3 className="font-heading text-2xl italic text-background">{look.title}</h3>
                </div>
                <button onClick={() => setSaved(s => { const n=new Set(s); n.has(look.id)?n.delete(look.id):n.add(look.id); return n; })}
                  className={`absolute top-4 right-4 p-2 bg-background/80 ${saved.has(look.id) ? "text-accent" : "text-muted-foreground"}`}>
                  <Bookmark className="w-4 h-4" fill={saved.has(look.id) ? "currentColor" : "none"} />
                </button>
              </div>
              <div className="p-5 border-t border-border">
                <p className="text-xs text-muted-foreground font-body mb-3">{look.desc}</p>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[9px] font-body text-muted-foreground uppercase tracking-wider">Palette</span>
                  {look.palette.map(c => <span key={c} className="w-4 h-4 border border-border" style={{ backgroundColor: c }} />)}
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {look.items.map(item => (
                    <span key={item} className="text-[9px] font-body bg-secondary text-muted-foreground px-2.5 py-1 uppercase tracking-wider">{item}</span>
                  ))}
                </div>
                <Button variant="accent" size="sm" className="w-full gap-1 text-[10px]">
                  Mua outfit <ArrowRight className="w-3 h-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Lookbook;

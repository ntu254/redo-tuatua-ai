import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Heart, Upload, Shirt, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";

const tabs = ["Tủ đồ", "Outfit đã lưu", "Yêu thích", "Hồ sơ AI"];

const myItems = [
  { id: 1, name: "Áo thun trắng basic", category: "Áo", color: "#FFFFFF" },
  { id: 2, name: "Quần jeans xanh đậm", category: "Quần", color: "#1C3A5F" },
  { id: 3, name: "Áo sơ mi lụa hồng", category: "Áo", color: "#F4A0A0" },
  { id: 4, name: "Quần âu đen", category: "Quần", color: "#1A1A1A" },
  { id: 5, name: "Giày sneaker trắng", category: "Giày", color: "#F5F5F5" },
  { id: 6, name: "Túi tote canvas", category: "Phụ kiện", color: "#D2B48C" },
  { id: 7, name: "Áo hoodie xám", category: "Áo", color: "#808080" },
  { id: 8, name: "Váy midi hoa", category: "Váy", color: "#FFB6C1" },
];

const styleProfile = [
  { label: "Thanh lịch", score: 82 },
  { label: "Cá tính", score: 65 },
  { label: "Tối giản", score: 90 },
  { label: "Nổi bật", score: 45 },
  { label: "Linh hoạt", score: 78 },
  { label: "Seasonal", score: 60 },
];

const Wardrobe = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        {/* Header */}
        <div className="border-b border-border px-6 py-12">
          <div className="container mx-auto max-w-5xl">
            <p className="editorial-label mb-3">Tủ đồ cá nhân</p>
            <h1 className="font-heading text-4xl font-light text-foreground">
              Tủ đồ <span className="italic">của bạn</span>
            </h1>
          </div>
        </div>

        {/* Tabs — editorial strip */}
        <div className="border-b border-border flex overflow-x-auto">
          {tabs.map((t, i) => (
            <button key={t} onClick={() => setActiveTab(i)}
              className={`px-8 py-4 text-[11px] font-body font-medium tracking-[0.2em] uppercase transition-all border-r border-border ${
                i === activeTab ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}>{t}</button>
          ))}
        </div>

        <div className="container mx-auto max-w-5xl px-6 py-10">
          {activeTab === 0 && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm font-body text-muted-foreground">{myItems.length} items</p>
                <Button variant="accent" size="sm" className="gap-2"><Plus className="w-3 h-3" /> Thêm đồ</Button>
              </div>
              <div className="mag-grid grid-cols-2 md:grid-cols-4">
                {myItems.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-5 editorial-card cursor-pointer">
                    <div className="aspect-square bg-secondary mb-4 flex items-center justify-center">
                      <Shirt className="w-8 h-8 text-muted-foreground/20" strokeWidth={1} />
                    </div>
                    <p className="text-sm font-body font-medium text-foreground truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="w-3 h-3 border border-border" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">{item.category}</span>
                    </div>
                  </motion.div>
                ))}
                <div className="border border-dashed border-border p-5 flex flex-col items-center justify-center cursor-pointer hover:border-accent transition-colors">
                  <Upload className="w-6 h-6 text-muted-foreground/30 mb-2" strokeWidth={1} />
                  <p className="text-[10px] text-muted-foreground font-body text-center uppercase tracking-wider">Upload ảnh</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="text-center py-24">
              <Heart className="w-10 h-10 text-border mx-auto mb-4" strokeWidth={1} />
              <p className="text-muted-foreground font-body text-sm">Chưa có outfit nào được lưu</p>
              <Button variant="accent" size="sm" className="mt-6">Xem gợi ý outfit</Button>
            </div>
          )}

          {activeTab === 2 && (
            <div className="text-center py-24">
              <Heart className="w-10 h-10 text-accent/20 mx-auto mb-4" strokeWidth={1} />
              <p className="text-muted-foreground font-body text-sm">Danh sách yêu thích trống</p>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-8">
              <div className="border border-border p-8">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-4 h-4 text-accent" />
                  <p className="editorial-label">Biểu đồ phong cách AI</p>
                </div>
                <div className="mag-grid grid-cols-1 md:grid-cols-2 gap-0">
                  {styleProfile.map(s => (
                    <div key={s.label} className="py-4 px-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-body text-foreground">{s.label}</span>
                        <span className="text-sm font-heading italic text-accent">{s.score}%</span>
                      </div>
                      <div className="h-px bg-border relative">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }}
                          transition={{ duration: 1, delay: 0.3 }} className="h-px bg-accent absolute top-0 left-0" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-light p-8 border border-border">
                <p className="editorial-label mb-4">Nhận xét từ AI</p>
                <p className="text-sm text-foreground/80 font-body leading-relaxed">
                  Phong cách của bạn nghiêng về <strong>tối giản và thanh lịch</strong>. Bạn ưa chuộng tông màu trung tính
                  và thường chọn outfit phù hợp cho công sở lẫn đi chơi. AI gợi ý thử thêm <em>smart casual</em> để đa dạng hơn.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wardrobe;

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
      <div className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-[11px] font-body uppercase tracking-[0.3em] text-muted-foreground mb-3">Tủ đồ cá nhân</p>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold italic text-foreground">
              Tủ đồ của bạn
            </h1>
            <div className="editorial-divider mt-4" />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-10 overflow-x-auto">
            {tabs.map((t, i) => (
              <button key={t} onClick={() => setActiveTab(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-body font-medium transition-all whitespace-nowrap ${
                  i === activeTab ? "bg-foreground text-background" : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}>{t}</button>
            ))}
          </div>

          {activeTab === 0 && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-body text-muted-foreground">{myItems.length} items</p>
                <Button variant="accent" size="sm" className="rounded-full font-body gap-2 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Thêm đồ
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {myItems.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl border border-border p-4 editorial-card cursor-pointer">
                    <div className="aspect-square rounded-xl bg-cream mb-3 flex items-center justify-center">
                      <Shirt className="w-10 h-10 text-muted-foreground/30" strokeWidth={1} />
                    </div>
                    <p className="text-sm font-body font-medium text-foreground truncate">{item.name}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: item.color }} />
                      <span className="text-xs text-muted-foreground font-body">{item.category}</span>
                    </div>
                  </motion.div>
                ))}
                {/* Add new item card */}
                <div className="bg-cream/50 border-2 border-dashed border-border rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer hover:border-accent/40 transition-colors min-h-[200px]">
                  <Upload className="w-8 h-8 text-muted-foreground/40 mb-2" strokeWidth={1} />
                  <p className="text-xs text-muted-foreground font-body text-center">Upload ảnh hoặc thêm item mới</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="text-center py-20">
              <Heart className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" strokeWidth={1} />
              <p className="text-muted-foreground font-body">Bạn chưa lưu outfit nào. Hãy khám phá và lưu outfit yêu thích!</p>
              <Button variant="accent" size="sm" className="rounded-full font-body mt-4">Xem gợi ý outfit</Button>
            </div>
          )}

          {activeTab === 2 && (
            <div className="text-center py-20">
              <Heart className="w-12 h-12 text-rose/30 mx-auto mb-4" strokeWidth={1} />
              <p className="text-muted-foreground font-body">Danh sách yêu thích trống. Thêm sản phẩm bạn thích!</p>
            </div>
          )}

          {activeTab === 3 && (
            <div>
              <div className="bg-card rounded-3xl border border-border p-8 mb-8">
                <div className="flex items-center gap-3 mb-8">
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <h3 className="font-heading text-lg font-semibold text-foreground">Biểu đồ phong cách AI</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {styleProfile.map((s) => (
                    <div key={s.label}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-body text-foreground">{s.label}</span>
                        <span className="text-sm font-body font-semibold text-accent">{s.score}%</span>
                      </div>
                      <div className="h-2 bg-cream rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${s.score}%` }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className="h-full bg-accent rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-peach-light rounded-3xl p-8">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-3">Nhận xét từ AI</h3>
                <p className="text-sm text-muted-foreground font-body leading-relaxed">
                  Phong cách của bạn nghiêng về <strong>tối giản và thanh lịch</strong>. Bạn ưa chuộng tông màu trung tính
                  và thường chọn outfit phù hợp cho công sở lẫn đi chơi. AI gợi ý bạn thử thêm phong cách <em>smart casual</em> để
                  tạo sự đa dạng mà vẫn giữ nét tinh tế.
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

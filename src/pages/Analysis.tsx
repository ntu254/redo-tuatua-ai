import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Palette, Ruler, Layers, Shirt, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";

const Analysis = () => {
  const [uploaded, setUploaded] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(false);

  const handleUpload = () => {
    setUploaded(true); setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setResult(true); }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <div className="border-b border-border px-6 py-12 text-center">
          <p className="editorial-label mb-3">AI Analysis</p>
          <h1 className="font-heading text-4xl font-light text-foreground">
            Phân tích outfit <span className="italic">từ ảnh</span>
          </h1>
          <p className="text-muted-foreground font-body mt-3 text-sm max-w-md mx-auto">
            Upload ảnh trang phục — AI phân tích màu sắc, kiểu dáng, chất liệu và gợi ý phối đồ
          </p>
        </div>

        <div className="container mx-auto max-w-4xl px-6 py-12">
          {!uploaded ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-lg mx-auto">
              <div onClick={handleUpload}
                className="border border-dashed border-border p-20 text-center cursor-pointer hover:border-accent transition-all editorial-card">
                <Upload className="w-10 h-10 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
                <p className="font-heading text-xl italic text-foreground mb-2">Kéo thả hoặc chọn ảnh</p>
                <p className="text-[10px] text-muted-foreground font-body uppercase tracking-wider">JPG, PNG · Tối đa 10MB</p>
              </div>
            </motion.div>
          ) : analyzing ? (
            <div className="text-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-10 h-10 border border-accent border-t-transparent mx-auto mb-6" />
              <p className="font-heading text-xl italic text-foreground">Đang phân tích...</p>
            </div>
          ) : result ? (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mag-grid grid-cols-1 md:grid-cols-2 mb-8">
                <div className="bg-secondary aspect-square flex items-center justify-center">
                  <Shirt className="w-16 h-16 text-muted-foreground/15" strokeWidth={1} />
                </div>
                <div className="p-8 md:p-10 space-y-0 border-t md:border-t-0 border-border">
                  <p className="editorial-label mb-6">Kết quả</p>
                  {[
                    { icon: Palette, label: "Màu sắc", value: "Beige chủ đạo, tone ấm", colors: ["#D2B48C","#F5DEB3","#8B7355"] },
                    { icon: Layers, label: "Chất liệu", value: "Cotton pha linen, thoáng mát" },
                    { icon: Ruler, label: "Kiểu dáng", value: "Oversized, dáng suông, cổ tròn" },
                    { icon: Sparkles, label: "Phong cách", value: "Casual minimalist" },
                  ].map(item => (
                    <div key={item.label} className="py-4 border-b border-border">
                      <div className="flex items-center gap-2 mb-1">
                        <item.icon className="w-3.5 h-3.5 text-accent" />
                        <span className="text-[10px] font-body font-medium uppercase tracking-wider text-muted-foreground">{item.label}</span>
                      </div>
                      <p className="text-sm font-body text-foreground">{item.value}</p>
                      {"colors" in item && item.colors && (
                        <div className="flex gap-2 mt-2">
                          {item.colors.map(c => <span key={c} className="w-4 h-4 border border-border" style={{ backgroundColor: c }} />)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-light border border-border p-8">
                <p className="editorial-label mb-4">Gợi ý phối đồ từ AI</p>
                <div className="space-y-2 font-body text-sm text-foreground/80">
                  <p>✅ Kết hợp với <strong>quần jeans xanh đậm</strong> hoặc <strong>quần âu kem</strong></p>
                  <p>✅ Thêm <strong>blazer nhẹ tông nâu</strong> → smart casual</p>
                  <p>⚠️ Tránh mix với tông neon hoặc họa tiết lớn</p>
                </div>
                <Button variant="accent" size="sm" className="mt-6 gap-2">
                  Xem outfit gợi ý <ArrowRight className="w-3 h-3" />
                </Button>
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" onClick={() => { setUploaded(false); setResult(false); }}>Phân tích ảnh khác</Button>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Analysis;

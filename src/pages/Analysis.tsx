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
    setUploaded(true);
    setAnalyzing(true);
    setTimeout(() => { setAnalyzing(false); setResult(true); }, 2500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-14">
            <p className="text-[11px] font-body uppercase tracking-[0.3em] text-muted-foreground mb-3">AI Analysis</p>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold italic text-foreground">
              Phân tích outfit từ ảnh
            </h1>
            <p className="text-muted-foreground font-body mt-3 max-w-md mx-auto text-sm">
              Upload ảnh trang phục — AI sẽ phân tích màu sắc, kiểu dáng, chất liệu và gợi ý phối đồ
            </p>
            <div className="editorial-divider mx-auto mt-6" />
          </div>

          {!uploaded ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="max-w-lg mx-auto">
              <div onClick={handleUpload}
                className="border-2 border-dashed border-border rounded-3xl p-16 text-center cursor-pointer hover:border-accent/40 transition-all bg-card editorial-card">
                <Upload className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" strokeWidth={1} />
                <p className="font-heading text-lg font-semibold text-foreground mb-2">Kéo thả hoặc chọn ảnh</p>
                <p className="text-sm text-muted-foreground font-body">JPG, PNG · Tối đa 10MB</p>
              </div>
            </motion.div>
          ) : analyzing ? (
            <div className="max-w-lg mx-auto text-center py-16">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full mx-auto mb-6" />
              <p className="font-heading text-lg font-semibold text-foreground italic">AI đang phân tích...</p>
              <p className="text-sm text-muted-foreground font-body mt-2">Nhận diện màu sắc, kiểu dáng và chất liệu</p>
            </div>
          ) : result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Image preview */}
                <div className="bg-cream rounded-3xl aspect-square flex items-center justify-center">
                  <Shirt className="w-20 h-20 text-muted-foreground/20" strokeWidth={1} />
                </div>

                {/* Analysis result */}
                <div className="space-y-5">
                  <h3 className="font-heading text-xl font-semibold text-foreground">Kết quả phân tích</h3>

                  {[
                    { icon: Palette, label: "Màu sắc", value: "Beige chủ đạo, tone ấm", colors: ["#D2B48C","#F5DEB3","#8B7355"] },
                    { icon: Layers, label: "Chất liệu", value: "Cotton pha linen, thoáng mát" },
                    { icon: Ruler, label: "Kiểu dáng", value: "Oversized, dáng suông, cổ tròn" },
                    { icon: Sparkles, label: "Phong cách", value: "Casual minimalist, phù hợp nhiều dịp" },
                  ].map((item) => (
                    <div key={item.label} className="bg-card rounded-2xl border border-border p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <item.icon className="w-4 h-4 text-accent" />
                        <span className="text-xs font-body font-medium uppercase tracking-wider text-muted-foreground">{item.label}</span>
                      </div>
                      <p className="text-sm font-body text-foreground">{item.value}</p>
                      {"colors" in item && item.colors && (
                        <div className="flex gap-2 mt-2">
                          {item.colors.map(c => <span key={c} className="w-5 h-5 rounded-full border border-border" style={{ backgroundColor: c }} />)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-sage-light rounded-3xl p-8">
                <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Gợi ý phối đồ từ AI</h3>
                <div className="space-y-3 font-body text-sm text-foreground/80">
                  <p>✅ Kết hợp với <strong>quần jeans xanh đậm</strong> hoặc <strong>quần âu kem</strong> để tạo outfit casual.</p>
                  <p>✅ Thêm <strong>blazer nhẹ tông nâu</strong> sẽ nâng cấp thành smart casual cho công sở.</p>
                  <p>⚠️ Tránh mix với tông neon hoặc họa tiết lớn — sẽ mất đi nét minimalist.</p>
                </div>
                <Button variant="accent" size="sm" className="rounded-full font-body mt-6 gap-2">
                  Xem outfit gợi ý <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>

              <div className="text-center">
                <Button variant="hero-outline" onClick={() => { setUploaded(false); setResult(false); }}
                  className="font-body">
                  Phân tích ảnh khác
                </Button>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Analysis;

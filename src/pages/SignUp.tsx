import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, ArrowLeft, Check } from "lucide-react";

import styleMinimal from "@/assets/style-minimal-new.jpg";
import styleCasual from "@/assets/style-casual-new.jpg";
import styleStreet from "@/assets/style-streetwear-new.jpg";
import styleOffice from "@/assets/style-office-new.jpg";
import styleParty from "@/assets/style-party-new.jpg";
import styleAthleisure from "@/assets/style-athleisure-new.jpg";

const TOTAL_STEPS = 5;

const styles = [
  { name: "Minimal", img: styleMinimal },
  { name: "Casual", img: styleCasual },
  { name: "Streetwear", img: styleStreet },
  { name: "Office", img: styleOffice },
  { name: "Quiet Luxury", img: styleParty },
  { name: "Athleisure", img: styleAthleisure },
];

const colors = [
  { name: "Trắng", hex: "#FFFFFF" },
  { name: "Be", hex: "#F5F0E8" },
  { name: "Đen", hex: "#1C1C1C" },
  { name: "Navy", hex: "#1B2A4A" },
  { name: "Sage Green", hex: "#9CAF88" },
  { name: "Earth", hex: "#8B7355" },
];

const occasions = [
  { name: "Đi làm", emoji: "💼" },
  { name: "Hàng ngày", emoji: "☕" },
  { name: "Hẹn hò", emoji: "💕" },
  { name: "Du lịch", emoji: "✈️" },
  { name: "Tập gym", emoji: "🏋️" },
  { name: "Tiệc tùng", emoji: "🎉" },
];

const budgets = [
  { label: "Dưới 500K", range: "< 500.000đ" },
  { label: "500K – 1 Triệu", range: "500K – 1M" },
  { label: "1 – 3 Triệu", range: "1M – 3M" },
  { label: "Cao cấp", range: "3M+" },
];

const SignUp = () => {
  const [step, setStep] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState("");

  const toggle = (arr: string[], val: string, setter: (v: string[]) => void) => {
    setter(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
  };

  const next = () => step < TOTAL_STEPS && setStep(step + 1);
  const prev = () => step > 1 && setStep(step - 1);

  const slideVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-heading text-lg font-semibold text-foreground">StyleAI</span>
        </div>
        <Link to="/login" className="text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
          Đã có tài khoản? Đăng nhập
        </Link>
      </div>

      {/* Progress */}
      <div className="px-6 py-4 border-b border-border">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="editorial-label">Bước {step} / {TOTAL_STEPS}</span>
            <span className="text-[11px] font-body text-muted-foreground">{Math.round((step / TOTAL_STEPS) * 100)}%</span>
          </div>
          <Progress value={(step / TOTAL_STEPS) * 100} className="h-1 bg-secondary [&>div]:bg-accent" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {/* Step 1: Account */}
              {step === 1 && (
                <div className="max-w-sm mx-auto">
                  <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Tạo tài khoản</h1>
                  <p className="text-muted-foreground font-body text-sm mb-8">Bắt đầu hành trình thời trang AI của bạn.</p>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Tên hiển thị</Label>
                      <Input placeholder="Tên của bạn" className="h-12 font-body" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                      <Input type="email" placeholder="you@example.com" className="h-12 font-body" />
                    </div>
                    <div className="space-y-2">
                      <Label className="font-body text-xs uppercase tracking-wider text-muted-foreground">Mật khẩu</Label>
                      <Input type="password" placeholder="••••••••" className="h-12 font-body" />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Styles */}
              {step === 2 && (
                <div>
                  <div className="text-center mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Chọn phong cách yêu thích</h1>
                    <p className="text-muted-foreground font-body text-sm">Chọn nhiều phong cách để AI hiểu bạn hơn.</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {styles.map((s) => (
                      <motion.button
                        key={s.name}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggle(selectedStyles, s.name, setSelectedStyles)}
                        className={`relative group overflow-hidden border transition-all ${
                          selectedStyles.includes(s.name)
                            ? "border-accent ring-2 ring-accent/20"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div className="aspect-[3/4] overflow-hidden">
                          <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                          <span className="text-background text-sm font-body font-semibold">{s.name}</span>
                          {selectedStyles.includes(s.name) && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-6 h-6 bg-accent flex items-center justify-center"
                            >
                              <Check className="w-3.5 h-3.5 text-accent-foreground" />
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Colors */}
              {step === 3 && (
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Bảng màu yêu thích</h1>
                    <p className="text-muted-foreground font-body text-sm">Chọn những tông màu bạn thường mặc.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {colors.map((c) => (
                      <motion.button
                        key={c.name}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => toggle(selectedColors, c.name, setSelectedColors)}
                        className={`p-4 border text-center transition-all ${
                          selectedColors.includes(c.name)
                            ? "border-accent ring-2 ring-accent/20"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div
                          className="w-12 h-12 mx-auto mb-3 border border-border"
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-sm font-body font-medium text-foreground">{c.name}</span>
                        {selectedColors.includes(c.name) && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 flex justify-center">
                            <div className="w-5 h-5 bg-accent flex items-center justify-center">
                              <Check className="w-3 h-3 text-accent-foreground" />
                            </div>
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Occasions */}
              {step === 4 && (
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Dịp mặc đồ</h1>
                    <p className="text-muted-foreground font-body text-sm">Bạn thường cần outfit cho dịp nào?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {occasions.map((o) => (
                      <motion.button
                        key={o.name}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => toggle(selectedOccasions, o.name, setSelectedOccasions)}
                        className={`p-5 border text-left transition-all ${
                          selectedOccasions.includes(o.name)
                            ? "border-accent bg-coral-light"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <span className="text-2xl mb-2 block">{o.emoji}</span>
                        <span className="text-sm font-body font-semibold text-foreground">{o.name}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 5: Budget */}
              {step === 5 && (
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-8">
                    <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Ngân sách mua sắm</h1>
                    <p className="text-muted-foreground font-body text-sm">Giúp AI gợi ý sản phẩm phù hợp túi tiền.</p>
                  </div>
                  <div className="space-y-3">
                    {budgets.map((b) => (
                      <motion.button
                        key={b.label}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedBudget(b.label)}
                        className={`w-full p-5 border text-left flex items-center justify-between transition-all ${
                          selectedBudget === b.label
                            ? "border-accent bg-coral-light"
                            : "border-border hover:border-muted-foreground/30"
                        }`}
                      >
                        <div>
                          <span className="text-sm font-body font-semibold text-foreground block">{b.label}</span>
                          <span className="text-xs font-body text-muted-foreground">{b.range}</span>
                        </div>
                        {selectedBudget === b.label && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-accent flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-accent-foreground" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-10 max-w-sm mx-auto">
            {step > 1 ? (
              <Button variant="outline" onClick={prev} className="gap-2 font-body">
                <ArrowLeft className="w-4 h-4" /> Quay lại
              </Button>
            ) : (
              <div />
            )}
            {step < TOTAL_STEPS ? (
              <Button variant="accent" onClick={next} className="gap-2 font-body">
                Tiếp tục <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Link to="/profile">
                <Button variant="accent" className="gap-2 font-body">
                  <Sparkles className="w-4 h-4" /> Bắt đầu phối đồ
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles, Zap, Palette, ShoppingBag, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, Link } from "react-router-dom";

import styleMinimal from "@/assets/style-minimal-new.jpg";
import styleCasual from "@/assets/style-casual-new.jpg";
import styleStreet from "@/assets/style-streetwear-new.jpg";
import styleOffice from "@/assets/style-office-new.jpg";
import styleParty from "@/assets/style-party-new.jpg";
import styleAthleisure from "@/assets/style-athleisure-new.jpg";
import lookbook1 from "@/assets/lookbook-1.jpg";
import lookbook2 from "@/assets/lookbook-2.jpg";
import heroImg from "@/assets/hero-fashion-2.jpg";

/* ── Data ── */

const genderOptions = [
  { value: "female", label: "Nữ", emoji: "👩", desc: "Thời trang nữ" },
  { value: "male", label: "Nam", emoji: "👨", desc: "Thời trang nam" },
  { value: "lgbtq", label: "LGBTQ+", emoji: "🏳️‍🌈", desc: "Phong cách tự do" },
  { value: "skip", label: "Bỏ qua", emoji: "✦", desc: "Không muốn nói" },
];

const styleOptions = [
  { value: "minimal", label: "Tối giản", img: styleMinimal },
  { value: "casual", label: "Casual", img: styleCasual },
  { value: "streetwear", label: "Streetwear", img: styleStreet },
  { value: "office", label: "Office", img: styleOffice },
  { value: "party", label: "Dự tiệc", img: styleParty },
  { value: "athleisure", label: "Athleisure", img: styleAthleisure },
];

const occasionOptions = [
  { value: "school", label: "Đi học", emoji: "📚" },
  { value: "work", label: "Đi làm", emoji: "💼" },
  { value: "hangout", label: "Đi chơi", emoji: "☕" },
  { value: "party", label: "Dự tiệc", emoji: "🎉" },
  { value: "travel", label: "Du lịch", emoji: "✈️" },
  { value: "date", label: "Hẹn hò", emoji: "💕" },
];

const budgetOptions = [
  { value: "low", label: "Dưới 200K", desc: "Tiết kiệm", icon: "•" },
  { value: "mid", label: "200K – 500K", desc: "Phổ thông", icon: "••" },
  { value: "high", label: "500K – 1tr", desc: "Trung cấp", icon: "•••" },
  { value: "premium", label: "Trên 1 triệu", desc: "Cao cấp", icon: "••••" },
];

const colorOptions = [
  { value: "white", label: "Trắng", hex: "#FFFFFF" },
  { value: "beige", label: "Be", hex: "#F5F0E8" },
  { value: "black", label: "Đen", hex: "#1C1C1C" },
  { value: "navy", label: "Navy", hex: "#1B2A4A" },
  { value: "sage", label: "Sage", hex: "#9CAF88" },
  { value: "earth", label: "Earth", hex: "#8B7355" },
  { value: "blush", label: "Hồng", hex: "#E8B4B8" },
  { value: "denim", label: "Denim", hex: "#6B8DAD" },
];

const TOTAL_STEPS = 5;

type Phase = "welcome" | "quiz" | "analyzing" | "result";

/* ── Shared ── */

const pageTransition = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -24 },
  transition: { duration: 0.35, ease: "easeOut" },
};

/* ── Welcome Screen ── */

const WelcomeScreen = ({ onStart }: { onStart: () => void }) => (
  <motion.div {...pageTransition} className="h-screen flex overflow-hidden">
    {/* Left visual */}
    <div className="hidden lg:block lg:w-1/2 relative">
      <motion.img
        src={heroImg}
        alt="Fashion"
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />

      <div className="absolute bottom-12 left-12 right-12 z-10">
        <div className="flex gap-2 mb-4">
          {["AI-Powered", "Personal", "Fashion"].map(t => (
            <span key={t} className="px-3 py-1 bg-background/10 backdrop-blur-sm border border-background/20 text-background text-[10px] font-body font-semibold uppercase tracking-wider">
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>

    {/* Right content */}
    <div className="flex-1 flex flex-col items-center justify-center px-8 bg-background">
      <motion.div
        className="max-w-md text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-10">
          <Sparkles className="w-6 h-6 text-accent" />
          <span className="font-heading text-2xl font-semibold text-foreground">StyleAI</span>
        </div>

        <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-4 leading-tight">
          Khám phá phong cách
          <br />
          thời trang của bạn
        </h1>
        <p className="text-foreground/50 font-body text-sm mb-10 max-w-sm mx-auto leading-relaxed">
          Trả lời 5 câu hỏi nhanh để AI tạo hồ sơ phong cách cá nhân và gợi ý outfit phù hợp nhất.
        </p>

        <div className="flex flex-col items-center gap-4">
          <Button variant="accent" size="lg" className="gap-2 font-body font-semibold px-10" onClick={onStart}>
            Bắt đầu <ArrowRight className="w-4 h-4" />
          </Button>
          <span className="text-[11px] font-body text-foreground/30">Chỉ mất khoảng 1 phút</span>
        </div>

        <div className="flex items-center justify-center gap-8 mt-14">
          {[
            { icon: Zap, label: "AI phân tích" },
            { icon: Palette, label: "Bảng màu riêng" },
            { icon: TrendingUp, label: "Gợi ý outfit" },
          ].map(f => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <f.icon className="w-4 h-4 text-foreground/25" />
              <span className="text-[10px] font-body text-foreground/35 uppercase tracking-wider">{f.label}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

/* ── Analyzing Screen ── */

const AnalyzingScreen = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState("Phân tích sở thích...");

  useEffect(() => {
    const labels = [
      "Phân tích sở thích...",
      "Xác định bảng màu...",
      "Tạo hồ sơ phong cách...",
      "Gợi ý outfit đầu tiên...",
    ];
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setProgress(Math.min(i * 28, 100));
      if (i < labels.length) setLabel(labels[i]);
      if (i >= 4) { clearInterval(interval); setTimeout(onDone, 400); }
    }, 600);
    return () => clearInterval(interval);
  }, [onDone]);

  return (
    <motion.div {...pageTransition} className="h-screen flex items-center justify-center bg-background">
      <div className="text-center max-w-sm px-6">
        <motion.div
          className="w-20 h-20 border border-accent/30 flex items-center justify-center mx-auto mb-8"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-accent" />
        </motion.div>

        <h2 className="font-heading text-2xl font-semibold text-foreground mb-2">AI đang phân tích</h2>
        <p className="text-foreground/50 font-body text-sm mb-8">{label}</p>

        <div className="max-w-xs mx-auto">
          <Progress value={progress} className="h-1 bg-secondary [&>div]:bg-accent [&>div]:transition-all [&>div]:duration-500" />
          <p className="text-[11px] font-body text-foreground/30 mt-3">{progress}%</p>
        </div>
      </div>
    </motion.div>
  );
};

/* ── Result Screen ── */

const ResultScreen = () => {
  const navigate = useNavigate();

  return (
    <motion.div {...pageTransition} className="h-screen flex overflow-hidden">
      {/* Left — style preview */}
      <div className="hidden lg:block lg:w-2/5 relative">
        <img src={lookbook1} alt="Style preview" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 z-10">
          <p className="text-[10px] font-body font-semibold text-background/60 uppercase tracking-widest mb-2">Phong cách của bạn</p>
          <h3 className="font-heading text-3xl font-semibold text-background">Urban Minimalist</h3>
        </div>
      </div>

      {/* Right — profile result */}
      <div className="flex-1 flex items-center justify-center px-8 bg-background">
        <motion.div
          className="max-w-md w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 border border-accent flex items-center justify-center">
              <Check className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-[10px] font-body font-semibold text-accent uppercase tracking-widest">Hoàn tất</p>
              <p className="font-heading text-lg font-semibold text-foreground">Hồ sơ phong cách đã sẵn sàng</p>
            </div>
          </div>

          {/* Style tags */}
          <div className="border border-border p-5 mb-4">
            <p className="text-[10px] font-body font-semibold text-foreground/40 uppercase tracking-widest mb-3">Phong cách chính</p>
            <div className="flex flex-wrap gap-2">
              {["Tối giản", "Casual", "Office"].map(s => (
                <span key={s} className="px-3 py-1.5 bg-secondary text-foreground text-xs font-body font-semibold">{s}</span>
              ))}
            </div>
          </div>

          {/* Color palette */}
          <div className="border border-border p-5 mb-4">
            <p className="text-[10px] font-body font-semibold text-foreground/40 uppercase tracking-widest mb-3">Bảng màu ưa thích</p>
            <div className="flex gap-2">
              {["#FFFFFF", "#F5F0E8", "#1C1C1C", "#1B2A4A", "#9CAF88"].map(c => (
                <div key={c} className="w-10 h-10 border border-border" style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>

          {/* AI insight */}
          <div className="border border-border p-5 mb-6 bg-accent/3">
            <p className="text-[10px] font-body font-semibold text-accent uppercase tracking-widest mb-2">AI Insight</p>
            <p className="font-body text-sm text-foreground/70 leading-relaxed">
              Phong cách của bạn thiên hướng tối giản hiện đại, ưu tiên tông trung tính với các outfit linh hoạt giữa công sở và đời thường.
            </p>
          </div>

          {/* Suggested outfits preview */}
          <div className="border border-border p-5 mb-6">
            <p className="text-[10px] font-body font-semibold text-foreground/40 uppercase tracking-widest mb-3">Outfit gợi ý</p>
            <div className="grid grid-cols-3 gap-2">
              {[lookbook1, lookbook2, styleMinimal].map((img, i) => (
                <motion.div
                  key={i}
                  className="aspect-[3/4] overflow-hidden border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="accent" size="lg" className="flex-1 gap-2 font-body font-semibold" onClick={() => navigate("/recommender")}>
              Xem gợi ý outfit <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="lg" className="font-body" onClick={() => navigate("/wardrobe")}>
              Tủ đồ
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

/* ── Main Quiz Component ── */

const Quiz = () => {
  const [phase, setPhase] = useState<Phase>("welcome");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});

  const steps = [
    { id: "gender", question: "Bạn thuộc nhóm nào?", subtitle: "Giúp AI gợi ý phong cách phù hợp", type: "single" as const },
    { id: "style", question: "Phong cách yêu thích?", subtitle: "Chọn một hoặc nhiều phong cách", type: "multi" as const },
    { id: "occasion", question: "Thường mặc đi đâu?", subtitle: "Chọn các dịp bạn cần outfit", type: "multi" as const },
    { id: "budget", question: "Ngân sách phối đồ?", subtitle: "Mức giá cho một bộ outfit", type: "single" as const },
    { id: "colors", question: "Tông màu ưa thích?", subtitle: "Chọn các màu bạn hay mặc", type: "multi" as const },
  ];

  const current = steps[step];
  const selected = answers[current?.id] || [];
  const canNext = selected.length > 0;

  const toggle = (value: string) => {
    const cur = answers[current.id] || [];
    if (current.type === "single") {
      setAnswers({ ...answers, [current.id]: [value] });
    } else {
      setAnswers({ ...answers, [current.id]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] });
    }
  };

  const next = () => {
    if (step < steps.length - 1) setStep(step + 1);
    else setPhase("analyzing");
  };

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  /* ── Render options by step ── */

  const renderOptions = () => {
    switch (current.id) {
      case "gender":
        return (
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            {genderOptions.map(opt => {
              const isSelected = selected.includes(opt.value);
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggle(opt.value)}
                  className={`relative p-6 border text-center transition-all duration-200 ${
                    isSelected ? "border-accent bg-accent/5 shadow-sm" : "border-border hover:border-foreground/15 hover:shadow-sm bg-background"
                  }`}
                >
                  <span className="text-3xl block mb-3">{opt.emoji}</span>
                  <span className="text-sm font-body font-semibold text-foreground block">{opt.label}</span>
                  <span className="text-[11px] font-body text-foreground/40 mt-1 block">{opt.desc}</span>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 bg-accent flex items-center justify-center">
                      <Check className="w-3 h-3 text-accent-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        );

      case "style":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-xl mx-auto">
            {styleOptions.map(opt => {
              const isSelected = selected.includes(opt.value);
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggle(opt.value)}
                  className={`relative group overflow-hidden border transition-all duration-200 ${
                    isSelected ? "border-accent ring-2 ring-accent/20 shadow-md" : "border-border hover:border-foreground/15 hover:shadow-sm"
                  }`}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={opt.img} alt={opt.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                    <span className="text-background text-sm font-body font-semibold">{opt.label}</span>
                    {isSelected && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-accent flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-accent-foreground" />
                      </motion.div>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        );

      case "occasion":
        return (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg mx-auto">
            {occasionOptions.map(opt => {
              const isSelected = selected.includes(opt.value);
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => toggle(opt.value)}
                  className={`relative p-5 border text-left transition-all duration-200 ${
                    isSelected ? "border-accent bg-accent/5 shadow-sm" : "border-border hover:border-foreground/15 hover:shadow-sm bg-background"
                  }`}
                >
                  <span className="text-2xl block mb-2">{opt.emoji}</span>
                  <span className="text-sm font-body font-semibold text-foreground">{opt.label}</span>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-3 right-3 w-5 h-5 bg-accent flex items-center justify-center">
                      <Check className="w-3 h-3 text-accent-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        );

      case "budget":
        return (
          <div className="space-y-3 max-w-md mx-auto">
            {budgetOptions.map(opt => {
              const isSelected = selected.includes(opt.value);
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggle(opt.value)}
                  className={`w-full p-5 border text-left flex items-center justify-between transition-all duration-200 ${
                    isSelected ? "border-accent bg-accent/5 shadow-sm" : "border-border hover:border-foreground/15 hover:shadow-sm bg-background"
                  }`}
                >
                  <div>
                    <span className="text-sm font-body font-semibold text-foreground block">{opt.label}</span>
                    <span className="text-[11px] font-body text-foreground/40">{opt.desc}</span>
                  </div>
                  {isSelected ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-6 h-6 bg-accent flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-accent-foreground" />
                    </motion.div>
                  ) : (
                    <span className="text-foreground/20 font-body text-sm">{opt.icon}</span>
                  )}
                </motion.button>
              );
            })}
          </div>
        );

      case "colors":
        return (
          <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
            {colorOptions.map(opt => {
              const isSelected = selected.includes(opt.value);
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggle(opt.value)}
                  className={`relative p-4 border text-center transition-all duration-200 ${
                    isSelected ? "border-accent ring-2 ring-accent/20 shadow-sm" : "border-border hover:border-foreground/15 hover:shadow-sm bg-background"
                  }`}
                >
                  <div
                    className="w-12 h-12 mx-auto mb-2.5 border border-border/50"
                    style={{ backgroundColor: opt.hex }}
                  />
                  <span className="text-[11px] font-body font-semibold text-foreground">{opt.label}</span>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-2 right-2 w-4 h-4 bg-accent flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-accent-foreground" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  /* ── Phase routing ── */

  if (phase === "welcome") return <WelcomeScreen onStart={() => setPhase("quiz")} />;
  if (phase === "analyzing") return <AnalyzingScreen onDone={() => setPhase("result")} />;
  if (phase === "result") return <ResultScreen />;

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-heading text-lg font-semibold text-foreground">StyleAI</span>
        </Link>
        <span className="text-[11px] font-body font-semibold text-foreground/35 uppercase tracking-widest">
          {step + 1} / {TOTAL_STEPS}
        </span>
      </div>

      {/* Progress */}
      <div className="px-6 py-3 shrink-0">
        <div className="max-w-xl mx-auto">
          <Progress value={progress} className="h-1 bg-secondary [&>div]:bg-accent [&>div]:transition-all [&>div]:duration-500" />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-4 overflow-y-auto">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div key={step} {...pageTransition}>
              {/* Question */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-1.5">
                  {current.question}
                </h1>
                <p className="text-foreground/40 font-body text-sm">{current.subtitle}</p>
              </div>

              {/* Options */}
              {renderOptions()}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 max-w-md mx-auto">
                <button
                  onClick={() => step > 0 ? setStep(step - 1) : setPhase("welcome")}
                  className="flex items-center gap-2 text-xs font-body font-medium uppercase tracking-wider text-foreground/35 hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
                </button>
                <Button variant="accent" disabled={!canNext} onClick={next} className="gap-2 font-body font-semibold">
                  {step === steps.length - 1 ? "Hoàn tất" : "Tiếp theo"} <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";

const quizSteps = [
  { id: "gender", question: "Bạn là?", subtitle: "Giúp AI gợi ý phù hợp hơn", type: "single" as const,
    options: [
      { value: "female", label: "Nữ", emoji: "👩" },
      { value: "male", label: "Nam", emoji: "👨" },
      { value: "nonbinary", label: "Phi nhị giới", emoji: "🌈" },
      { value: "skip", label: "Không muốn nói", emoji: "—" },
    ]},
  { id: "style", question: "Phong cách yêu thích?", subtitle: "Chọn một hoặc nhiều", type: "multi" as const,
    options: [
      { value: "minimal", label: "Tối giản", emoji: "○" },
      { value: "streetwear", label: "Streetwear", emoji: "◆" },
      { value: "elegant", label: "Thanh lịch", emoji: "◇" },
      { value: "sporty", label: "Năng động", emoji: "△" },
      { value: "vintage", label: "Vintage", emoji: "□" },
      { value: "bohemian", label: "Bohemian", emoji: "☆" },
    ]},
  { id: "occasion", question: "Thường mặc đi đâu?", subtitle: "Chọn các dịp mặc thường xuyên", type: "multi" as const,
    options: [
      { value: "school", label: "Đi học", emoji: "📚" },
      { value: "work", label: "Đi làm", emoji: "💼" },
      { value: "hangout", label: "Đi chơi", emoji: "☕" },
      { value: "party", label: "Dự tiệc", emoji: "✦" },
      { value: "travel", label: "Du lịch", emoji: "✈" },
      { value: "date", label: "Hẹn hò", emoji: "♡" },
    ]},
  { id: "budget", question: "Ngân sách phối đồ?", subtitle: "Mức giá cho một outfit", type: "single" as const,
    options: [
      { value: "low", label: "Dưới 200K", emoji: "•" },
      { value: "mid", label: "200K – 500K", emoji: "••" },
      { value: "high", label: "500K – 1tr", emoji: "•••" },
      { value: "premium", label: "Trên 1 triệu", emoji: "••••" },
    ]},
  { id: "colors", question: "Màu sắc ưa thích?", subtitle: "Tông màu bạn hay mặc nhất", type: "multi" as const,
    options: [
      { value: "neutral", label: "Trung tính", emoji: "▪" },
      { value: "pastel", label: "Pastel", emoji: "▫" },
      { value: "bold", label: "Nổi bật", emoji: "■" },
      { value: "dark", label: "Tối / Đen", emoji: "●" },
      { value: "earth", label: "Earth tone", emoji: "◐" },
      { value: "bright", label: "Tươi sáng", emoji: "◑" },
    ]},
];

const Quiz = () => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [completed, setCompleted] = useState(false);
  const navigate = useNavigate();
  const current = quizSteps[step];

  const toggleOption = (value: string) => {
    const cur = answers[current.id] || [];
    if (current.type === "single") {
      setAnswers({ ...answers, [current.id]: [value] });
    } else {
      setAnswers({ ...answers, [current.id]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value] });
    }
  };

  const selected = answers[current?.id] || [];
  const canNext = selected.length > 0;
  const next = () => { if (step < quizSteps.length - 1) setStep(step + 1); else setCompleted(true); };

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-16 min-h-screen flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md px-6">
            <div className="w-16 h-16 border border-teal flex items-center justify-center mx-auto mb-8">
              <Check className="w-8 h-8 text-teal" strokeWidth={1.5} />
            </div>
            <h1 className="font-heading text-4xl font-light text-foreground mb-2">Hồ sơ phong cách</h1>
            <p className="font-heading text-4xl italic text-foreground mb-6">đã sẵn sàng!</p>
            <p className="text-muted-foreground font-body text-sm mb-10 leading-relaxed">
              AI đã phân tích sở thích của bạn. Hãy khám phá outfit được gợi ý riêng cho bạn.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="accent" size="lg" className="gap-2" onClick={() => navigate("/recommender")}>
                Xem gợi ý <ArrowRight className="w-3.5 h-3.5" />
              </Button>
              <Button variant="hero-outline" size="lg" onClick={() => navigate("/wardrobe")}>Tủ đồ</Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16 min-h-screen">
        <div className="mag-grid grid-cols-1 lg:grid-cols-[1fr_2fr] min-h-[calc(100vh-4rem)]">
          {/* Left — progress */}
          <div className="flex flex-col justify-center p-10 lg:p-16 bg-secondary">
            <p className="editorial-label mb-6">Bước {step + 1} / {quizSteps.length}</p>
            <div className="space-y-2 mb-10">
              {quizSteps.map((_, i) => (
                <div key={i} className={`h-px transition-all duration-500 ${i <= step ? "bg-accent w-full" : "bg-border w-1/2"}`} />
              ))}
            </div>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground leading-tight mb-2">
              {current.question.split("?")[0]}
              <span className="italic">?</span>
            </h2>
            <p className="text-xs text-muted-foreground font-body">{current.subtitle}</p>
          </div>

          {/* Right — options */}
          <div className="flex flex-col justify-center p-10 lg:p-16">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-border max-w-lg">
                  {current.options.map(opt => {
                    const isSelected = selected.includes(opt.value);
                    return (
                      <button key={opt.value} onClick={() => toggleOption(opt.value)}
                        className={`p-6 text-center transition-all duration-300 ${
                          isSelected ? "bg-accent text-accent-foreground" : "bg-background hover:bg-secondary"
                        }`}>
                        <span className="text-lg block mb-2 font-heading">{opt.emoji}</span>
                        <span className="text-xs font-body font-medium uppercase tracking-wider">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-12 max-w-lg">
              <button onClick={() => step > 0 && setStep(step - 1)}
                className={`flex items-center gap-2 text-xs font-body uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}>
                <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
              </button>
              <Button variant="accent" disabled={!canNext} onClick={next} className="gap-2">
                {step === quizSteps.length - 1 ? "Hoàn tất" : "Tiếp theo"} <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

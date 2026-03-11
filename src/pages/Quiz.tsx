import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate, Link } from "react-router-dom";

const quizSteps = [
  { id: "gender", question: "Bạn thuộc nhóm nào?", subtitle: "Giúp AI gợi ý phù hợp hơn", type: "single" as const,
    options: [
      { value: "female", label: "Nữ", emoji: "👩" },
      { value: "male", label: "Nam", emoji: "👨" },
      { value: "lgbtq", label: "LGBTQ+", emoji: "🏳️‍🌈" },
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
      <div className="h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md px-6">
          <div className="w-16 h-16 border border-accent flex items-center justify-center mx-auto mb-8">
            <Check className="w-8 h-8 text-accent" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-3xl font-semibold text-foreground mb-2">Hồ sơ phong cách</h1>
          <p className="font-heading text-3xl font-semibold text-foreground mb-6">đã sẵn sàng!</p>
          <p className="text-foreground/50 font-body text-sm mb-10 leading-relaxed">
            AI đã phân tích sở thích của bạn. Hãy khám phá outfit được gợi ý riêng cho bạn.
          </p>
          <div className="flex gap-3 justify-center">
            <Button variant="accent" size="lg" className="gap-2" onClick={() => navigate("/recommender")}>
              Xem gợi ý <ArrowRight className="w-3.5 h-3.5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/wardrobe")}>Tủ đồ</Button>
          </div>
        </motion.div>
      </div>
    );
  }

  const progress = ((step + 1) / quizSteps.length) * 100;
  const cols = current.options.length <= 4 ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-3";

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 shrink-0 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span className="font-heading text-lg font-semibold text-foreground">StyleAI</span>
        </Link>
        <span className="text-[11px] font-body font-semibold text-foreground/40 uppercase tracking-widest">
          Bước {step + 1} / {quizSteps.length}
        </span>
      </div>

      {/* Progress */}
      <div className="px-6 py-3 shrink-0">
        <div className="max-w-lg mx-auto">
          <Progress value={progress} className="h-1 bg-secondary [&>div]:bg-accent" />
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Question */}
              <div className="text-center mb-8">
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground mb-1.5">
                  {current.question}
                </h1>
                <p className="text-foreground/45 font-body text-sm">{current.subtitle}</p>
              </div>

              {/* Options grid */}
              <div className={`grid ${cols} gap-3`}>
                {current.options.map(opt => {
                  const isSelected = selected.includes(opt.value);
                  return (
                    <motion.button
                      key={opt.value}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => toggleOption(opt.value)}
                      className={`relative p-5 border text-center transition-all duration-200 ${
                        isSelected
                          ? "border-accent bg-accent/5 ring-2 ring-accent/20"
                          : "border-border hover:border-foreground/20 bg-background"
                      }`}
                    >
                      <span className="text-xl block mb-2">{opt.emoji}</span>
                      <span className="text-sm font-body font-semibold text-foreground">{opt.label}</span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-2 right-2 w-5 h-5 bg-accent flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-accent-foreground" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => step > 0 && setStep(step - 1)}
                  className={`flex items-center gap-2 text-xs font-body font-medium uppercase tracking-wider text-foreground/40 hover:text-foreground transition-colors ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Quay lại
                </button>
                <Button variant="accent" disabled={!canNext} onClick={next} className="gap-2 font-body">
                  {step === quizSteps.length - 1 ? "Hoàn tất" : "Tiếp theo"} <ArrowRight className="w-3.5 h-3.5" />
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

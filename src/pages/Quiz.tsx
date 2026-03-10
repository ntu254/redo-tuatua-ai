import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";

const quizSteps = [
  {
    id: "gender",
    question: "Bạn là?",
    subtitle: "Giúp AI gợi ý phù hợp hơn với bạn",
    type: "single" as const,
    options: [
      { value: "female", label: "Nữ", emoji: "👩" },
      { value: "male", label: "Nam", emoji: "👨" },
      { value: "nonbinary", label: "Phi nhị giới", emoji: "🌈" },
      { value: "skip", label: "Không muốn nói", emoji: "🤫" },
    ],
  },
  {
    id: "style",
    question: "Phong cách yêu thích?",
    subtitle: "Chọn một hoặc nhiều phong cách bạn thích",
    type: "multi" as const,
    options: [
      { value: "minimal", label: "Tối giản", emoji: "🤍" },
      { value: "streetwear", label: "Streetwear", emoji: "🔥" },
      { value: "elegant", label: "Thanh lịch", emoji: "✨" },
      { value: "sporty", label: "Năng động", emoji: "⚡" },
      { value: "vintage", label: "Vintage", emoji: "🌸" },
      { value: "bohemian", label: "Bohemian", emoji: "🌿" },
    ],
  },
  {
    id: "occasion",
    question: "Bạn thường mặc đi đâu?",
    subtitle: "Chọn các dịp mặc thường xuyên",
    type: "multi" as const,
    options: [
      { value: "school", label: "Đi học", emoji: "📚" },
      { value: "work", label: "Đi làm", emoji: "💼" },
      { value: "hangout", label: "Đi chơi", emoji: "☕" },
      { value: "party", label: "Dự tiệc", emoji: "🎉" },
      { value: "travel", label: "Du lịch", emoji: "✈️" },
      { value: "date", label: "Hẹn hò", emoji: "💕" },
    ],
  },
  {
    id: "budget",
    question: "Ngân sách phối đồ?",
    subtitle: "Mức giá bạn thường chi cho một outfit",
    type: "single" as const,
    options: [
      { value: "low", label: "Dưới 200K", emoji: "💰" },
      { value: "mid", label: "200K – 500K", emoji: "💵" },
      { value: "high", label: "500K – 1 triệu", emoji: "💎" },
      { value: "premium", label: "Trên 1 triệu", emoji: "👑" },
    ],
  },
  {
    id: "colors",
    question: "Màu sắc ưa thích?",
    subtitle: "Chọn tông màu bạn hay mặc nhất",
    type: "multi" as const,
    options: [
      { value: "neutral", label: "Trung tính", emoji: "🤎" },
      { value: "pastel", label: "Pastel", emoji: "🩷" },
      { value: "bold", label: "Nổi bật", emoji: "❤️" },
      { value: "dark", label: "Tối/Đen", emoji: "🖤" },
      { value: "earth", label: "Earth tone", emoji: "🫶" },
      { value: "bright", label: "Tươi sáng", emoji: "💛" },
    ],
  },
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
      setAnswers({
        ...answers,
        [current.id]: cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value],
      });
    }
  };

  const selected = answers[current?.id] || [];
  const canNext = selected.length > 0;

  const next = () => {
    if (step < quizSteps.length - 1) setStep(step + 1);
    else setCompleted(true);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-32 pb-20 px-6 flex items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-sage-light flex items-center justify-center mx-auto mb-8">
              <Check className="w-10 h-10 text-sage" />
            </div>
            <h1 className="font-heading text-3xl font-semibold italic text-foreground mb-4">
              Hồ sơ phong cách đã sẵn sàng!
            </h1>
            <p className="text-muted-foreground font-body mb-10 leading-relaxed">
              AI đã phân tích sở thích của bạn và tạo hồ sơ phong cách cá nhân. Hãy khám phá outfit được gợi ý riêng cho bạn.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="accent" size="lg" className="rounded-full font-body gap-2" onClick={() => navigate("/recommender")}>
                Xem gợi ý outfit <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="hero-outline" size="lg" className="font-body" onClick={() => navigate("/wardrobe")}>
                Tủ đồ của tôi
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 px-6">
        <div className="max-w-xl mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-between mb-12">
            <p className="text-xs font-body text-muted-foreground uppercase tracking-[0.2em]">
              Bước {step + 1} / {quizSteps.length}
            </p>
            <div className="flex gap-1.5">
              {quizSteps.map((_, i) => (
                <div key={i} className={`h-1 rounded-full transition-all duration-500 ${
                  i <= step ? "bg-accent w-8" : "bg-border w-4"
                }`} />
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.35 }}>
              <div className="text-center mb-10">
                <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground italic mb-2">
                  {current.question}
                </h2>
                <p className="text-muted-foreground font-body text-sm">{current.subtitle}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {current.options.map(opt => {
                  const isSelected = selected.includes(opt.value);
                  return (
                    <button key={opt.value} onClick={() => toggleOption(opt.value)}
                      className={`p-5 rounded-2xl border-2 transition-all duration-300 text-center editorial-card ${
                        isSelected
                          ? "border-accent bg-peach-light"
                          : "border-border bg-card hover:border-accent/30"
                      }`}>
                      <span className="text-2xl block mb-2">{opt.emoji}</span>
                      <span className="text-sm font-body font-medium text-foreground">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-12">
            <button onClick={() => step > 0 && setStep(step - 1)}
              className={`flex items-center gap-2 text-sm font-body text-muted-foreground hover:text-foreground transition-colors ${step === 0 ? "opacity-0 pointer-events-none" : ""}`}>
              <ArrowLeft className="w-4 h-4" /> Quay lại
            </button>
            <Button variant="accent" size="lg" disabled={!canNext} onClick={next}
              className="rounded-full font-body gap-2 px-8">
              {step === quizSteps.length - 1 ? "Hoàn tất" : "Tiếp theo"} <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;

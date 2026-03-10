import { useState, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";

const placeholders = [
  "Hôm nay tôi muốn mặc đi cà phê…",
  "Gợi ý outfit công sở nhẹ nhàng…",
  "Mix đồ streetwear dưới 500k…",
  "Đi hẹn hò tối nay nên mặc gì?",
];

const AIInput = () => {
  const [text, setText] = useState("");
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [typedPlaceholder, setTypedPlaceholder] = useState("");

  useEffect(() => {
    const current = placeholders[placeholderIdx];
    let charIdx = 0;
    setTypedPlaceholder("");

    const interval = setInterval(() => {
      if (charIdx <= current.length) {
        setTypedPlaceholder(current.slice(0, charIdx));
        charIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setPlaceholderIdx((prev) => (prev + 1) % placeholders.length);
        }, 2000);
      }
    }, 60);

    return () => clearInterval(interval);
  }, [placeholderIdx]);

  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
          Hỏi AI Stylist của bạn
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Nhập bất kỳ ý tưởng nào — AI sẽ gợi ý outfit phù hợp cho bạn
        </p>

        <div className="relative">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={typedPlaceholder}
            className="w-full bg-background border border-border rounded-2xl px-6 py-4 pr-14 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent/50 font-body transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-2.5 rounded-xl hover:bg-accent/90 transition-colors">
            <Send className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {["Đi học 🎒", "Hẹn hò 💕", "Công sở 💼", "Du lịch ✈️"].map((tag) => (
            <button
              key={tag}
              onClick={() => setText(tag)}
              className="text-xs bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors font-heading"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIInput;

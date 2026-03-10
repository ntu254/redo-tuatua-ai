import { useState, useEffect } from "react";
import { Send, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const placeholders = [
  "Hôm nay tôi muốn mặc đi cà phê…",
  "Gợi ý outfit công sở nhẹ nhàng…",
  "Mix đồ streetwear dưới 500k…",
  "Đi hẹn hò tối nay nên mặc gì?",
];

const AIInput = () => {
  const [text, setText] = useState("");
  const [pIdx, setPIdx] = useState(0);
  const [typed, setTyped] = useState("");

  useEffect(() => {
    const cur = placeholders[pIdx];
    let i = 0;
    setTyped("");
    const iv = setInterval(() => {
      if (i <= cur.length) { setTyped(cur.slice(0, i)); i++; }
      else { clearInterval(iv); setTimeout(() => setPIdx(p => (p + 1) % placeholders.length), 2000); }
    }, 55);
    return () => clearInterval(iv);
  }, [pIdx]);

  return (
    <section className="py-24 bg-cream/50">
      <div className="container mx-auto px-6 max-w-2xl text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <Sparkles className="w-7 h-7 text-accent mx-auto mb-5" strokeWidth={1.5} />
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground italic mb-2">
            Hỏi AI Stylist của bạn
          </h2>
          <p className="text-muted-foreground text-sm font-body mb-10">
            Nhập bất kỳ ý tưởng nào — AI sẽ gợi ý outfit phù hợp
          </p>

          <div className="relative">
            <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder={typed}
              className="w-full bg-card border border-border rounded-2xl px-6 py-5 pr-14 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/40 font-body text-sm transition-all" />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-3 rounded-xl hover:bg-accent/90 transition-colors">
              <Send className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["Đi học 🎒","Hẹn hò 💕","Công sở 💼","Du lịch ✈️"].map(tag => (
              <button key={tag} onClick={() => setText(tag)}
                className="text-xs bg-card border border-border text-muted-foreground px-4 py-2 rounded-full hover:border-accent/40 hover:text-foreground transition-all font-body">{tag}</button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIInput;

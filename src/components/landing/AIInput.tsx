import { useState, useEffect } from "react";
import { Send } from "lucide-react";
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
    <section className="bg-background">
      <div className="mag-grid grid-cols-1 md:grid-cols-[1fr_2fr]">
        {/* Left label */}
        <div className="flex items-center justify-center p-12 md:p-16 bg-secondary">
          <div>
            <p className="editorial-label mb-4">AI Stylist</p>
            <h2 className="font-heading text-3xl font-light text-foreground leading-tight">
              Hỏi AI<br /><span className="italic">Stylist của bạn</span>
            </h2>
            <div className="editorial-divider mt-6" />
            <p className="text-xs text-muted-foreground font-body mt-4 max-w-[200px] leading-relaxed">
              Nhập bất kỳ ý tưởng nào — AI sẽ gợi ý outfit phù hợp
            </p>
          </div>
        </div>

        {/* Right input */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex flex-col justify-center p-12 md:p-16">
          <div className="max-w-lg">
            <div className="relative mb-6">
              <input type="text" value={text} onChange={e => setText(e.target.value)} placeholder={typed}
                className="w-full bg-transparent border-b-2 border-foreground/10 px-0 py-4 text-lg font-heading italic text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors" />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-3 hover:bg-accent/85 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {["Đi học 🎒","Hẹn hò 💕","Công sở 💼","Du lịch ✈️"].map(tag => (
                <button key={tag} onClick={() => setText(tag)}
                  className="text-[10px] font-body font-medium uppercase tracking-wider text-muted-foreground border border-border px-4 py-2 hover:border-accent hover:text-accent transition-all">{tag}</button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AIInput;

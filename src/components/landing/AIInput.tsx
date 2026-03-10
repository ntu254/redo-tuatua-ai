import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";

const placeholders = [
  "Tôi cần outfit đi cà phê cuối tuần…",
  "Gợi ý outfit công sở nhẹ nhàng…",
  "Mix streetwear dưới 500k…",
  "Tối nay mặc gì đây?",
];

const sampleResponses = [
  { text: "☕ Đây là 3 gợi ý casual chic cho buổi cà phê!", items: ["Áo linen trắng", "Quần chinos be", "Sneaker canvas"] },
  { text: "💼 Thanh lịch và chuyên nghiệp — thử những bộ này!", items: ["Áo blouse lụa", "Quần âu", "Giày oxford"] },
  { text: "🔥 Streetwear trong ngân sách? Có ngay!", items: ["Hoodie graphic", "Quần cargo", "Chunky sneaker"] },
];

const AIInput = () => {
  const [text, setText] = useState("");
  const [pIdx, setPIdx] = useState(0);
  const [typed, setTyped] = useState("");
  const [showResponse, setShowResponse] = useState(false);
  const [responseIdx, setResponseIdx] = useState(0);

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

  const handleSend = () => {
    if (!text.trim()) return;
    setShowResponse(true);
    setResponseIdx(Math.floor(Math.random() * sampleResponses.length));
    setTimeout(() => { setText(""); setShowResponse(false); }, 4000);
  };

  return (
    <section className="bg-background">
      <div className="mag-grid grid-cols-1 md:grid-cols-[1fr_2fr]">
        {/* Left label */}
        <div className="flex items-center justify-center p-12 md:p-16 bg-secondary">
          <div>
            <p className="editorial-label mb-4">Chat với AI Stylist</p>
            <h2 className="font-heading text-3xl font-light text-foreground leading-tight">
              Hỏi<br /><span className="italic">AI Stylist</span>
            </h2>
            <div className="editorial-divider mt-6" />
            <p className="text-sm text-muted-foreground font-body mt-4 max-w-[220px] leading-relaxed">
              Nhập ý tưởng bất kỳ — AI gợi ý outfit hoàn hảo ngay lập tức
            </p>
          </div>
        </div>

        {/* Right — chat interface */}
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          className="flex flex-col justify-center p-12 md:p-16">
          <div className="max-w-lg">
            {/* Chat area */}
            {showResponse && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-5 bg-off-white border border-border">
                <p className="text-sm font-body text-foreground mb-3">{sampleResponses[responseIdx].text}</p>
                <div className="flex flex-wrap gap-2">
                  {sampleResponses[responseIdx].items.map(item => (
                    <span key={item} className="text-[10px] font-body font-medium px-3 py-1.5 bg-secondary text-foreground uppercase tracking-wider">{item}</span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Input */}
            <div className="relative mb-6">
              <input type="text" value={text} onChange={e => setText(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
                placeholder={typed}
                className="w-full bg-transparent border-b-2 border-foreground/10 px-0 py-4 text-lg font-heading italic text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-accent transition-colors" />
              <button onClick={handleSend}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-3 hover:bg-accent/85 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Quick tags */}
            <div className="flex flex-wrap gap-2">
              {["Đi cà phê ☕", "Hẹn hò 💕", "Đi làm 💼", "Du lịch ✈️", "Dự tiệc 🎉"].map(tag => (
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

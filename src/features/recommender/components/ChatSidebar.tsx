import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Sparkles, Wand2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatMsg {
  role: "user" | "ai";
  text: string;
}

const quickPrompts = [
  { icon: "☕", label: "Outfit đi cà phê cuối tuần dưới 1tr" },
  { icon: "💼", label: "Công sở minimal thanh lịch" },
  { icon: "🔥", label: "Streetwear Hàn Quốc năng động" },
  { icon: "✈️", label: "Du lịch hè thoải mái" },
  { icon: "🌙", label: "Dạ tiệc sang trọng" },
  { icon: "🏃", label: "Athleisure thể thao" },
  { icon: "🌹", label: "Hẹn hò lãng mạn" },
];

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSendPrompt: (prompt: string) => void;
  isGenerating: boolean;
}

const ChatSidebar = ({ isOpen, onToggle, onSendPrompt, isGenerating }: ChatSidebarProps) => {
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      role: "ai",
      text: "Xin chào! 👋 Mình là Redo — trợ lý thời trang AI của bạn.\n\nHãy mô tả phong cách, dịp, mood, màu sắc hoặc budget — mình sẽ gợi ý outfit hoàn hảo nhé! ✨\n\nVí dụ: *\"Outfit đi cafe cuối tuần kiểu minimal Hàn Quốc dưới 1 triệu\"*",
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isGenerating]);

  const sendMsg = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setChat((c) => [...c, { role: "user", text: msg }]);
    setInput("");
    setChat((c) => [
      ...c,
      {
        role: "ai",
        text: `Đang phân tích yêu cầu "${msg}"... 🔍\n\n⏳ Mình đang tìm outfit phù hợp nhất cho bạn!`,
      },
    ]);
    onSendPrompt(msg);
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="md:hidden fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg shadow-accent/25 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {isOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <MessageCircle className="w-5 h-5" />
        )}
      </button>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -380 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className={`fixed md:relative z-40 w-[320px] lg:w-[340px] h-full flex flex-col shrink-0 ${
          !isOpen
            ? "pointer-events-none md:pointer-events-auto hidden md:flex"
            : "flex"
        }`}
      >
        <div className="absolute inset-0 border-r border-border bg-[linear-gradient(180deg,hsl(var(--background)/0.94)_0%,hsl(var(--secondary)/0.5)_100%)] backdrop-blur-xl" />

        <div className="relative z-10 flex flex-col h-full">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent via-accent to-coral flex items-center justify-center shadow-md shadow-accent/20">
                  <Wand2 className="w-5 h-5 text-accent-foreground" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-teal border-[2.5px] border-background" />
              </div>
              <div className="flex-1">
                <h2 className="font-heading text-[17px] font-semibold text-foreground leading-tight">
                  Redo
                </h2>
                <span className="flex items-center gap-1.5 text-[11px] font-body text-teal font-medium mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block animate-pulse" />
                  AI Stylist · Trực tuyến
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {chat.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="mt-1 flex h-7 w-7 items-center justify-center rounded-lg bg-accent/12 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-4 py-3 text-[13px] font-body leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground rounded-2xl rounded-br-sm shadow-sm"
                      : "bg-secondary/88 text-foreground rounded-2xl rounded-bl-sm border border-border/60"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent/12 shrink-0">
                    <Sparkles className="w-3.5 h-3.5 text-accent" />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-border/60 bg-secondary/88 px-4 py-3.5">
                    <span
                      className="w-2 h-2 rounded-full bg-accent/60 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-accent/60 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 rounded-full bg-accent/60 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          <div className="px-4 pb-3">
            <p className="text-[10px] font-body text-muted-foreground mb-2.5 uppercase tracking-[0.2em] font-medium">
              Gợi ý nhanh
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMsg(s.label)}
                  disabled={isGenerating}
                  className="text-[11px] font-body px-3 py-1.5 rounded-full border border-border bg-background/88 hover:border-accent/30 hover:text-accent hover:bg-secondary/72 hover:shadow-sm active:scale-95 transition-all disabled:opacity-40"
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-border">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !isGenerating && sendMsg()}
                placeholder="Mô tả outfit bạn muốn mặc hôm nay..."
                className="w-full bg-background/88 border border-border px-4 py-3.5 pr-12 text-sm font-body rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent/30 transition-all placeholder:text-muted-foreground/60"
              />
              <button
                onClick={() => sendMsg()}
                disabled={!input.trim() || isGenerating}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-2.5 rounded-xl hover:shadow-md hover:shadow-accent/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:hover:scale-100"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatSidebar;

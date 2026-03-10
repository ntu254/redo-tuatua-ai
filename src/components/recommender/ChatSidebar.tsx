import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, MessageCircle, X } from "lucide-react";

interface ChatMsg {
  role: "user" | "ai";
  text: string;
}

const quickPrompts = [
  { icon: "👔", label: "Outfit đi làm thanh lịch" },
  { icon: "🇰🇷", label: "K-Fashion cuối tuần" },
  { icon: "❤️", label: "Outfit hẹn hò lãng mạn" },
  { icon: "✈️", label: "Trang phục du lịch" },
  { icon: "💰", label: "Office outfit under 1M" },
  { icon: "🏖️", label: "Streetwear for weekend" },
];

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ChatSidebar = ({ isOpen, onToggle }: ChatSidebarProps) => {
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      role: "ai",
      text: "Xin chào! 👋 Mình là StyleAI — trợ lý thời trang AI của bạn.\n\nHãy mô tả phong cách bạn muốn, mình sẽ gợi ý outfit phù hợp nhất nhé! ✨",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMsg = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setChat((c) => [...c, { role: "user", text: msg }]);
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setChat((c) => [
        ...c,
        {
          role: "ai",
          text: `Tuyệt vời! 🎨 Với "${msg}", mình đã cập nhật gợi ý outfit cho bạn rồi nhé! Hãy xem bên phải nha 👉`,
        },
      ]);
    }, 1200);
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-accent text-accent-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <AnimatePresence>
        {(isOpen || typeof window !== "undefined") && (
          <motion.div
            initial={{ x: -340 }}
            animate={{ x: isOpen ? 0 : -340 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed md:relative z-40 w-[320px] lg:w-[360px] h-full border-r border-border flex flex-col bg-background shrink-0 shadow-xl md:shadow-none ${
              !isOpen ? "hidden md:flex" : "flex"
            }`}
          >
            {/* Header with AI avatar */}
            <div className="p-5 border-b border-border bg-off-white">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-accent to-coral flex items-center justify-center shadow-sm">
                    <Sparkles className="w-5 h-5 text-accent-foreground" />
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-teal border-2 border-background" />
                </div>
                <div>
                  <h2 className="font-heading text-lg font-semibold text-foreground">
                    StyleAI Assistant
                  </h2>
                  <span className="flex items-center gap-1.5 text-[11px] font-body text-teal font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block animate-pulse" />
                    Đang hoạt động
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chat.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.role === "ai" && (
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center mr-2 mt-1 shrink-0">
                      <Sparkles className="w-3 h-3 text-accent" />
                    </div>
                  )}
                  <div
                    className={`max-w-[82%] px-4 py-3 text-[13px] font-body leading-relaxed whitespace-pre-line ${
                      m.role === "user"
                        ? "bg-accent text-accent-foreground rounded-2xl rounded-br-md"
                        : "bg-secondary text-foreground rounded-2xl rounded-bl-md"
                    }`}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-3 h-3 text-accent" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick prompts */}
            <div className="px-4 pb-2">
              <p className="text-[10px] font-body text-muted-foreground mb-2 uppercase tracking-widest">
                Gợi ý nhanh
              </p>
              <div className="flex flex-wrap gap-1.5">
                {quickPrompts.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMsg(s.label)}
                    className="text-[11px] font-body px-3 py-1.5 border border-border rounded-full hover:border-accent hover:text-accent hover:bg-accent/5 transition-all bg-background"
                  >
                    {s.icon} {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                  placeholder="Mô tả outfit bạn muốn... ✨"
                  className="w-full bg-secondary border-0 px-4 py-3 pr-12 text-sm font-body rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow"
                />
                <button
                  onClick={() => sendMsg()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-2 rounded-lg hover:opacity-90 hover:scale-105 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatSidebar;

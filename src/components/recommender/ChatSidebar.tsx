import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Sparkles } from "lucide-react";

interface ChatMsg {
  role: "user" | "ai";
  text: string;
}

const quickSuggestions = [
  { icon: "👔", label: "Outfit đi làm thanh lịch" },
  { icon: "🇰🇷", label: "K-Fashion cuối tuần" },
  { icon: "❤️", label: "Outfit hẹn hò lãng mạn" },
  { icon: "✈️", label: "Trang phục du lịch" },
];

const ChatSidebar = () => {
  const [chat, setChat] = useState<ChatMsg[]>([
    {
      role: "ai",
      text: "Xin chào bạn! 👋✨ Mình là StyleAI — trợ lý thời trang thông minh của bạn.\nHãy nói cho mình biết bạn muốn mặc gì hôm nay nhé!",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMsg = (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setChat((c) => [...c, { role: "user", text: msg }]);
    setInput("");
    setTimeout(() => {
      setChat((c) => [
        ...c,
        {
          role: "ai",
          text: `Tuyệt vời! 🎨 Với "${msg}", mình đã cập nhật gợi ý outfit bên phải cho bạn rồi nhé!`,
        },
      ]);
    }, 800);
  };

  return (
    <div className="w-full md:w-[300px] lg:w-[320px] border-r border-border flex flex-col bg-background shrink-0">
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="font-heading text-base font-semibold text-foreground">
              StyleAI Assistant
            </h2>
            <span className="flex items-center gap-1.5 text-xs font-body text-teal">
              <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {chat.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "ai" && (
              <div className="w-7 h-7 rounded-full bg-accent/10 flex items-center justify-center mr-2.5 mt-1 shrink-0">
                <Sparkles className="w-3 h-3 text-accent" />
              </div>
            )}
            <div
              className={`max-w-[82%] px-4 py-3 text-sm font-body leading-relaxed rounded-2xl whitespace-pre-line ${
                m.role === "user"
                  ? "bg-accent text-accent-foreground rounded-br-sm"
                  : "bg-secondary text-foreground rounded-bl-sm"
              }`}
            >
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick suggestions */}
      <div className="px-5 pb-3">
        <p className="text-xs font-body text-muted-foreground mb-2.5">Gợi ý nhanh:</p>
        <div className="flex flex-wrap gap-2">
          {quickSuggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => sendMsg(s.label)}
              className="text-xs font-body px-3.5 py-2 border border-border rounded-full hover:border-accent hover:text-accent transition-colors bg-background"
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="p-5 border-t border-border">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            placeholder="Mô tả outfit bạn muốn... ✨"
            className="w-full bg-secondary border-0 px-4 py-3.5 pr-12 text-sm font-body rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/30"
          />
          <button
            onClick={() => sendMsg()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;

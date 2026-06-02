import { recommenderService } from "@/features/recommender/services/recommender.service";
import type { ChatMessage, Outfit } from "@/features/recommender/types";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOutfitsGenerated: (outfits: Outfit[], message: string) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

const quickPrompts = [
  { icon: "☕", label: "Hẹn hò dưới 1tr", prompt: "Outfit đi hẹn hò tối nay dưới 1 triệu" },
  { icon: "💼", label: "Office Hàn Quốc", prompt: "Office look phong cách Hàn Quốc" },
  { icon: "👟", label: "Minimal cuối tuần", prompt: "Outfit minimal cho cuối tuần" },
  { icon: "🔥", label: "Streetwear concert", prompt: "Streetwear đi concert cá tính" },
  { icon: "🌙", label: "Dạ tiệc sang trọng", prompt: "Dạ tiệc sang trọng tối nay" },
  { icon: "💰", label: "Dưới 500k", prompt: "Outfit đẹp dưới 500 nghìn" },
];

const ChatSidebar = ({ isOpen, onToggle, onOutfitsGenerated, isGenerating, setIsGenerating }: ChatSidebarProps) => {
  const [chat, setChat] = useState<ChatMessage[]>([
    {
      role: "ai",
      text: "Chào bạn! Mình là Redo, AI stylist cá nhân.\n\nBạn muốn mặc gì hôm nay? Ví dụ:\n\n• \"Outfit đi cafe cuối tuần\"\n• \"Streetwear Hàn Quốc\"\n• \"Office look thanh lịch\"",
    },
  ]);
  const [suggestions, setSuggestions] = useState<{ label: string; prompt: string }[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isGenerating]);

  const sendMsg = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isGenerating) return;

    setInput("");
    setChat((c) => [...c, { role: "user", text: msg }]);
    setIsGenerating(true);

    setChat((c) => [
      ...c,
      { role: "ai", text: "Đang phân tích style của bạn." },
    ]);

    try {
      const result = await recommenderService.converse(msg);
      setChat((c) => {
        const updated = [...c];
        updated[updated.length - 1] = {
          role: "ai",
          text: `${result.message}\n\n${result.outfits.map((o, i) => `${i + 1}. **${o.title}**, ${o.aiComment}`).join("\n")}\n\nBạn thấy thế nào? Mình có thể điều chỉnh theo ý bạn!`,
        };
        return updated;
      });
      setSuggestions(result.suggestions);
      onOutfitsGenerated(result.outfits, msg);
    } catch {
      setChat((c) => {
        const updated = [...c];
        updated[updated.length - 1] = {
          role: "ai",
          text: "Rất tiếc, mình gặp lỗi khi tạo outfit. Bạn thử lại nhé!",
        };
        return updated;
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={onToggle}
        className="md:hidden fixed bottom-6 left-6 z-50 w-14 h-14 rounded-xl bg-foreground text-background shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
      </button>

      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -380 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className={`fixed md:sticky md:top-16 z-40 w-[320px] lg:w-[340px] h-screen md:h-[calc(100vh-4rem)] flex flex-col shrink-0 bg-background ${
          !isOpen ? "pointer-events-none md:pointer-events-auto hidden md:flex" : "flex"
        }`}
      >
        <div className="border-r border-border/60 h-full flex flex-col">
          <div className="px-4 py-3.5 border-b border-border/60 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md border border-border flex items-center justify-center shrink-0">
                <span className="text-sm font-heading font-semibold text-foreground">R</span>
              </div>
              <h2 className="font-heading text-sm font-semibold text-foreground">
                Redo AI Stylist
              </h2>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
            {chat.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "ai" && (
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                    <span className="text-[9px] font-heading font-bold text-foreground">R</span>
                  </div>
                )}
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 text-xs font-body leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "bg-foreground text-background rounded-xl"
                      : "bg-secondary text-foreground rounded-xl"
                  }`}
                >
                  {m.text}
                </div>
              </motion.div>
            ))}

            <AnimatePresence>
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="flex items-center gap-2"
                >
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-background">
                    <span className="text-[9px] font-heading font-bold text-foreground">R</span>
                  </div>
                  <span className="text-xs font-body text-muted-foreground">Đang phân tích style của bạn.</span>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {suggestions.length > 0 && !isGenerating && (
            <div className="px-3 pb-2 shrink-0">
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((s) => (
                  <button
                    key={s.label}
                    onClick={() => sendMsg(s.prompt)}
                    className="text-[10px] font-body px-2.5 py-1.5 rounded-md bg-secondary/50 text-muted-foreground hover:bg-secondary hover:text-foreground active:scale-95 transition-all"
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="px-3 pb-2 shrink-0">
            <p className="text-[9px] font-body text-muted-foreground mb-2 uppercase tracking-wider font-medium">
              Gợi ý nhanh
            </p>
            <div className="flex flex-wrap gap-1.5">
              {quickPrompts.map((s) => (
                <button
                  key={s.label}
                  onClick={() => sendMsg(s.prompt)}
                  disabled={isGenerating}
                  className="text-[10px] font-body px-2.5 py-1.5 rounded-md bg-secondary/50 hover:bg-secondary hover:text-foreground active:scale-95 transition-all disabled:opacity-40"
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 border-t border-border/60 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMsg()}
                placeholder="Mô tả outfit bạn muốn..."
                className="w-full bg-secondary/30 px-3.5 py-3 pr-11 text-xs font-body rounded-md focus:outline-none focus:ring-2 focus:ring-foreground/10 transition-all placeholder:text-muted-foreground/50"
              />
              <button
                onClick={() => sendMsg()}
                disabled={!input.trim() || isGenerating}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-foreground text-background p-2 rounded-md active:scale-95 transition-all disabled:opacity-40"
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

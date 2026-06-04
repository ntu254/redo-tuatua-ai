import { recommenderService } from "@/features/recommender/services/recommender.service";
import type { Outfit } from "@/features/recommender/types";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, Send, Sparkles } from "lucide-react";
import { useState } from "react";

interface ChatSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onOutfitsGenerated: (outfits: Outfit[], message: string) => void;
  isGenerating: boolean;
  setIsGenerating: (v: boolean) => void;
}

const QUICK_SUGGESTIONS = [
  { label: "Dạ tiệc", prompt: "Dạ tiệc sang trọng tối nay" },
  { label: "Đi học", prompt: "Outfit đi học năng động" },
  { label: "Đi chơi", prompt: "Outfit đi chơi cuối tuần thoải mái" },
  { label: "Công sở", prompt: "Style công sở nữ tính" },
  { label: "Hẹn hò", prompt: "Outfit đi hẹn hò lãng mạn" },
];

const ChatSidebar = ({ isOpen, onToggle, onOutfitsGenerated, isGenerating, setIsGenerating }: ChatSidebarProps) => {
  const [input, setInput] = useState("");
  const [recentHistory, setRecentHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("redo_recent_prompts");
      return saved ? JSON.parse(saved) : ["Dạ tiệc sang trọng", "Outfit đi cafe", "Style công sở nữ tính"];
    } catch {
      return ["Dạ tiệc sang trọng", "Outfit đi cafe", "Style công sở nữ tính"];
    }
  });

  const saveHistory = (items: string[]) => {
    setRecentHistory(items);
    try {
      localStorage.setItem("redo_recent_prompts", JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to save history to localStorage:", e);
    }
  };

  const sendMsg = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg || isGenerating) return;

    setInput("");

    // Update history list
    const nextHistory = [msg, ...recentHistory.filter((h) => h !== msg)].slice(0, 5);
    saveHistory(nextHistory);

    setIsGenerating(true);
    try {
      const result = await recommenderService.converse(msg);
      onOutfitsGenerated(result.outfits, msg);
    } catch (e) {
      console.error("converse failed:", e);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="md:hidden fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full bg-foreground text-background shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
      </button>

      {/* Desktop Vertical Tab when collapsed */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-40 bg-foreground text-background py-4 px-1.5 rounded-r-xl hover:pl-2.5 transition-all shadow-lg items-center gap-1.5 flex-col"
          style={{ writingMode: "vertical-rl" }}
        >
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[10px] font-heading font-semibold tracking-wider uppercase whitespace-nowrap">
            AI Stylist
          </span>
        </button>
      )}

      {/* Main Sidebar Drawer */}
      <motion.div
        initial={false}
        animate={{ x: isOpen ? 0 : -350, width: isOpen ? 320 : 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 220 }}
        className={`fixed md:sticky md:top-16 z-40 h-screen md:h-[calc(100vh-4rem)] flex flex-col shrink-0 bg-background border-r border-border/40 overflow-hidden ${
          !isOpen ? "pointer-events-none opacity-0 md:w-0" : "w-[320px] opacity-100"
        }`}
      >
        <div className="w-[320px] h-full flex flex-col p-5 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/40 pb-3">
            <div>
              <h2 className="font-heading text-base font-bold text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-foreground/70" /> AI Stylist
              </h2>
              <p className="text-[11px] font-body text-muted-foreground mt-0.5">
                Bạn muốn mặc gì hôm nay?
              </p>
            </div>
            <button
              onClick={onToggle}
              className="hidden md:flex items-center gap-1 text-[10px] font-body text-muted-foreground hover:text-foreground border border-border/60 px-2 py-1 rounded-md transition-colors"
            >
              <ChevronLeft className="w-3 h-3" /> Thu gọn
            </button>
          </div>

          {/* Prompt Input Box */}
          <div className="space-y-2">
            <label className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/80 block">
              Yêu cầu của bạn
            </label>
            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMsg();
                  }
                }}
                placeholder="VD: phối đầm lụa dự tiệc tối sang trọng dưới 2 triệu..."
                rows={3}
                className="w-full bg-secondary/20 border border-border/60 p-3 pr-10 text-xs font-body rounded-xl focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:border-foreground/30 transition-all placeholder:text-muted-foreground/50 resize-none"
              />
              <button
                onClick={() => void sendMsg()}
                disabled={!input.trim() || isGenerating}
                className="absolute right-2 bottom-3 bg-foreground text-background p-2 rounded-lg active:scale-95 transition-all disabled:opacity-40"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick suggestions */}
          <div className="space-y-2.5">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/80 block">
              Gợi ý nhanh
            </span>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SUGGESTIONS.map((s) => (
                <button
                  key={s.label}
                  onClick={() => void sendMsg(s.prompt)}
                  disabled={isGenerating}
                  className="text-xs font-body px-3 py-1.5 rounded-full border border-border/60 bg-background/50 hover:border-foreground/20 hover:text-foreground hover:bg-secondary/30 transition-all disabled:opacity-40"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recent History */}
          <div className="flex-1 space-y-2.5 overflow-hidden flex flex-col">
            <span className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground/80 block">
              Lịch sử gần đây
            </span>
            <div className="flex-1 overflow-y-auto space-y-1 pr-1">
              {recentHistory.map((h, idx) => (
                <button
                  key={idx}
                  onClick={() => void sendMsg(h)}
                  disabled={isGenerating}
                  className="w-full text-left flex items-start gap-2 py-2 px-2.5 rounded-lg hover:bg-secondary/40 text-xs font-body text-foreground/85 hover:text-foreground transition-colors group disabled:opacity-50"
                >
                  <Clock className="w-3.5 h-3.5 mt-0.5 text-muted-foreground/60 shrink-0 group-hover:text-foreground transition-colors" />
                  <span className="truncate">{h}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default ChatSidebar;

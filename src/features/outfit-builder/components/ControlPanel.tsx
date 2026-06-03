import { Loader2, Sparkles, SlidersHorizontal, Upload, Shirt } from "lucide-react";

interface ControlPanelProps {
  input: string;
  setInput: (v: string) => void;
  occasion: string;
  setOccasion: (v: string) => void;
  style: string;
  setStyle: (v: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
}

const OCCASIONS = [
  { value: "casual", label: "Casual" },
  { value: "formal", label: "Formal" },
  { value: "work", label: "Work" },
  { value: "date", label: "Date" },
  { value: "party", label: "Party" },
  { value: "street", label: "Street" },
];

const STYLES = [
  { value: "minimalist", label: "Minimalist" },
  { value: "streetwear", label: "Streetwear" },
  { value: "classic", label: "Classic" },
  { value: "korean", label: "Korean" },
  { value: "japanese", label: "Japanese" },
  { value: "vintage", label: "Vintage" },
];

export default function ControlPanel({
  input,
  setInput,
  occasion,
  setOccasion,
  style,
  setStyle,
  isLoading,
  onGenerate,
}: ControlPanelProps) {
  const canGenerate = input.trim().length > 0 && !isLoading;

  return (
    <aside className="w-[320px] bg-card border-r border-border/30 flex flex-col py-6 px-4 gap-4 shrink-0 z-10 h-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-foreground flex items-center justify-center text-background">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-lg font-semibold text-foreground">Control Panel</h2>
          <p className="text-xs font-body text-foreground/60">Step-by-step Generation</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2">
        {/* Step 1: Model */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs font-medium font-body">1</div>
            <h3 className="text-sm font-heading font-semibold text-foreground">Model</h3>
          </div>
          <button className="w-full h-24 rounded-xl border-2 border-dashed border-border hover:border-foreground bg-card flex flex-col items-center justify-center gap-1 transition-colors group cursor-pointer">
            <Upload className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors" />
            <span className="text-xs font-body text-foreground/60 group-hover:text-foreground">Upload full-body photo</span>
          </button>
        </section>

        {/* Step 2: Outfit */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs font-medium font-body">2</div>
            <h3 className="text-sm font-heading font-semibold text-foreground">Outfit</h3>
          </div>
          {/* Empty state */}
          <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-3 text-center py-6">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center text-foreground/40">
              <Shirt className="w-5 h-5" />
            </div>
            <p className="text-xs font-body text-foreground/60">No outfit selected yet.</p>
            <div className="flex flex-col gap-2 w-full">
              <button className="w-full py-2 rounded-xl border border-foreground text-foreground text-xs font-body font-medium hover:bg-secondary/50 transition-colors cursor-pointer">
                Add Outfit
              </button>
              <button className="w-full py-2 rounded-xl bg-secondary text-foreground text-xs font-body font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1 cursor-pointer">
                <Sparkles className="w-3 h-3" /> AI Suggestion
              </button>
            </div>
          </div>
        </section>

        {/* Step 3: Prompt & Style */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs font-medium font-body">3</div>
            <h3 className="text-sm font-heading font-semibold text-foreground">Prompt & Style</h3>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Minimalist weekend cafe outfit..."
            className="w-full bg-card border border-border rounded-xl p-3 text-xs font-body text-foreground focus:border-foreground focus:ring-1 focus:ring-foreground outline-none resize-none h-20 placeholder:text-foreground/40"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-body text-foreground focus:border-foreground outline-none appearance-none cursor-pointer"
            >
              <option value="">Occasion</option>
              {OCCASIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-3 py-2 text-xs font-body text-foreground focus:border-foreground outline-none appearance-none cursor-pointer"
            >
              <option value="">Style</option>
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-border/30 shrink-0">
        <button
          onClick={onGenerate}
          disabled={!canGenerate}
          className={`w-full h-12 rounded-xl font-body font-medium text-sm flex items-center justify-center gap-2 transition-all ${
            canGenerate
              ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer"
              : "bg-secondary text-foreground/40 cursor-not-allowed opacity-70"
          }`}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Start Try-On
        </button>
      </div>
    </aside>
  );
}

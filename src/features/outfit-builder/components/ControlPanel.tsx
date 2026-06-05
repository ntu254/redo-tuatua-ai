import { Loader2, Sparkles, SlidersHorizontal, Upload, Shirt, X } from "lucide-react";
import { useRef } from "react";

interface ControlPanelProps {
  input: string;
  setInput: (v: string) => void;
  occasion: string;
  setOccasion: (v: string) => void;
  style: string;
  setStyle: (v: string) => void;
  isLoading: boolean;
  onGenerate: () => void;

  // Model photo props
  humanImage: string | null;
  setHumanImage: (v: string | null) => void;

  // Clothing photo props
  clothImage: string | null;
  setClothImage: (v: string | null) => void;

  // Try-on trigger props
  isTryOnLoading: boolean;
  onStartTryOn: () => void;
  canTryOn: boolean;
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
  humanImage,
  setHumanImage,
  clothImage,
  setClothImage,
  isTryOnLoading,
  onStartTryOn,
  canTryOn,
}: ControlPanelProps) {
  const modelInputRef = useRef<HTMLInputElement>(null);
  const clothInputRef = useRef<HTMLInputElement>(null);

  const canCoordinate = input.trim().length > 0 && !isLoading;

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ảnh không được vượt quá 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setHumanImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleClothUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Ảnh không được vượt quá 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setClothImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

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
            <h3 className="text-sm font-heading font-semibold text-foreground">Model Image</h3>
          </div>
          <input
            type="file"
            ref={modelInputRef}
            onChange={handleModelUpload}
            accept="image/*"
            className="hidden"
          />

          {humanImage ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden group border border-border">
              <img src={humanImage} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
                <button
                  onClick={() => modelInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-background text-foreground hover:bg-secondary text-xs font-body font-semibold rounded-full transition-all"
                >
                  Đổi ảnh
                </button>
                <button
                  onClick={() => setHumanImage(null)}
                  className="p-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => modelInputRef.current?.click()}
              className="w-full h-24 rounded-xl border-2 border-dashed border-border hover:border-foreground bg-card flex flex-col items-center justify-center gap-1.5 transition-colors group cursor-pointer"
            >
              <Upload className="w-5 h-5 text-foreground/40 group-hover:text-foreground transition-colors" />
              <span className="text-xs font-body text-foreground/60 group-hover:text-foreground">Upload human photo</span>
            </button>
          )}
        </section>

        {/* Step 2: Outfit */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs font-medium font-body">2</div>
            <h3 className="text-sm font-heading font-semibold text-foreground">Trang phục</h3>
          </div>
          <input
            type="file"
            ref={clothInputRef}
            onChange={handleClothUpload}
            accept="image/*"
            className="hidden"
          />

          {clothImage ? (
            <div className="relative w-full h-28 rounded-xl overflow-hidden group border border-border">
              <img src={clothImage} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-foreground/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-200">
                <button
                  onClick={() => clothInputRef.current?.click()}
                  className="px-2.5 py-1.5 bg-background text-foreground hover:bg-secondary text-xs font-body font-semibold rounded-full transition-all"
                >
                  Tải ảnh khác
                </button>
                <button
                  onClick={() => setClothImage(null)}
                  className="p-1.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full transition-all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card rounded-xl border border-border p-4 flex flex-col items-center justify-center gap-3 text-center py-5">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground/40">
                <Shirt className="w-5 h-5" />
              </div>
              <p className="text-xs font-body text-foreground/60">
                Chọn sản phẩm trong danh sách hoặc tải ảnh lên.
              </p>
              <button
                onClick={() => clothInputRef.current?.click()}
                className="w-full py-1.5 rounded-full border border-border text-foreground text-xs font-body font-medium hover:bg-secondary/50 transition-colors cursor-pointer"
              >
                Tải ảnh trang phục
              </button>
            </div>
          )}
        </section>

        {/* Step 3: Prompt & Style */}
        <section className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-secondary text-foreground flex items-center justify-center text-xs font-medium font-body">3</div>
            <h3 className="text-sm font-heading font-semibold text-foreground">AI Coordinate Suggestion</h3>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., Phong cách cá tính dạo phố..."
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

          <button
            onClick={onGenerate}
            disabled={!canCoordinate}
            className={`mt-1.5 w-full py-2 flex items-center justify-center gap-1.5 text-xs font-body font-semibold rounded-full border border-border/80 bg-background/50 hover:bg-secondary/40 transition-all ${
              canCoordinate ? "text-foreground cursor-pointer" : "text-muted-foreground/60 cursor-not-allowed opacity-50"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
            )}
            Phối đồ bằng AI
          </button>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="pt-3 border-t border-border/30 shrink-0">
        <button
          onClick={onStartTryOn}
          disabled={!canTryOn || isTryOnLoading}
          className={`w-full h-12 rounded-full font-body font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
            canTryOn && !isTryOnLoading
              ? "bg-foreground text-background hover:bg-foreground/90 cursor-pointer shadow-md"
              : "bg-secondary text-foreground/40 cursor-not-allowed opacity-60"
          }`}
        >
          {isTryOnLoading ? (
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

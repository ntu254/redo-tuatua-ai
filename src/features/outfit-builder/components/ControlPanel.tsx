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
  { value: "casual", label: "Dạo phố" },
  { value: "formal", label: "Sự kiện" },
  { value: "work", label: "Đi làm" },
  { value: "date", label: "Hẹn hò" },
  { value: "party", label: "Tiệc tùng" },
  { value: "street", label: "Đường phố" },
];

const STYLES = [
  { value: "minimalist", label: "Minimalist" },
  { value: "streetwear", label: "Streetwear" },
  { value: "classic", label: "Classic" },
  { value: "korean", label: "Hàn Quốc" },
  { value: "japanese", label: "Nhật Bản" },
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
    <aside className="w-full lg:w-[360px] bg-card lg:border-r border-border/40 flex flex-col py-8 px-6 gap-6 shrink-0 z-10 h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2 shrink-0">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
          <SlidersHorizontal className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">AI Stylist</h2>
          <p className="editorial-label mt-1">Bảng điều khiển</p>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-8 pr-2 scrollbar-hide pb-10">
        
        {/* Step 1: Model */}
        <section className="flex flex-col gap-3">
          <h3 className="editorial-label text-muted-foreground flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-secondary-foreground">1</span>
            Hình ảnh của bạn
          </h3>
          <input
            type="file"
            ref={modelInputRef}
            onChange={handleModelUpload}
            accept="image/*"
            className="hidden"
          />

          {humanImage ? (
            <div className="relative w-full h-32 rounded-[16px] overflow-hidden group shadow-sm">
              <img src={humanImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300 backdrop-blur-sm">
                <button
                  onClick={() => modelInputRef.current?.click()}
                  className="px-4 py-2 bg-background text-foreground hover:bg-secondary text-xs font-semibold rounded-full transition-all shadow-sm"
                >
                  Đổi ảnh
                </button>
                <button
                  onClick={() => setHumanImage(null)}
                  className="p-2.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => modelInputRef.current?.click()}
              className="w-full h-32 rounded-[16px] border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 flex flex-col items-center justify-center gap-2 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-full bg-background shadow-sm flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                <Upload className="w-4 h-4" />
              </div>
              <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">Tải ảnh người mẫu lên</span>
            </button>
          )}
        </section>

        {/* Step 2: Outfit */}
        <section className="flex flex-col gap-3">
          <h3 className="editorial-label text-muted-foreground flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-secondary-foreground">2</span>
            Sản phẩm muốn thử
          </h3>
          <input
            type="file"
            ref={clothInputRef}
            onChange={handleClothUpload}
            accept="image/*"
            className="hidden"
          />

          {clothImage ? (
            <div className="relative w-full h-32 rounded-[16px] overflow-hidden group shadow-sm">
              <img src={clothImage} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-foreground/40 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300 backdrop-blur-sm">
                <button
                  onClick={() => clothInputRef.current?.click()}
                  className="px-4 py-2 bg-background text-foreground hover:bg-secondary text-xs font-semibold rounded-full transition-all shadow-sm"
                >
                  Đổi ảnh
                </button>
                <button
                  onClick={() => setClothImage(null)}
                  className="p-2.5 bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-full transition-all shadow-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-secondary/30 rounded-[16px] border border-border/50 p-5 flex flex-col items-center justify-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-background shadow-sm flex items-center justify-center text-muted-foreground">
                <Shirt className="w-5 h-5" />
              </div>
              <p className="text-xs font-medium text-muted-foreground max-w-[80%]">
                Chọn sản phẩm trong danh sách tủ đồ hoặc tải ảnh lên.
              </p>
              <button
                onClick={() => clothInputRef.current?.click()}
                className="w-full py-2.5 rounded-full bg-background text-foreground text-xs font-semibold hover:bg-secondary/80 shadow-sm transition-all cursor-pointer"
              >
                Tải ảnh trang phục
              </button>
            </div>
          )}
        </section>

        {/* Step 3: Prompt & Style */}
        <section className="flex flex-col gap-4 bg-muted/20 p-5 rounded-[24px] border border-border/40">
          <h3 className="editorial-label text-muted-foreground flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-secondary flex items-center justify-center text-[9px] font-bold text-secondary-foreground">3</span>
            Gợi ý phối đồ
          </h3>
          
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Mô tả phong cách bạn muốn..."
            className="w-full bg-background border border-border/60 rounded-[16px] p-4 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none h-24 placeholder:text-muted-foreground/60 transition-all shadow-sm"
          />
          
          <div className="grid grid-cols-2 gap-3">
            <select
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              className="w-full bg-background border border-border/60 rounded-full px-4 py-2.5 text-xs font-medium text-foreground focus:border-primary outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Dịp mặc</option>
              {OCCASIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-background border border-border/60 rounded-full px-4 py-2.5 text-xs font-medium text-foreground focus:border-primary outline-none appearance-none cursor-pointer shadow-sm"
            >
              <option value="">Phong cách</option>
              {STYLES.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          <button
            onClick={onGenerate}
            disabled={!canCoordinate}
            className={`mt-2 w-full h-11 flex items-center justify-center gap-2 text-xs font-semibold rounded-full transition-all ${
              canCoordinate 
                ? "bg-secondary text-secondary-foreground hover:bg-secondary/80 cursor-pointer shadow-sm" 
                : "bg-muted text-muted-foreground/50 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4" />
            )}
            Phối đồ bằng AI
          </button>
        </section>
      </div>

      {/* Footer CTA */}
      <div className="pt-5 border-t border-border/40 shrink-0">
        <button
          onClick={onStartTryOn}
          disabled={!canTryOn || isTryOnLoading}
          className={`w-full h-14 rounded-full font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 ${
            canTryOn && !isTryOnLoading
              ? "bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer shadow-[0_16px_34px_-18px_hsl(var(--primary)/0.28)]"
              : "bg-muted text-muted-foreground/60 cursor-not-allowed"
          }`}
        >
          {isTryOnLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          Tạo ảnh mặc thử
        </button>
      </div>
    </aside>
  );
}

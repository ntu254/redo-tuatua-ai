import { Loader2, Sparkles, SlidersHorizontal, Upload, Shirt, X } from "lucide-react";
import { useRef } from "react";

interface ControlPanelProps {
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
      </div>

      {/* Footer Button */}
      <div className="p-6 bg-card border-t border-border/40 shrink-0 mt-auto z-20 shadow-[0_-4px_16px_rgba(0,0,0,0.02)]">
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

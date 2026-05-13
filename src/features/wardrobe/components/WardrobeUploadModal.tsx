import { cn } from "@/lib/utils";
import { wardrobeUploadAnalysisMock } from "@/shared/api/mock-fixtures";
import { Button } from "@/shared/ui";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Check,
  ChevronRight,
  ImagePlus,
  Loader2,
  Pencil,
  Shirt,
  ShoppingBag,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface WardrobeUploadModalProps {
  open: boolean;
  onClose: () => void;
}

type UploadStep = "upload" | "analyzing" | "review" | "saved";

const categories = ["Tops", "Bottoms", "Shoes", "Outerwear", "Accessories"];
const types: Record<string, string[]> = {
  Tops: ["Áo thun", "Hoodie", "Blazer", "Sơ mi", "Áo ba lỗ"],
  Bottoms: ["Jeans", "Quần âu", "Váy", "Shorts", "Đầm"],
  Shoes: ["Sneaker", "Sandal", "Boots", "Giày cao gót", "Loafer"],
  Outerwear: ["Áo khoác", "Coat", "Cardigan", "Vest"],
  Accessories: ["Túi xách", "Mũ", "Kính mát", "Khăn", "Trang sức"],
};
const styleTags = [
  "Casual",
  "Minimal",
  "Streetwear",
  "Công sở",
  "Dạ tiệc",
  "Thể thao",
];
const colorOptions = [
  { label: "Trắng", hex: "#FFFFFF" },
  { label: "Đen", hex: "#1A1A1A" },
  { label: "Xanh", hex: "#1C3A5F" },
  { label: "Be", hex: "#D2B48C" },
  { label: "Xám", hex: "#808080" },
  { label: "Hồng", hex: "#F4A0A0" },
];

const WardrobeUploadModal = ({ open, onClose }: WardrobeUploadModalProps) => {
  const [step, setStep] = useState<UploadStep>("upload");
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [detectedName, setDetectedName] = useState(
    wardrobeUploadAnalysisMock.detectedName,
  );
  const [detectedCategory, setDetectedCategory] = useState(
    wardrobeUploadAnalysisMock.detectedCategory,
  );
  const [detectedType, setDetectedType] = useState(
    wardrobeUploadAnalysisMock.detectedType,
  );
  const [detectedColor, setDetectedColor] = useState(
    wardrobeUploadAnalysisMock.detectedColor,
  );
  const [detectedTags, setDetectedTags] = useState<string[]>(
    wardrobeUploadAnalysisMock.detectedTags,
  );
  const [isEditing, setIsEditing] = useState(false);

  const reset = useCallback(() => {
    setStep("upload");
    setPreview(null);
    setIsEditing(false);
    setDetectedName(wardrobeUploadAnalysisMock.detectedName);
    setDetectedCategory(wardrobeUploadAnalysisMock.detectedCategory);
    setDetectedType(wardrobeUploadAnalysisMock.detectedType);
    setDetectedColor(wardrobeUploadAnalysisMock.detectedColor);
    setDetectedTags(wardrobeUploadAnalysisMock.detectedTags);
  }, []);

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setStep("analyzing");
      setTimeout(() => setStep("review"), 2000);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };
  const handleConfirm = () => {
    setStep("saved");
    setTimeout(() => handleClose(), 1800);
  };
  const toggleTag = (tag: string) => {
    setDetectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-teal/15 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-teal" strokeWidth={1.5} />
              </div>
              <div>
                <p className="text-sm font-body font-semibold text-foreground">
                  {step === "upload" && "Thêm món đồ"}
                  {step === "analyzing" && "Đang phân tích..."}
                  {step === "review" && "AI đã nhận diện"}
                  {step === "saved" && "Đã lưu!"}
                </p>
                <p className="text-[10px] text-muted-foreground font-body">
                  {step === "upload" &&
                    "Tải ảnh lên và AI sẽ nhận diện tự động"}
                  {step === "analyzing" && "AI đang phân tích món đồ của bạn"}
                  {step === "review" && "Xem lại và xác nhận thông tin"}
                  {step === "saved" && "Đã thêm vào tủ đồ"}
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === "upload" && (
              <div className="space-y-4">
                <div
                  onDragEnter={() => setIsDragging(true)}
                  onDragLeave={() => setIsDragging(false)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={cn(
                    "border-2 border-dashed rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer transition-all duration-200",
                    isDragging
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-muted-foreground/40 hover:bg-secondary/30",
                  )}
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                    <Upload
                      className="w-6 h-6 text-muted-foreground/30"
                      strokeWidth={1.5}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-body font-medium text-foreground">
                      Kéo thả ảnh quần áo vào đây
                    </p>
                    <p className="text-xs text-muted-foreground font-body mt-1">
                      hoặc nhấn để chọn · PNG, JPG tối đa 10MB
                    </p>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(file);
                    }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors"
                  >
                    <ImagePlus
                      className="w-4 h-4 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <span className="text-[10px] font-body text-muted-foreground">
                      Tải ảnh
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
                    <Camera
                      className="w-4 h-4 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <span className="text-[10px] font-body text-muted-foreground">
                      Chụp ảnh
                    </span>
                  </button>
                  <button className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border hover:bg-secondary/50 transition-colors">
                    <ShoppingBag
                      className="w-4 h-4 text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <span className="text-[10px] font-body text-muted-foreground">
                      Từ lịch sử
                    </span>
                  </button>
                </div>
              </div>
            )}

            {step === "analyzing" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center py-10 gap-4"
              >
                <div className="relative">
                  {preview && (
                    <img
                      src={preview}
                      alt="Đã tải"
                      className="w-28 h-28 rounded-2xl object-cover border border-border"
                    />
                  )}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      ease: "linear",
                    }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-teal/15 flex items-center justify-center"
                  >
                    <Sparkles className="w-4 h-4 text-teal" />
                  </motion.div>
                </div>
                <div className="text-center">
                  <p className="text-sm font-body font-medium text-foreground">
                    Đang phân tích món đồ...
                  </p>
                  <p className="text-xs text-muted-foreground font-body mt-1">
                    Nhận diện loại, màu sắc và phong cách
                  </p>
                </div>
                <Loader2 className="w-5 h-5 text-teal animate-spin" />
              </motion.div>
            )}

            {step === "review" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                <div className="flex gap-4">
                  {preview && (
                    <img
                      src={preview}
                      alt="Quần áo"
                      className="w-24 h-28 rounded-xl object-cover border border-border shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    {isEditing ? (
                      <input
                        value={detectedName}
                        onChange={(e) => setDetectedName(e.target.value)}
                        className="w-full text-sm font-body font-medium text-foreground bg-secondary/50 border border-border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      />
                    ) : (
                      <p className="text-sm font-body font-semibold text-foreground">
                        {detectedName}
                      </p>
                    )}

                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <select
                            value={detectedCategory}
                            onChange={(e) =>
                              setDetectedCategory(e.target.value)
                            }
                            className="text-[11px] font-body bg-secondary border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none"
                          >
                            {categories.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                          <select
                            value={detectedType}
                            onChange={(e) => setDetectedType(e.target.value)}
                            className="text-[11px] font-body bg-secondary border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none"
                          >
                            {(types[detectedCategory] || []).map((t) => (
                              <option key={t} value={t}>
                                {t}
                              </option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <>
                          <span className="text-[10px] font-body bg-secondary text-muted-foreground px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {detectedCategory}
                          </span>
                          <span className="text-[10px] font-body text-muted-foreground">
                            {detectedType}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">
                        Màu:
                      </span>
                      {isEditing ? (
                        <div className="flex gap-1">
                          {colorOptions.map((c) => (
                            <button
                              key={c.hex}
                              onClick={() => setDetectedColor(c.hex)}
                              className={cn(
                                "w-5 h-5 rounded-full border-2 transition-all",
                                detectedColor === c.hex
                                  ? "border-accent scale-110"
                                  : "border-border",
                              )}
                              style={{ backgroundColor: c.hex }}
                              title={c.label}
                            />
                          ))}
                        </div>
                      ) : (
                        <span
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: detectedColor }}
                        />
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-2">
                    Phong cách AI gợi ý
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {styleTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => isEditing && toggleTag(tag)}
                        className={cn(
                          "text-[10px] px-2.5 py-1 rounded-full font-body font-medium transition-all",
                          detectedTags.includes(tag)
                            ? "bg-accent/10 text-accent border border-accent/20"
                            : "bg-secondary text-muted-foreground border border-transparent",
                          isEditing && "cursor-pointer hover:opacity-80",
                        )}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 rounded-xl gap-1.5 text-xs h-9"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Pencil className="w-3 h-3" />{" "}
                    {isEditing ? "Xong" : "Chỉnh sửa"}
                  </Button>
                  <Button
                    variant="accent"
                    size="sm"
                    className="flex-1 rounded-xl gap-1.5 text-xs h-9"
                    onClick={handleConfirm}
                  >
                    <Check className="w-3.5 h-3.5" /> Xác nhận
                  </Button>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-[10px] font-body text-muted-foreground uppercase tracking-wider mb-2">
                    Ý tưởng outfit với món đồ này
                  </p>
                  <div className="flex items-center gap-2">
                    {wardrobeUploadAnalysisMock.suggestion.map((piece, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <div className="w-7 h-7 rounded-md bg-secondary flex items-center justify-center">
                          <Shirt
                            className="w-3 h-3 text-muted-foreground/25"
                            strokeWidth={1.5}
                          />
                        </div>
                        <span className="text-[10px] font-body text-foreground">
                          {piece.name}
                        </span>
                        {i <
                          wardrobeUploadAnalysisMock.suggestion.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-muted-foreground/30 mx-0.5" />
                        )}
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="teal"
                    size="sm"
                    className="w-full mt-3 rounded-xl gap-1.5 text-[11px] h-8"
                  >
                    <Sparkles className="w-3 h-3" /> Tạo outfit
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "saved" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center py-10 gap-3"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", damping: 15, delay: 0.1 }}
                  className="w-14 h-14 rounded-full bg-teal/15 flex items-center justify-center"
                >
                  <Check className="w-6 h-6 text-teal" strokeWidth={2} />
                </motion.div>
                <p className="text-sm font-body font-semibold text-foreground">
                  Đã thêm vào tủ đồ!
                </p>
                <p className="text-xs text-muted-foreground font-body">
                  AI sẵn sàng tạo outfit với món đồ này.
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WardrobeUploadModal;

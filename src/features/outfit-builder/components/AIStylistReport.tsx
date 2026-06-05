import { BadgeCheck, Calendar, Palette, Shirt, Camera, Clock, BarChart3, Star, Lightbulb, Sparkles, ShieldCheck, Heart } from "lucide-react";
import { motion } from "framer-motion";

interface AIStylistReportProps {
  occasion: string;
  style: string;
  hasOutfit: boolean;
  hasPhoto: boolean;
  tryOnImage: string | null;
  tryOnStatus: string;
}

interface ChecklistItem {
  icon: React.ReactNode;
  label: string;
  status: "pending" | "done";
}

export default function AIStylistReport({
  occasion,
  style,
  hasOutfit,
  hasPhoto,
  tryOnImage,
  tryOnStatus,
}: AIStylistReportProps) {
  const checklist: ChecklistItem[] = [
    { icon: <Calendar className="w-4 h-4" />, label: "Occasion", status: occasion ? "done" : "pending" },
    { icon: <Palette className="w-4 h-4" />, label: "Style Preference", status: style ? "done" : "pending" },
    { icon: <Shirt className="w-4 h-4" />, label: "Outfit Items Selected", status: hasOutfit ? "done" : "pending" },
    { icon: <Camera className="w-4 h-4" />, label: "Model Photo Upload", status: hasPhoto ? "done" : "pending" },
  ];

  const isSucceeded = tryOnStatus === "succeed" && !!tryOnImage;

  // Mock styled suggestions depending on occasion and style chosen
  const getStylistReportData = () => {
    const formattedOccasion = occasion ? occasion.charAt(0).toUpperCase() + occasion.slice(1) : "Casual";
    const formattedStyle = style ? style.charAt(0).toUpperCase() + style.slice(1) : "Minimalist";
    
    return {
      grade: "A+",
      fitScore: 94,
      harmonyScore: 92,
      colors: [
        { hex: "#1A1A1A", name: "Deep Charcoal" },
        { hex: "#EADDC9", name: "Warm Cream" },
        { hex: "#3A506B", name: "Slate Blue" },
      ],
      fitAnalysis: `Phom dáng trang phục phối hợp hoàn chỉnh với chiều cao của người mẫu. Các chi tiết vai và eo cân đối tốt, tạo tỷ lệ silhouette quyến rũ.`,
      colorAnalysis: `Màu chủ đạo ${formattedStyle} kết hợp hài hòa với màu da. Sự tương phản dịu mắt giữa màu trung tính và tông Slate Blue tạo ấn tượng thanh lịch cho dịp ${formattedOccasion}.`,
      recommendation: `Đề xuất thêm thắt lưng da tối bản nhỏ và giày tối giản để tạo điểm nhấn vùng eo. Hoàn thiện với một chiếc đồng hồ dây kim loại mảnh.`,
    };
  };

  const report = getStylistReportData();

  return (
    <aside className="w-[360px] bg-card border-l border-border/30 flex flex-col py-6 px-4 gap-4 shrink-0 z-10 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 shrink-0">
        <div>
          <h2 className="font-heading text-lg font-semibold text-teal flex items-center gap-2">
            AI Stylist Report
            <BadgeCheck className="w-4.5 h-4.5 text-teal" />
          </h2>
          <p className="text-xs font-body text-foreground/60">Analysis & Virtual Fitting Insights</p>
        </div>
        <span className="px-2.5 py-1 bg-teal/10 text-teal border border-teal/20 rounded-xl text-[10px] font-body font-bold uppercase tracking-wider animate-pulse">
          Premium
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-1 custom-scrollbar">
        {/* Preparation Analysis */}
        <section className="shrink-0">
          <h3 className="text-xs font-body font-semibold text-foreground/60 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-foreground/45" /> Checklist Chuẩn Bị
          </h3>
          <div className="bg-background/40 backdrop-blur-md rounded-xl border border-border/30 p-2 flex flex-col gap-1">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-2 rounded-lg transition-colors hover:bg-secondary/20">
                <span className={`transition-colors ${item.status === "done" ? "text-teal" : "text-foreground/40"}`}>
                  {item.icon}
                </span>
                <span className="text-xs font-body flex-1 text-foreground/90">{item.label}</span>
                {item.status === "done" ? (
                  <span className="w-5 h-5 rounded-full bg-teal/10 flex items-center justify-center">
                    <BadgeCheck className="w-3.5 h-3.5 text-teal" />
                  </span>
                ) : (
                  <Clock className="w-4 h-4 text-foreground/30" />
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Analysis Area */}
        <section className="flex flex-col gap-3 flex-1 min-h-[300px]">
          <h3 className="text-xs font-body font-semibold text-foreground/60 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-teal" /> Phân Tích Chi Tiết
          </h3>

          {!isSucceeded ? (
            // --- EMPTY / INCOMPLETE STATE ---
            <div className="flex-1 bg-secondary/20 rounded-xl border border-dashed border-border/50 flex flex-col items-center justify-center p-6 text-center">
              <BarChart3 className="w-8 h-8 text-foreground/30 mb-2.5" />
              <p className="text-xs font-body text-foreground/70 mb-1 font-medium">Báo cáo đang bị khóa</p>
              <p className="text-[11px] font-body text-foreground/50 mb-5 max-w-[200px] leading-relaxed">
                Hoàn thành thử đồ ảo (Virtual Try-On) để mở khóa báo cáo chi tiết từ AI.
              </p>
              
              {/* Animated Placeholder Cards */}
              <div className="w-full flex flex-col gap-2.5 opacity-30 select-none pointer-events-none">
                <div className="h-16 bg-background rounded-xl border border-border/30 flex items-center px-3 gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Star className="w-3.5 h-3.5 text-foreground/45" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="h-3 w-16 bg-secondary rounded mb-1.5" />
                    <div className="h-2 w-24 bg-secondary rounded" />
                  </div>
                </div>
                <div className="h-16 bg-background rounded-xl border border-border/30 flex items-center px-3 gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Lightbulb className="w-3.5 h-3.5 text-foreground/45" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="h-3 w-20 bg-secondary rounded mb-1.5" />
                    <div className="h-2 w-full bg-secondary rounded" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // --- ACTIVE PREMIUM STYLIST REPORT ---
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-grow flex flex-col gap-4"
            >
              {/* Score Dashboard Card */}
              <div className="bg-gradient-to-br from-teal/10 via-teal/[0.02] to-transparent rounded-xl border border-teal/20 p-4 flex items-center justify-between shadow-sm relative overflow-hidden">
                <div className="absolute right-0 top-0 w-24 h-24 bg-teal/5 rounded-full blur-2xl pointer-events-none" />
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-body font-bold text-teal/80 uppercase tracking-widest">
                    Style Match Grade
                  </span>
                  <span className="text-3xl font-heading font-black text-foreground">{report.grade}</span>
                  <span className="text-[11px] font-body text-foreground/60">Tuyệt hảo & Sang trọng</span>
                </div>
                
                <div className="flex gap-4 border-l border-border/40 pl-4">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-body font-semibold text-foreground/50">Dáng ôm</span>
                    <span className="text-sm font-heading font-bold text-foreground mt-0.5">{report.fitScore}%</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-body font-semibold text-foreground/50">Phối màu</span>
                    <span className="text-sm font-heading font-bold text-foreground mt-0.5">{report.harmonyScore}%</span>
                  </div>
                </div>
              </div>

              {/* Color Palette Analysis */}
              <div className="bg-background/30 rounded-xl border border-border/30 p-3.5 flex flex-col gap-3">
                <h4 className="text-xs font-body font-bold text-foreground/75 uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-foreground/45" /> Bảng Màu Tương Thích
                </h4>
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {report.colors.map((c) => (
                      <div
                        key={c.hex}
                        className="w-8 h-8 rounded-full border-2 border-card shadow-sm hover:translate-y-[-2px] transition-transform duration-200"
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      />
                    ))}
                  </div>
                  <div className="flex-1">
                    <p className="text-[11px] font-body text-foreground/75 leading-relaxed">
                      Sử dụng các màu {report.colors.map(c => c.name).join(", ")} làm điểm nhấn tương thích.
                    </p>
                  </div>
                </div>
              </div>

              {/* Silhouette Fit & Fit Analysis */}
              <div className="bg-background/30 rounded-xl border border-border/30 p-3.5 flex flex-col gap-3.5">
                <div>
                  <h4 className="text-xs font-body font-bold text-foreground/75 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Star className="w-3.5 h-3.5 text-foreground/45" /> Đánh Giá Dáng Người
                  </h4>
                  {/* Progress bar */}
                  <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-teal h-1.5 rounded-full transition-all duration-1000"
                      style={{ width: `${report.fitScore}%` }}
                    />
                  </div>
                  <p className="text-[11px] font-body text-foreground/60 leading-relaxed mt-2.5">
                    {report.fitAnalysis}
                  </p>
                </div>
                
                <div className="border-t border-border/20 pt-3">
                  <h4 className="text-xs font-body font-bold text-foreground/75 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Heart className="w-3.5 h-3.5 text-foreground/45" /> Phối Màu Sắc & Ánh Sáng
                  </h4>
                  <p className="text-[11px] font-body text-foreground/60 leading-relaxed">
                    {report.colorAnalysis}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              <div className="bg-gradient-to-br from-yellow-500/[0.07] to-transparent rounded-xl border border-yellow-500/10 p-3.5 flex gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                </div>
                <div className="flex-grow">
                  <h4 className="text-xs font-body font-bold text-foreground/80 mb-1">Lời Khuyên Từ Stylist</h4>
                  <p className="text-[11px] font-body text-foreground/65 leading-relaxed">
                    {report.recommendation}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </section>
      </div>
    </aside>
  );
}


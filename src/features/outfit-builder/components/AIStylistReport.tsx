import { BadgeCheck, Calendar, Palette, Shirt, Camera, Clock, BarChart3, Star, Lightbulb } from "lucide-react";

interface AIStylistReportProps {
  occasion: string;
  style: string;
  hasOutfit: boolean;
}

interface ChecklistItem {
  icon: React.ReactNode;
  label: string;
  status: "pending" | "done";
}

export default function AIStylistReport({ occasion, style, hasOutfit }: AIStylistReportProps) {
  const checklist: ChecklistItem[] = [
    { icon: <Calendar className="w-4 h-4" />, label: "Occasion", status: occasion ? "done" : "pending" },
    { icon: <Palette className="w-4 h-4" />, label: "Style", status: style ? "done" : "pending" },
    { icon: <Shirt className="w-4 h-4" />, label: "Outfit", status: hasOutfit ? "done" : "pending" },
    { icon: <Camera className="w-4 h-4" />, label: "Photo Quality", status: "pending" },
  ];

  return (
    <aside className="w-[360px] bg-card border-l border-border/30 flex flex-col py-6 px-4 gap-4 shrink-0 z-10 h-full">
      {/* Header */}
      <div className="flex items-start justify-between mb-2 shrink-0">
        <div>
          <h2 className="font-heading text-lg font-semibold text-teal flex items-center gap-2">
            AI Stylist Report
            <BadgeCheck className="w-4 h-4 text-teal" />
          </h2>
          <p className="text-xs font-body text-foreground/60">Analysis & Insights</p>
        </div>
        <span className="px-2 py-1 bg-accent/10 text-accent border border-accent/20 rounded-xl text-[10px] font-body font-semibold uppercase tracking-wider">
          Premium
        </span>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-6 pr-2">
        {/* Preparation Analysis */}
        <section>
          <h3 className="text-xs font-body font-semibold text-foreground/60 uppercase tracking-wider mb-3">Preparation Analysis</h3>
          <div className="bg-background rounded-xl border border-border/50 p-2 flex flex-col gap-1">
            {checklist.map((item) => (
              <div key={item.label} className="flex items-center gap-3 p-2 rounded-xl">
                <span className="text-foreground/40">{item.icon}</span>
                <span className="text-sm font-body flex-1 text-foreground">{item.label}</span>
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

        {/* Detailed Analysis Empty State */}
        <section className="flex flex-col gap-3 flex-1">
          <h3 className="text-xs font-body font-semibold text-foreground/60 uppercase tracking-wider">Detailed Analysis</h3>
          <div className="flex-1 bg-secondary/30 rounded-xl border border-dashed border-border/50 flex flex-col items-center justify-center p-4 text-center">
            <BarChart3 className="w-8 h-8 text-foreground/30 mb-2" />
            <p className="text-xs font-body text-foreground/60 mb-4 max-w-[200px]">Complete try-on to receive detailed AI analysis.</p>
            {/* Placeholder Cards */}
            <div className="w-full flex flex-col gap-2 opacity-40">
              <div className="h-16 bg-card rounded-xl border border-border/30 flex items-center px-3 gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 text-foreground/40" />
                </div>
                <div className="flex-1 text-left">
                  <div className="h-3 w-16 bg-secondary rounded mb-1" />
                  <div className="h-2 w-24 bg-secondary rounded" />
                </div>
              </div>
              <div className="h-16 bg-card rounded-xl border border-border/30 flex items-center px-3 gap-3">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Lightbulb className="w-3.5 h-3.5 text-foreground/40" />
                </div>
                <div className="flex-1 text-left">
                  <div className="h-3 w-20 bg-secondary rounded mb-1" />
                  <div className="h-2 w-full bg-secondary rounded" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}

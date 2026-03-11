import { StatCard } from "@/components/admin/StatCard";
import { Sparkles, Target, Eye, Brain, TrendingUp, Heart } from "lucide-react";

const aiGenerations = [
  { day: "Mon", count: 820 }, { day: "Tue", count: 1050 },
  { day: "Wed", count: 940 }, { day: "Thu", count: 1200 },
  { day: "Fri", count: 1580 }, { day: "Sat", count: 1890 },
  { day: "Sun", count: 1640 },
];

const accuracy = [
  { month: "Jan", rate: 78 }, { month: "Feb", rate: 82 },
  { month: "Mar", rate: 85 }, { month: "Apr", rate: 87 },
  { month: "May", rate: 91 }, { month: "Jun", rate: 93 },
];

const topPrompts = [
  { prompt: "Office outfit for summer", count: 1240 },
  { prompt: "Casual weekend look", count: 980 },
  { prompt: "Date night elegant", count: 870 },
  { prompt: "Streetwear Korean style", count: 760 },
  { prompt: "Beach vacation outfit", count: 650 },
];

const failedDetections = [
  { item: "Patterned shirts", count: 342, rate: "12%" },
  { item: "Layered outfits", count: 218, rate: "8%" },
  { item: "Dark accessories", count: 156, rate: "6%" },
  { item: "Transparent fabrics", count: 98, rate: "4%" },
];

const maxGen = Math.max(...aiGenerations.map(d => d.count));
const maxAcc = 100;

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">AI Analytics</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Monitor AI performance and user engagement</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Generations" value="145K" change="23% this month" trend="up" icon={Sparkles} />
        <StatCard label="Detection Accuracy" value="93.2%" change="2.1% improvement" trend="up" icon={Target} />
        <StatCard label="Avg. Confidence" value="87.5%" change="1.8% this week" trend="up" icon={Brain} />
        <StatCard label="Top Style" value="Casual" icon={TrendingUp} />
        <StatCard label="Most Saved" value="2,341" change="18% this week" trend="up" icon={Heart} />
        <StatCard label="Failed Detections" value="814" change="5% decrease" trend="up" icon={Eye} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Daily AI Generations */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Daily AI Generations</h3>
          <div className="flex items-end gap-3 h-[220px]">
            {aiGenerations.map((d) => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-body text-muted-foreground">{d.count.toLocaleString()}</span>
                <div className="w-full bg-muted rounded-sm overflow-hidden flex-1 flex flex-col justify-end">
                  <div
                    className="w-full bg-accent transition-all duration-500 rounded-t-sm"
                    style={{ height: `${(d.count / maxGen) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-body text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detection Accuracy Trend */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Detection Accuracy Trend</h3>
          <div className="space-y-3 mt-2">
            {accuracy.map((d) => (
              <div key={d.month}>
                <div className="flex justify-between mb-1">
                  <span className="text-xs font-body text-foreground">{d.month}</span>
                  <span className="text-xs font-semibold font-body text-teal">{d.rate}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-teal rounded-full transition-all duration-500" style={{ width: `${(d.rate / maxAcc) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Top Prompt Types</h3>
          <div className="space-y-3">
            {topPrompts.map((p, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground font-body w-5">{i + 1}</span>
                  <span className="text-sm font-body">{p.prompt}</span>
                </div>
                <span className="text-sm font-semibold font-body text-foreground">{p.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Common Failed Detections</h3>
          <div className="space-y-3">
            {failedDetections.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <span className="text-sm font-body">{f.item}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-body text-muted-foreground">{f.count} cases</span>
                  <span className="text-sm font-semibold font-body text-destructive">{f.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

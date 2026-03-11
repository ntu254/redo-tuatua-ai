import { StatCard } from "@/components/admin/StatCard";
import { Sparkles, Target, Eye, Brain, TrendingUp, Heart } from "lucide-react";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";

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

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Daily AI Generations</h3>
          <ChartContainer config={{ count: { label: "Generations", color: "hsl(0,100%,70%)" } }} className="h-[260px] w-full">
            <BarChart data={aiGenerations}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="day" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(0,100%,70%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>

        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Detection Accuracy Trend</h3>
          <ChartContainer config={{ rate: { label: "Accuracy %", color: "hsl(166,65%,50%)" } }} className="h-[260px] w-full">
            <LineChart data={accuracy}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" domain={[70, 100]} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="rate" stroke="hsl(166,65%,50%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </div>
      </div>

      {/* Tables */}
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

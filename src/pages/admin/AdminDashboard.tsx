import { Users, Activity, Sparkles, Upload, Heart, MousePointerClick } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import {
  ChartContainer, ChartTooltip, ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar,
  PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";

const userGrowth = [
  { month: "Jan", users: 1200 }, { month: "Feb", users: 1800 },
  { month: "Mar", users: 2400 }, { month: "Apr", users: 3100 },
  { month: "May", users: 4200 }, { month: "Jun", users: 5800 },
];
const topStyles = [
  { style: "Casual", count: 3200 }, { style: "Streetwear", count: 2800 },
  { style: "Office", count: 2100 }, { style: "Date Night", count: 1800 },
  { style: "Athleisure", count: 1400 },
];
const categories = [
  { name: "Casual", value: 35 }, { name: "Formal", value: 25 },
  { name: "Street", value: 22 }, { name: "Sport", value: 18 },
];
const PIE_COLORS = ["hsl(0,100%,70%)", "hsl(166,65%,50%)", "hsl(0,0%,60%)", "hsl(0,0%,80%)"];

const recentActivity = [
  { user: "Minh Anh", action: "Generated outfit", time: "2 min ago" },
  { user: "Thanh Hà", action: "Uploaded 5 wardrobe items", time: "8 min ago" },
  { user: "Duc Phong", action: "Saved outfit to collection", time: "15 min ago" },
  { user: "Linh Chi", action: "Completed style quiz", time: "22 min ago" },
  { user: "Hoang Nam", action: "Clicked affiliate link", time: "30 min ago" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">Dashboard</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Overview of your platform performance</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Users" value="12,847" change="12% vs last month" trend="up" icon={Users} />
        <StatCard label="Active Today" value="1,342" change="8% vs yesterday" trend="up" icon={Activity} />
        <StatCard label="Outfits Generated" value="45,291" change="23% this week" trend="up" icon={Sparkles} />
        <StatCard label="Wardrobe Uploads" value="89,120" change="5% this week" trend="up" icon={Upload} />
        <StatCard label="Saved Outfits" value="23,456" change="18% this month" trend="up" icon={Heart} />
        <StatCard label="Affiliate Clicks" value="8,712" change="3% vs last week" trend="down" icon={MousePointerClick} />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* User Growth */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">User Growth</h3>
          <ChartContainer config={{ users: { label: "Users", color: "hsl(0,100%,70%)" } }} className="h-[260px] w-full">
            <LineChart data={userGrowth}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="month" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="users" stroke="hsl(0,100%,70%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ChartContainer>
        </div>

        {/* Outfit Categories Pie */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Outfit Categories</h3>
          <ChartContainer config={{ value: { label: "Outfits" } }} className="h-[260px] w-full">
            <PieChart>
              <Pie data={categories} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" paddingAngle={4}>
                {categories.map((_, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
          <div className="flex flex-wrap gap-3 mt-2 justify-center">
            {categories.map((c, i) => (
              <div key={c.name} className="flex items-center gap-1.5 text-xs font-body text-muted-foreground">
                <span className="h-2 w-2 rounded-full" style={{ background: PIE_COLORS[i] }} />{c.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top Styles */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Top Styles</h3>
          <ChartContainer config={{ count: { label: "Count", color: "hsl(0,100%,70%)" } }} className="h-[220px] w-full">
            <BarChart data={topStyles}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="style" className="text-xs" />
              <YAxis className="text-xs" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="hsl(0,100%,70%)" />
            </BarChart>
          </ChartContainer>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">
                    {a.user[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground font-body">{a.user}</p>
                    <p className="text-xs text-muted-foreground font-body">{a.action}</p>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground font-body">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

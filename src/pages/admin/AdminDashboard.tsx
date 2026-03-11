import { Users, Activity, Sparkles, Upload, Heart, MousePointerClick } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";

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
  { name: "Casual", value: 35, color: "bg-accent" },
  { name: "Formal", value: 25, color: "bg-teal" },
  { name: "Street", value: 22, color: "bg-muted-foreground" },
  { name: "Sport", value: 18, color: "bg-border" },
];

const recentActivity = [
  { user: "Minh Anh", action: "Generated outfit", time: "2 min ago" },
  { user: "Thanh Hà", action: "Uploaded 5 wardrobe items", time: "8 min ago" },
  { user: "Duc Phong", action: "Saved outfit to collection", time: "15 min ago" },
  { user: "Linh Chi", action: "Completed style quiz", time: "22 min ago" },
  { user: "Hoang Nam", action: "Clicked affiliate link", time: "30 min ago" },
];

const maxUsers = Math.max(...userGrowth.map(d => d.users));
const maxStyle = Math.max(...topStyles.map(d => d.count));

export default function AdminDashboard() {
  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">Dashboard</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Overview of your platform performance</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard label="Total Users" value="12,847" change="12% vs last month" trend="up" icon={Users} />
        <StatCard label="Active Today" value="1,342" change="8% vs yesterday" trend="up" icon={Activity} />
        <StatCard label="Outfits Generated" value="45,291" change="23% this week" trend="up" icon={Sparkles} />
        <StatCard label="Wardrobe Uploads" value="89,120" change="5% this week" trend="up" icon={Upload} />
        <StatCard label="Saved Outfits" value="23,456" change="18% this month" trend="up" icon={Heart} />
        <StatCard label="Affiliate Clicks" value="8,712" change="3% vs last week" trend="down" icon={MousePointerClick} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* User Growth - Line chart as CSS bars */}
        <div className="lg:col-span-2 bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">User Growth</h3>
          <div className="flex items-end gap-3 h-[220px]">
            {userGrowth.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-[10px] font-body text-muted-foreground">{d.users.toLocaleString()}</span>
                <div className="w-full bg-muted rounded-sm overflow-hidden flex-1 flex flex-col justify-end">
                  <div
                    className="w-full bg-accent transition-all duration-500 rounded-t-sm"
                    style={{ height: `${(d.users / maxUsers) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] font-body text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Outfit Categories */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Outfit Categories</h3>
          <div className="space-y-4 mt-6">
            {categories.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-body text-foreground">{c.name}</span>
                  <span className="text-xs font-body text-muted-foreground">{c.value}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${c.color} rounded-full transition-all duration-500`} style={{ width: `${c.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top Styles */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Top Styles</h3>
          <div className="space-y-3">
            {topStyles.map((s) => (
              <div key={s.style}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-body text-foreground">{s.style}</span>
                  <span className="text-xs font-body text-muted-foreground">{s.count.toLocaleString()}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${(s.count / maxStyle) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card border border-border rounded-lg p-5">
          <h3 className="text-sm font-semibold text-foreground font-body mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">{a.user[0]}</div>
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

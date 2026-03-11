import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Lock, Shield, Bell, Crown, AlertTriangle, Edit2, Check, X,
  ExternalLink, ShoppingBag, Trash2, LogOut, Sparkles, KeyRound, MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";

/* ── Tab definitions ── */
const tabs = [
  { id: "profile", label: "Hồ sơ", icon: User },
  { id: "security", label: "Bảo mật", icon: Shield },
  { id: "platforms", label: "Nền tảng kết nối", icon: ExternalLink },
  { id: "notifications", label: "Thông báo", icon: Bell },
  { id: "subscription", label: "Gói đăng ký", icon: Crown },
  { id: "danger", label: "Vùng nguy hiểm", icon: AlertTriangle },
];

const platforms = [
  { name: "Shopee", connected: true, accent: "bg-orange-500" },
  { name: "Lazada", connected: true, accent: "bg-blue-600" },
  { name: "Tiki", connected: false, accent: "bg-sky-500" },
  { name: "Zalora", connected: true, accent: "bg-foreground" },
  { name: "TikTok Shop", connected: false, accent: "bg-foreground" },
];

const premiumPerks = [
  "Tạo outfit không giới hạn",
  "Phân tích phong cách nâng cao",
  "AI gợi ý ưu tiên",
  "Truy cập xu hướng sớm",
];

/* ── Shared UI ── */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border bg-card p-6 md:p-8 ${className}`}>{children}</div>
);

const SectionHead = ({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub?: string }) => (
  <div className="mb-6">
    <div className="flex items-center gap-2.5">
      <Icon className="w-4 h-4 text-accent" />
      <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
    </div>
    {sub && <p className="font-body text-sm text-muted-foreground mt-1 ml-[26px]">{sub}</p>}
  </div>
);

const panelAnim = {
  initial: { opacity: 0, x: 12 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -12 },
  transition: { duration: 0.25 },
};

/* ── Tab Panels ── */

const ProfilePanel = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Tu Nguyen", email: "tu.nguyen@email.com", username: "tunguyen",
    location: "Ho Chi Minh City", bio: "Fashion lover exploring minimalist outfits with AI styling.",
  });

  return (
    <Card>
      {/* Avatar header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8 pb-6 border-b border-border">
        <motion.div className="w-20 h-20 bg-secondary border border-border flex items-center justify-center shrink-0" whileHover={{ scale: 1.05 }}>
          <span className="font-heading text-2xl font-semibold text-foreground">TN</span>
        </motion.div>
        <div className="flex-1 min-w-0">
          <h2 className="font-heading text-xl font-semibold text-foreground">{profile.name}</h2>
          <span className="text-[11px] font-body font-medium text-accent uppercase tracking-wider">Urban Minimalist</span>
          <p className="text-muted-foreground font-body text-sm mt-1 leading-relaxed">{profile.bio}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" size="sm" className="gap-2 font-body" onClick={() => setEditing(!editing)}>
            <Edit2 className="w-3.5 h-3.5" /> {editing ? "Hủy" : "Chỉnh sửa"}
          </Button>
          <Link to="/wardrobe">
            <Button variant="accent" size="sm" className="gap-2 font-body"><ShoppingBag className="w-3.5 h-3.5" /> Tủ đồ</Button>
          </Link>
        </div>
      </div>

      <SectionHead icon={User} title="Thông tin cá nhân" />
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[11px] font-body text-muted-foreground uppercase tracking-wider">Email</Label>
            <Input value={profile.email} disabled={!editing} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="font-body" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[11px] font-body text-muted-foreground uppercase tracking-wider">Username</Label>
            <Input value={profile.username} disabled={!editing} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} className="font-body" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-body text-muted-foreground uppercase tracking-wider">Địa điểm</Label>
          <Input value={profile.location} disabled={!editing} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} className="font-body" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-[11px] font-body text-muted-foreground uppercase tracking-wider">Giới thiệu</Label>
          <Textarea value={profile.bio} disabled={!editing} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} className="font-body resize-none" rows={3} />
        </div>
        <AnimatePresence>
          {editing && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2 pt-2">
              <Button variant="accent" size="sm" className="gap-2 font-body" onClick={() => setEditing(false)}><Check className="w-3.5 h-3.5" /> Lưu</Button>
              <Button variant="outline" size="sm" className="gap-2 font-body" onClick={() => setEditing(false)}><X className="w-3.5 h-3.5" /> Hủy</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
};

const SecurityPanel = () => (
  <Card>
    <SectionHead icon={Shield} title="Bảo mật" sub="Quản lý mật khẩu và xác thực" />
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary flex items-center justify-center"><KeyRound className="w-4 h-4 text-muted-foreground" /></div>
          <div>
            <p className="font-body text-sm font-medium text-foreground">Mật khẩu</p>
            <p className="font-body text-[11px] text-muted-foreground">Cập nhật lần cuối 3 tháng trước</p>
          </div>
        </div>
        <Button variant="outline" size="sm" className="gap-2 font-body"><Lock className="w-3.5 h-3.5" /> Đổi mật khẩu</Button>
      </div>
      <div className="border-t border-border pt-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-secondary flex items-center justify-center"><Shield className="w-4 h-4 text-muted-foreground" /></div>
          <div>
            <p className="font-body text-sm font-medium text-foreground">Xác thực hai yếu tố</p>
            <p className="font-body text-[11px] text-muted-foreground">Bảo vệ tài khoản bằng mã xác thực</p>
          </div>
        </div>
        <Switch />
      </div>
    </div>
  </Card>
);

const PlatformsPanel = () => (
  <Card>
    <SectionHead icon={ExternalLink} title="Nền tảng kết nối" sub="Kết nối tài khoản mua sắm của bạn" />
    {platforms.map((p, i) => (
      <div key={p.name} className={`flex items-center justify-between py-4 ${i < platforms.length - 1 ? "border-b border-border" : ""}`}>
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 ${p.accent} flex items-center justify-center`}>
            <span className="text-white text-xs font-body font-bold">{p.name[0]}</span>
          </div>
          <div>
            <p className="font-body text-sm font-medium text-foreground">{p.name}</p>
            <p className={`text-[11px] font-body ${p.connected ? "text-green-600" : "text-muted-foreground"}`}>
              {p.connected ? "Đã kết nối" : "Chưa kết nối"}
            </p>
          </div>
        </div>
        <Button variant={p.connected ? "outline" : "accent"} size="sm" className="font-body text-xs h-8">
          {p.connected ? "Ngắt kết nối" : "Kết nối"}
        </Button>
      </div>
    ))}
  </Card>
);

const NotificationsPanel = () => {
  const [notifs, setNotifs] = useState({ trends: true, outfits: true, discounts: false });
  const items = [
    { key: "trends" as const, label: "Cập nhật xu hướng", desc: "Xu hướng thời trang mới nhất" },
    { key: "outfits" as const, label: "Gợi ý outfit", desc: "AI gợi ý outfit phù hợp" },
    { key: "discounts" as const, label: "Ưu đãi mua sắm", desc: "Giảm giá từ sàn kết nối" },
  ];
  return (
    <Card>
      <SectionHead icon={Bell} title="Thông báo" sub="Tùy chỉnh cách bạn nhận thông báo" />
      {items.map((item, i) => (
        <div key={item.key} className={`flex items-center justify-between py-4 ${i < items.length - 1 ? "border-b border-border" : ""}`}>
          <div>
            <p className="font-body text-sm font-medium text-foreground">{item.label}</p>
            <p className="font-body text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
          </div>
          <Switch checked={notifs[item.key]} onCheckedChange={(v) => setNotifs(n => ({ ...n, [item.key]: v }))} />
        </div>
      ))}
    </Card>
  );
};

const SubscriptionPanel = () => (
  <Card className="relative overflow-hidden">
    <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 -translate-y-12 translate-x-12" />
    <SectionHead icon={Crown} title="Gói đăng ký" />
    <div className="flex flex-col sm:flex-row gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="font-heading text-xl font-semibold text-foreground">Free</span>
          <span className="text-[10px] font-body uppercase tracking-wider bg-secondary text-muted-foreground px-2 py-0.5">Hiện tại</span>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-4">Nâng cấp để mở khóa toàn bộ tính năng AI styling.</p>
        <ul className="space-y-2.5">
          {premiumPerks.map((f) => (
            <li key={f} className="flex items-center gap-2.5">
              <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="font-body text-sm text-foreground">{f}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="sm:self-end">
        <Button variant="accent" className="gap-2 font-body w-full sm:w-auto"><Crown className="w-4 h-4" /> Nâng cấp Premium</Button>
      </div>
    </div>
  </Card>
);

const DangerPanel = () => {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <Card className="border-destructive/20">
      <SectionHead icon={AlertTriangle} title="Vùng nguy hiểm" sub="Hành động không thể hoàn tác" />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-medium text-foreground">Đăng xuất</p>
            <p className="font-body text-[11px] text-muted-foreground">Đăng xuất khỏi tài khoản hiện tại</p>
          </div>
          <Button variant="outline" className="gap-2 font-body"><LogOut className="w-4 h-4" /> Đăng xuất</Button>
        </div>
        <div className="border-t border-border pt-6 flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-medium text-destructive">Xóa tài khoản</p>
            <p className="font-body text-[11px] text-muted-foreground">Xóa vĩnh viễn tài khoản và toàn bộ dữ liệu</p>
          </div>
          {!showDelete ? (
            <Button variant="outline" size="sm" className="font-body text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => setShowDelete(true)}>
              <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Xóa tài khoản
            </Button>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
              <Button variant="destructive" size="sm" className="font-body text-xs gap-1.5"><Trash2 className="w-3.5 h-3.5" /> Xác nhận xóa</Button>
              <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => setShowDelete(false)}>Hủy</Button>
            </motion.div>
          )}
        </div>
      </div>
    </Card>
  );
};

const panelMap: Record<string, React.FC> = {
  profile: ProfilePanel,
  security: SecurityPanel,
  platforms: PlatformsPanel,
  notifications: NotificationsPanel,
  subscription: SubscriptionPanel,
  danger: DangerPanel,
};

/* ════════════════════════════════════════════ */

const Profile = () => {
  const [active, setActive] = useState("profile");
  const ActivePanel = panelMap[active];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="pt-16 border-b border-border">
        <div className="container mx-auto px-6 py-10 md:py-12">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
            <p className="editorial-label mb-2">Tài khoản</p>
            <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">Cài đặt tài khoản</h1>
            <p className="text-muted-foreground font-body text-sm mt-2 max-w-lg">Quản lý thông tin cá nhân, bảo mật và các dịch vụ kết nối.</p>
          </motion.div>
        </div>
      </div>

      {/* Two-column */}
      <div className="container mx-auto px-6 py-8 flex gap-8">

        {/* Sidebar — desktop */}
        <aside className="hidden md:block w-56 shrink-0">
          <nav className="sticky top-24 space-y-0.5">
            {tabs.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-all duration-200 relative ${
                    isActive ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-accent transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />
                  <tab.icon className={`w-4 h-4 shrink-0 ${isActive ? "text-accent" : ""}`} />
                  <span className="font-body text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Mobile tabs */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-background border-t border-border flex overflow-x-auto px-2 py-1.5 gap-1 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-body font-medium whitespace-nowrap transition-colors ${
                active === tab.id ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <main className="flex-1 max-w-2xl pb-20 md:pb-0">
          <AnimatePresence mode="wait">
            <motion.div key={active} {...panelAnim}>
              <ActivePanel />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Profile;

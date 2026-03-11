import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Lock, Shield, Bell, Crown, AlertTriangle, Edit2, Check, X,
  ExternalLink, ShoppingBag, Trash2, LogOut, Sparkles, KeyRound,
  HelpCircle, Info, Calendar, Clock, ArrowRight, Palette, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";

const tabs = [
  { id: "profile", label: "Hồ sơ", icon: User },
  { id: "security", label: "Bảo mật", icon: Shield },
  { id: "platforms", label: "Nền tảng", icon: ExternalLink },
  { id: "notifications", label: "Thông báo", icon: Bell },
  { id: "subscription", label: "Đăng ký", icon: Crown },
  { id: "danger", label: "Nguy hiểm", icon: AlertTriangle },
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

/* ── Shared ── */
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border bg-card p-6 ${className}`}>{children}</div>
);

const SectionHead = ({ icon: Icon, title, sub }: { icon: React.ElementType; title: string; sub?: string }) => (
  <div className="mb-5">
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-accent" />
      <h2 className="font-heading text-base font-semibold text-foreground">{title}</h2>
    </div>
    {sub && <p className="font-body text-xs text-muted-foreground mt-1 ml-6">{sub}</p>}
  </div>
);

const InfoCard = ({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) => (
  <Card className="bg-secondary/30">
    <div className="flex items-center gap-2 mb-3">
      <Icon className="w-3.5 h-3.5 text-muted-foreground" />
      <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
    </div>
    <div className="font-body text-sm text-muted-foreground leading-relaxed">{children}</div>
  </Card>
);

const panelAnim = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
  transition: { duration: 0.2 },
};

/* ── Panels ── */

const ProfilePanel = () => {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Tu Nguyen", email: "tu.nguyen@email.com", username: "tunguyen",
    location: "Ho Chi Minh City", bio: "Fashion lover exploring minimalist outfits with AI styling.",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Main */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <div className="flex items-center justify-between mb-5">
            <SectionHead icon={User} title="Thông tin cá nhân" />
            <Button variant="outline" size="sm" className="gap-1.5 font-body text-xs" onClick={() => setEditing(!editing)}>
              <Edit2 className="w-3 h-3" /> {editing ? "Hủy" : "Chỉnh sửa"}
            </Button>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-[11px] font-body text-muted-foreground uppercase tracking-wider">Email</Label>
                <Input value={profile.email} disabled={!editing} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="font-body text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[11px] font-body text-muted-foreground uppercase tracking-wider">Username</Label>
                <Input value={profile.username} disabled={!editing} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} className="font-body text-sm" />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-body text-muted-foreground uppercase tracking-wider">Địa điểm</Label>
              <Input value={profile.location} disabled={!editing} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} className="font-body text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[11px] font-body text-muted-foreground uppercase tracking-wider">Giới thiệu</Label>
              <Textarea value={profile.bio} disabled={!editing} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} className="font-body text-sm resize-none" rows={3} />
            </div>
            <AnimatePresence>
              {editing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex gap-2 pt-1">
                  <Button variant="accent" size="sm" className="gap-1.5 font-body text-xs" onClick={() => setEditing(false)}><Check className="w-3 h-3" /> Lưu</Button>
                  <Button variant="outline" size="sm" className="gap-1.5 font-body text-xs" onClick={() => setEditing(false)}><X className="w-3 h-3" /> Hủy</Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Card>
      </div>

      {/* Side */}
      <div className="space-y-4">
        <Card>
          <div className="flex items-center gap-4 mb-4">
            <motion.div className="w-16 h-16 bg-secondary border border-border flex items-center justify-center shrink-0" whileHover={{ scale: 1.05 }}>
              <span className="font-heading text-xl font-semibold text-foreground">TN</span>
            </motion.div>
            <div>
              <p className="font-heading text-base font-semibold text-foreground">Tu Nguyen</p>
              <span className="text-[11px] font-body font-medium text-accent uppercase tracking-wider">Urban Minimalist</span>
            </div>
          </div>
          <div className="space-y-2 text-sm font-body">
            <div className="flex items-center gap-2 text-muted-foreground"><Calendar className="w-3.5 h-3.5" /> Tham gia tháng 1, 2025</div>
            <div className="flex items-center gap-2 text-muted-foreground"><ShoppingBag className="w-3.5 h-3.5" /> 47 món trong tủ đồ</div>
            <div className="flex items-center gap-2 text-muted-foreground"><Palette className="w-3.5 h-3.5" /> 23 outfit đã lưu</div>
          </div>
          <Link to="/style-profile" className="block mt-4">
            <Button variant="outline" size="sm" className="w-full gap-1.5 font-body text-xs"><TrendingUp className="w-3 h-3" /> Xem Style Profile</Button>
          </Link>
        </Card>

        <InfoCard icon={Info} title="Mẹo">
          Hoàn thiện hồ sơ giúp AI hiểu phong cách của bạn chính xác hơn và gợi ý outfit phù hợp hơn.
        </InfoCard>
      </div>
    </div>
  );
};

const SecurityPanel = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div className="lg:col-span-2">
      <Card>
        <SectionHead icon={Shield} title="Bảo mật" sub="Quản lý mật khẩu và xác thực" />
        <div className="space-y-0">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-secondary flex items-center justify-center"><KeyRound className="w-4 h-4 text-muted-foreground" /></div>
              <div>
                <p className="font-body text-sm font-medium text-foreground">Mật khẩu</p>
                <p className="font-body text-[11px] text-muted-foreground">Cập nhật lần cuối 3 tháng trước</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 font-body text-xs"><Lock className="w-3 h-3" /> Đổi mật khẩu</Button>
          </div>
          <div className="border-t border-border py-4 flex items-center justify-between">
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
    </div>
    <div className="space-y-4">
      <InfoCard icon={Shield} title="Bảo mật tài khoản">
        Bật xác thực hai yếu tố để tăng cường bảo mật. Mỗi lần đăng nhập sẽ yêu cầu mã xác thực từ ứng dụng authenticator.
      </InfoCard>
      <InfoCard icon={Clock} title="Hoạt động gần đây">
        <p className="mb-1">Đăng nhập lần cuối:</p>
        <p className="text-foreground font-medium">Hôm nay, 14:30</p>
        <p className="text-xs mt-1">Chrome · Ho Chi Minh City</p>
      </InfoCard>
    </div>
  </div>
);

const PlatformsPanel = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div className="lg:col-span-2">
      <Card>
        <SectionHead icon={ExternalLink} title="Nền tảng kết nối" sub="Kết nối tài khoản mua sắm" />
        {platforms.map((p, i) => (
          <div key={p.name} className={`flex items-center justify-between py-3.5 ${i < platforms.length - 1 ? "border-b border-border" : ""}`}>
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
    </div>
    <div className="space-y-4">
      <Card className="bg-secondary/30">
        <div className="flex items-center gap-2 mb-3">
          <ShoppingBag className="w-3.5 h-3.5 text-accent" />
          <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tổng quan</p>
        </div>
        <div className="space-y-3 font-body text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Đã kết nối</span><span className="font-semibold text-foreground">3 / 5</span></div>
          <div className="w-full h-1.5 bg-border"><div className="h-full bg-accent" style={{ width: "60%" }} /></div>
        </div>
      </Card>
      <InfoCard icon={Info} title="Lợi ích kết nối">
        Kết nối tài khoản mua sắm để nhận gợi ý sản phẩm phù hợp phong cách và theo dõi giá ưu đãi.
      </InfoCard>
    </div>
  </div>
);

const NotificationsPanel = () => {
  const [notifs, setNotifs] = useState({ trends: true, outfits: true, discounts: false });
  const items = [
    { key: "trends" as const, label: "Cập nhật xu hướng", desc: "Xu hướng thời trang mới nhất", icon: TrendingUp },
    { key: "outfits" as const, label: "Gợi ý outfit", desc: "AI gợi ý outfit phù hợp", icon: Sparkles },
    { key: "discounts" as const, label: "Ưu đãi mua sắm", desc: "Giảm giá từ sàn kết nối", icon: ShoppingBag },
  ];
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card>
          <SectionHead icon={Bell} title="Thông báo" sub="Tùy chỉnh cách bạn nhận thông báo" />
          {items.map((item, i) => (
            <div key={item.key} className={`flex items-center justify-between py-4 ${i < items.length - 1 ? "border-b border-border" : ""}`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary flex items-center justify-center"><item.icon className="w-4 h-4 text-muted-foreground" /></div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">{item.label}</p>
                  <p className="font-body text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
              </div>
              <Switch checked={notifs[item.key]} onCheckedChange={(v) => setNotifs(n => ({ ...n, [item.key]: v }))} />
            </div>
          ))}
        </Card>
      </div>
      <div>
        <InfoCard icon={Bell} title="Về thông báo">
          Bạn có thể bật/tắt từng loại thông báo riêng. Chúng tôi sẽ gửi qua email và thông báo trong ứng dụng.
        </InfoCard>
      </div>
    </div>
  );
};

const SubscriptionPanel = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
    <div className="lg:col-span-2">
      <Card className="relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 -translate-y-12 translate-x-12" />
        <SectionHead icon={Crown} title="Gói đăng ký" />
        <div className="flex items-center gap-2 mb-4">
          <span className="font-heading text-xl font-semibold text-foreground">Free</span>
          <span className="text-[10px] font-body uppercase tracking-wider bg-secondary text-muted-foreground px-2 py-0.5">Hiện tại</span>
        </div>
        <p className="font-body text-sm text-muted-foreground mb-5">Nâng cấp để mở khóa toàn bộ tính năng AI styling.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {premiumPerks.map((f) => (
            <div key={f} className="flex items-center gap-2.5 p-3 bg-secondary/40 border border-border">
              <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
              <span className="font-body text-sm text-foreground">{f}</span>
            </div>
          ))}
        </div>
        <Button variant="accent" className="gap-2 font-body"><Crown className="w-4 h-4" /> Nâng cấp Premium</Button>
      </Card>
    </div>
    <div className="space-y-4">
      <Card className="bg-secondary/30">
        <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Sử dụng tháng này</p>
        <div className="space-y-3 font-body text-sm">
          <div><div className="flex justify-between mb-1"><span className="text-muted-foreground">Outfit đã tạo</span><span className="text-foreground font-medium">8 / 10</span></div><div className="w-full h-1.5 bg-border"><div className="h-full bg-accent" style={{ width: "80%" }} /></div></div>
          <div><div className="flex justify-between mb-1"><span className="text-muted-foreground">AI phân tích</span><span className="text-foreground font-medium">3 / 5</span></div><div className="w-full h-1.5 bg-border"><div className="h-full bg-accent" style={{ width: "60%" }} /></div></div>
        </div>
      </Card>
      <InfoCard icon={Crown} title="Premium">
        Gói Premium bao gồm tạo outfit không giới hạn, phân tích nâng cao và hỗ trợ ưu tiên.
      </InfoCard>
    </div>
  </div>
);

const DangerPanel = () => {
  const [showDelete, setShowDelete] = useState(false);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card className="border-destructive/20">
          <SectionHead icon={AlertTriangle} title="Vùng nguy hiểm" sub="Hành động không thể hoàn tác" />
          <div className="space-y-0">
            <div className="flex items-center justify-between py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary flex items-center justify-center"><LogOut className="w-4 h-4 text-muted-foreground" /></div>
                <div>
                  <p className="font-body text-sm font-medium text-foreground">Đăng xuất</p>
                  <p className="font-body text-[11px] text-muted-foreground">Đăng xuất khỏi tài khoản hiện tại</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="gap-1.5 font-body text-xs"><LogOut className="w-3 h-3" /> Đăng xuất</Button>
            </div>
            <div className="border-t border-border py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-destructive/10 flex items-center justify-center"><Trash2 className="w-4 h-4 text-destructive" /></div>
                <div>
                  <p className="font-body text-sm font-medium text-destructive">Xóa tài khoản</p>
                  <p className="font-body text-[11px] text-muted-foreground">Xóa vĩnh viễn tài khoản và dữ liệu</p>
                </div>
              </div>
              {!showDelete ? (
                <Button variant="outline" size="sm" className="font-body text-xs text-destructive border-destructive/30 hover:bg-destructive/5" onClick={() => setShowDelete(true)}>
                  <Trash2 className="w-3 h-3 mr-1" /> Xóa
                </Button>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2">
                  <Button variant="destructive" size="sm" className="font-body text-xs gap-1"><Trash2 className="w-3 h-3" /> Xác nhận</Button>
                  <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => setShowDelete(false)}>Hủy</Button>
                </motion.div>
              )}
            </div>
          </div>
        </Card>
      </div>
      <div className="space-y-4">
        <Card className="bg-secondary/30">
          <div className="flex items-center gap-2 mb-3">
            <User className="w-3.5 h-3.5 text-muted-foreground" />
            <p className="font-body text-xs font-semibold text-muted-foreground uppercase tracking-wider">Thông tin tài khoản</p>
          </div>
          <div className="space-y-2 font-body text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">tu.nguyen@email.com</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tham gia</span><span className="text-foreground">01/2025</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Gói</span><span className="text-foreground">Free</span></div>
          </div>
        </Card>
        <InfoCard icon={AlertTriangle} title="Cảnh báo">
          <p>Xóa tài khoản sẽ xóa vĩnh viễn toàn bộ dữ liệu bao gồm tủ đồ, outfit đã lưu và lịch sử phong cách.</p>
          <a href="#" className="inline-flex items-center gap-1 text-accent text-xs mt-2 hover:underline">
            <HelpCircle className="w-3 h-3" /> Liên hệ hỗ trợ
          </a>
        </InfoCard>
      </div>
    </div>
  );
};

const panelMap: Record<string, React.FC> = {
  profile: ProfilePanel, security: SecurityPanel, platforms: PlatformsPanel,
  notifications: NotificationsPanel, subscription: SubscriptionPanel, danger: DangerPanel,
};

/* ════════════════════════════════════════════ */

const Profile = () => {
  const [active, setActive] = useState("profile");
  const ActivePanel = panelMap[active];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Compact header */}
      <div className="pt-16 border-b border-border">
        <div className="container mx-auto px-6 py-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <p className="editorial-label mb-1">Tài khoản</p>
            <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">Cài đặt tài khoản</h1>
          </motion.div>
        </div>
      </div>

      {/* Layout */}
      <div className="container mx-auto px-6 py-6 flex gap-6">

        {/* Sidebar */}
        <aside className="hidden md:block w-48 shrink-0">
          <nav className="sticky top-20 space-y-0.5">
            {tabs.map((tab) => {
              const isActive = active === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActive(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 text-left transition-all duration-200 relative ${
                    isActive ? "text-foreground bg-secondary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  }`}
                >
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 bg-accent transition-opacity duration-200 ${isActive ? "opacity-100" : "opacity-0"}`} />
                  <tab.icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-accent" : ""}`} />
                  <span className="font-body text-sm">{tab.label}</span>
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
        <main className="flex-1 min-w-0 pb-20 md:pb-0">
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

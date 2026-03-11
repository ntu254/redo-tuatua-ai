import { useState } from "react";
import { motion } from "framer-motion";
import {
  User, Mail, MapPin, Lock, Shield, Bell, CreditCard, LogOut, Trash2,
  Edit2, ExternalLink, Check, X, ChevronRight, Crown, Sparkles, ShoppingBag
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";

const Fade = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.45, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const SectionCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border bg-card p-6 md:p-8 ${className}`}>{children}</div>
);

const SectionTitle = ({ icon: Icon, title }: { icon: React.ElementType; title: string }) => (
  <div className="flex items-center gap-3 mb-6">
    <Icon className="w-4 h-4 text-accent" />
    <h2 className="font-heading text-lg font-semibold text-foreground">{title}</h2>
  </div>
);

const platforms = [
  { name: "Shopee", connected: true, color: "bg-orange-500" },
  { name: "Lazada", connected: true, color: "bg-blue-600" },
  { name: "Tiki", connected: false, color: "bg-sky-500" },
  { name: "Zalora", connected: true, color: "bg-foreground" },
  { name: "TikTok Shop", connected: false, color: "bg-foreground" },
];

const premiumFeatures = [
  "Tạo outfit không giới hạn",
  "Phân tích phong cách nâng cao",
  "AI gợi ý ưu tiên",
  "Truy cập xu hướng sớm",
];

const AccountSettings = () => {
  const [editing, setEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [notifications, setNotifications] = useState({
    trends: true,
    outfits: true,
    discounts: false,
  });

  const [profile, setProfile] = useState({
    name: "Tu Nguyen",
    email: "tu.nguyen@email.com",
    username: "tunguyen",
    location: "Ho Chi Minh City",
    bio: "Fashion lover exploring minimalist outfits with AI styling.",
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="pt-16">
        {/* Page header */}
        <div className="border-b border-border">
          <div className="container mx-auto px-6 py-10 md:py-14">
            <Fade>
              <p className="editorial-label mb-2">Tài khoản</p>
              <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground">
                Cài đặt tài khoản
              </h1>
              <p className="text-muted-foreground font-body text-sm mt-2 max-w-md">
                Quản lý thông tin cá nhân, bảo mật và các dịch vụ kết nối của bạn.
              </p>
            </Fade>
          </div>
        </div>

        <div className="container mx-auto px-6 py-10 max-w-3xl space-y-6">

          {/* ── Profile Header ── */}
          <Fade>
            <SectionCard>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <motion.div
                  className="w-20 h-20 bg-secondary border border-border flex items-center justify-center shrink-0"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="font-heading text-2xl font-semibold text-foreground">TN</span>
                </motion.div>

                <div className="flex-1 min-w-0">
                  <h2 className="font-heading text-xl font-semibold text-foreground">Tu Nguyen</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[11px] font-body font-medium text-accent uppercase tracking-wider">Urban Minimalist</span>
                  </div>
                  <p className="text-muted-foreground font-body text-sm mt-1.5 leading-relaxed">
                    Fashion lover exploring minimalist outfits with AI styling.
                  </p>
                </div>

                <div className="flex gap-2 shrink-0">
                  <Button variant="outline" size="sm" className="gap-2 font-body" onClick={() => setEditing(!editing)}>
                    <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                  </Button>
                  <Link to="/wardrobe">
                    <Button variant="accent" size="sm" className="gap-2 font-body">
                      <ShoppingBag className="w-3.5 h-3.5" /> Tủ đồ
                    </Button>
                  </Link>
                </div>
              </div>
            </SectionCard>
          </Fade>

          {/* ── Account Information ── */}
          <Fade delay={0.05}>
            <SectionCard>
              <SectionTitle icon={User} title="Thông tin tài khoản" />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs font-body text-muted-foreground uppercase tracking-wider">Email</Label>
                    <Input value={profile.email} disabled={!editing} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} className="font-body" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-body text-muted-foreground uppercase tracking-wider">Username</Label>
                    <Input value={profile.username} disabled={!editing} onChange={e => setProfile(p => ({ ...p, username: e.target.value }))} className="font-body" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-body text-muted-foreground uppercase tracking-wider">Địa điểm</Label>
                  <Input value={profile.location} disabled={!editing} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} className="font-body" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-body text-muted-foreground uppercase tracking-wider">Giới thiệu</Label>
                  <Textarea value={profile.bio} disabled={!editing} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} className="font-body resize-none" rows={3} />
                </div>
                {editing && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 pt-2">
                    <Button variant="accent" size="sm" className="gap-2 font-body" onClick={() => setEditing(false)}>
                      <Check className="w-3.5 h-3.5" /> Lưu thay đổi
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 font-body" onClick={() => setEditing(false)}>
                      <X className="w-3.5 h-3.5" /> Hủy
                    </Button>
                  </motion.div>
                )}
              </div>
            </SectionCard>
          </Fade>

          {/* ── Security ── */}
          <Fade delay={0.1}>
            <SectionCard>
              <SectionTitle icon={Shield} title="Bảo mật" />
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">Mật khẩu</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">Cập nhật lần cuối 3 tháng trước</p>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 font-body">
                    <Lock className="w-3.5 h-3.5" /> Đổi mật khẩu
                  </Button>
                </div>
                <div className="border-t border-border pt-5 flex items-center justify-between">
                  <div>
                    <p className="font-body text-sm font-medium text-foreground">Xác thực hai yếu tố</p>
                    <p className="font-body text-xs text-muted-foreground mt-0.5">Bảo vệ tài khoản với mã xác thực bổ sung</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </SectionCard>
          </Fade>

          {/* ── Connected Platforms ── */}
          <Fade delay={0.15}>
            <SectionCard>
              <SectionTitle icon={ExternalLink} title="Nền tảng kết nối" />
              <div className="space-y-3">
                {platforms.map((p) => (
                  <div key={p.name} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 ${p.color} flex items-center justify-center`}>
                        <span className="text-white text-xs font-body font-semibold">{p.name[0]}</span>
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
              </div>
            </SectionCard>
          </Fade>

          {/* ── Notifications ── */}
          <Fade delay={0.2}>
            <SectionCard>
              <SectionTitle icon={Bell} title="Thông báo" />
              <div className="space-y-4">
                {[
                  { key: "trends" as const, label: "Cập nhật xu hướng", desc: "Nhận thông báo về xu hướng thời trang mới" },
                  { key: "outfits" as const, label: "Gợi ý outfit mới", desc: "AI gợi ý outfit phù hợp với bạn" },
                  { key: "discounts" as const, label: "Ưu đãi mua sắm", desc: "Thông báo giảm giá từ các sàn kết nối" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-1">
                    <div>
                      <p className="font-body text-sm font-medium text-foreground">{item.label}</p>
                      <p className="font-body text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key]}
                      onCheckedChange={(v) => setNotifications(n => ({ ...n, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          </Fade>

          {/* ── Subscription ── */}
          <Fade delay={0.25}>
            <SectionCard className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 -translate-y-8 translate-x-8" />
              <SectionTitle icon={Crown} title="Gói đăng ký" />
              <div className="flex flex-col sm:flex-row gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-heading text-lg font-semibold text-foreground">Free</span>
                    <span className="text-[10px] font-body uppercase tracking-wider bg-secondary text-muted-foreground px-2 py-0.5">Hiện tại</span>
                  </div>
                  <p className="font-body text-sm text-muted-foreground mb-4">
                    Nâng cấp để mở khóa toàn bộ tính năng AI styling.
                  </p>
                  <ul className="space-y-2">
                    {premiumFeatures.map((f) => (
                      <li key={f} className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span className="font-body text-sm text-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="sm:self-end">
                  <Button variant="accent" className="gap-2 font-body w-full sm:w-auto">
                    <Crown className="w-4 h-4" /> Nâng cấp Premium
                  </Button>
                </div>
              </div>
            </SectionCard>
          </Fade>

          {/* ── Account Actions ── */}
          <Fade delay={0.3}>
            <SectionCard>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Button variant="outline" className="gap-2 font-body">
                  <LogOut className="w-4 h-4" /> Đăng xuất
                </Button>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="font-body text-sm text-destructive hover:underline underline-offset-4 transition-colors"
                  >
                    Xóa tài khoản
                  </button>
                ) : (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
                    <p className="font-body text-sm text-destructive">Bạn chắc chắn?</p>
                    <Button variant="destructive" size="sm" className="font-body text-xs">
                      <Trash2 className="w-3.5 h-3.5 mr-1" /> Xóa
                    </Button>
                    <Button variant="outline" size="sm" className="font-body text-xs" onClick={() => setShowDeleteConfirm(false)}>
                      Hủy
                    </Button>
                  </motion.div>
                )}
              </div>
            </SectionCard>
          </Fade>

          <div className="h-10" />
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;

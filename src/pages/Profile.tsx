import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Shirt, ArrowRight, Edit2, ShoppingBag, Heart, Zap, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import ProfileStyleAnalytics from "@/components/profile/ProfileStyleAnalytics";
import ProfileWardrobeFavorites from "@/components/profile/ProfileWardrobeFavorites";
import ProfileStyleEvolution from "@/components/profile/ProfileStyleEvolution";
import ProfileSuggestedStyles from "@/components/profile/ProfileSuggestedStyles";

const Fade = ({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

const stats = [
  { icon: Shirt, label: "Tủ đồ", value: "47", sub: "món đồ" },
  { icon: Heart, label: "Outfit đã lưu", value: "23", sub: "bộ outfit" },
  { icon: Zap, label: "AI gợi ý", value: "156", sub: "lần gợi ý" },
  { icon: ShoppingBag, label: "Sàn kết nối", value: "4", sub: "nền tảng" },
];

const Profile = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* Hero header with parallax */}
    <div className="pt-16">
      <div className="border-b border-border">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <Fade>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <motion.div
                className="w-20 h-20 bg-secondary border border-border flex items-center justify-center shrink-0 overflow-hidden"
                whileHover={{ scale: 1.05 }}
              >
                <span className="font-heading text-2xl font-semibold text-foreground">TN</span>
              </motion.div>

              <div className="flex-1">
                <p className="editorial-label mb-1">Hồ sơ cá nhân</p>
                <h1 className="font-heading text-3xl md:text-4xl font-semibold text-foreground mb-1">
                  Tu Nguyen
                </h1>
                <div className="flex items-center gap-2 mb-2">
                  <Palette className="w-3.5 h-3.5 text-accent" />
                  <span className="text-sm font-body font-medium text-accent">Urban Minimalist</span>
                </div>
                <p className="text-muted-foreground font-body text-sm max-w-lg leading-relaxed">
                  Phong cách của bạn kết hợp giữa minimal thanh lịch với chút ảnh hưởng streetwear nhẹ nhàng.
                </p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2 font-body">
                  <Edit2 className="w-3.5 h-3.5" /> Chỉnh sửa
                </Button>
                <Link to="/wardrobe">
                  <Button variant="accent" size="sm" className="gap-2 font-body">
                    Cập nhật tủ đồ
                  </Button>
                </Link>
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </div>

    {/* Stats row */}
    <Fade>
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-border">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className={`p-6 text-center ${i < stats.length - 1 ? "border-r border-border" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <s.icon className="w-5 h-5 text-accent mx-auto mb-2" />
            <p className="font-heading text-2xl font-semibold text-foreground">{s.value}</p>
            <p className="text-[11px] font-body text-muted-foreground mt-0.5">{s.sub}</p>
          </motion.div>
        ))}
      </div>
    </Fade>

    {/* Style Analytics */}
    <ProfileStyleAnalytics />

    {/* Wardrobe Favorites */}
    <ProfileWardrobeFavorites />

    {/* Style Evolution */}
    <ProfileStyleEvolution />

    {/* Suggested Styles */}
    <ProfileSuggestedStyles />

    {/* CTA */}
    <Fade>
      <div className="px-6 py-14 text-center">
        <p className="editorial-label mb-3">Tiếp theo</p>
        <h2 className="font-heading text-2xl md:text-3xl font-medium text-foreground mb-5">
          Tạo outfit cho phong cách của bạn
        </h2>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/recommender">
            <Button variant="accent" size="lg" className="gap-2 font-body">
              Tạo outfit <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/trends">
            <Button variant="outline" size="lg" className="gap-2 font-body">
              <TrendingUp className="w-4 h-4" /> Khám phá xu hướng
            </Button>
          </Link>
        </div>
      </div>
    </Fade>
  </div>
);

export default Profile;

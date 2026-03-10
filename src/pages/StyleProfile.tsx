import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Shirt, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import {
  RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer,
  PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from "recharts";

import whiteTshirt from "@/assets/wardrobe/white-tshirt.jpg";
import blueJeans from "@/assets/wardrobe/blue-jeans.jpg";
import blackBlazer from "@/assets/wardrobe/black-blazer.jpg";
import whiteSneakers from "@/assets/wardrobe/white-sneakers.jpg";
import grayHoodie from "@/assets/wardrobe/gray-hoodie.jpg";
import pinkSilkShirt from "@/assets/wardrobe/pink-silk-shirt.jpg";

import styleMinimal from "@/assets/style-minimal-new.jpg";
import styleStreet from "@/assets/style-streetwear-new.jpg";
import styleOffice from "@/assets/style-office-new.jpg";
import kfashion from "@/assets/lookbook-kfashion.jpg";

/* ── Data ── */
const styleDna = [
  { style: "Minimal", value: 70 },
  { style: "Streetwear", value: 15 },
  { style: "Casual", value: 10 },
  { style: "Elegant", value: 5 },
  { style: "Athleisure", value: 8 },
  { style: "Classic", value: 12 },
];

const favoriteColors = [
  { name: "White", hex: "#FFFFFF", pct: 35 },
  { name: "Beige", hex: "#F5F0E8", pct: 25 },
  { name: "Black", hex: "#1C1C1C", pct: 20 },
  { name: "Navy", hex: "#1B2A4A", pct: 12 },
  { name: "Sage Green", hex: "#9CAF88", pct: 8 },
];

const outfitTypes = [
  { name: "Casual", value: 42, color: "hsl(0 0% 75%)" },
  { name: "Office", value: 28, color: "hsl(0 0% 45%)" },
  { name: "Streetwear", value: 15, color: "hsl(0 100% 70%)" },
  { name: "Party", value: 10, color: "hsl(0 0% 25%)" },
  { name: "Sport", value: 5, color: "hsl(166 65% 50%)" },
];

const evolution = [
  { month: "Jan", Minimal: 30, Casual: 50, Office: 20 },
  { month: "Feb", Minimal: 35, Casual: 45, Office: 20 },
  { month: "Mar", Minimal: 50, Casual: 30, Office: 20 },
  { month: "Apr", Minimal: 55, Casual: 25, Office: 20 },
  { month: "May", Minimal: 60, Casual: 20, Office: 20 },
  { month: "Jun", Minimal: 70, Casual: 10, Office: 20 },
];

const wardrobeFavorites = [
  { name: "White T-shirt", img: whiteTshirt, worn: 47 },
  { name: "Blue Jeans", img: blueJeans, worn: 38 },
  { name: "Black Blazer", img: blackBlazer, worn: 31 },
  { name: "White Sneakers", img: whiteSneakers, worn: 29 },
  { name: "Gray Hoodie", img: grayHoodie, worn: 24 },
  { name: "Pink Silk Shirt", img: pinkSilkShirt, worn: 18 },
];

const insights = [
  "Bạn thường chọn tông màu trung tính — phong cách minimal rất rõ nét.",
  "Bạn ưa chuộng silhouette tối giản và đường cắt sạch.",
  "Rất hiếm khi bạn mặc màu sắc rực rỡ — thử thêm pastel nhé!",
  "Outfit casual chiếm phần lớn tủ đồ — linh hoạt cho mọi dịp.",
];

const suggestedStyles = [
  { name: "Quiet Luxury", img: styleMinimal, desc: "Thanh lịch, chất liệu cao cấp, không logo" },
  { name: "Soft Minimal", img: styleOffice, desc: "Nhẹ nhàng, trung tính, tinh tế" },
  { name: "K-Fashion Casual", img: kfashion, desc: "Layer thông minh, phối màu pastel" },
  { name: "Modern Streetwear", img: styleStreet, desc: "Phá cách, oversized, sneaker game" },
];

/* ── Helpers ── */
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

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`border border-border bg-card p-6 ${className}`}>{children}</div>
);

const CardLabel = ({ children }: { children: React.ReactNode }) => (
  <p className="editorial-label mb-3">{children}</p>
);

/* ── Page ── */
const StyleProfile = () => (
  <div className="min-h-screen bg-background">
    <Navbar />

    {/* ── Hero (compact) ── */}
    <div className="pt-16">
      <div className="border-b border-border px-6 py-12 md:py-16 text-center">
        <p className="editorial-label mb-3">AI-Powered Analytics</p>
        <h1 className="font-heading text-3xl md:text-5xl font-light text-foreground blur-text-reveal">
          Your <span className="italic">Style Profile</span>
        </h1>
        <p className="text-muted-foreground font-body mt-3 text-sm max-w-md mx-auto blur-text-reveal blur-text-reveal-delay-1">
          AI insights về tủ đồ và xu hướng thời trang cá nhân của bạn.
        </p>
      </div>
    </div>

    {/* ── Style Analysis 2×2 Grid ── */}
    <Fade>
      <div className="grid grid-cols-1 md:grid-cols-2 border-b border-border">
        {/* Style DNA */}
        <Card className="border-b md:border-b-0 md:border-r">
          <CardLabel>Style DNA</CardLabel>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={styleDna} outerRadius="72%">
              <PolarGrid stroke="hsl(0 0% 90%)" />
              <PolarAngleAxis dataKey="style" tick={{ fontSize: 10, fill: "hsl(0 0% 45%)", fontFamily: "'DM Sans'" }} />
              <Radar dataKey="value" stroke="hsl(0 100% 70%)" fill="hsl(0 100% 70%)" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-center text-[11px] text-muted-foreground font-body mt-2">
            Chủ đạo: <span className="text-foreground font-medium">Minimal · 70%</span>
          </p>
        </Card>

        {/* Favorite Colors */}
        <Card className="border-b md:border-b-0">
          <CardLabel>Favorite Colors</CardLabel>
          <div className="flex flex-col gap-3 mt-4">
            {favoriteColors.map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-8 h-8 shrink-0 border border-border" style={{ backgroundColor: c.hex }} />
                <span className="text-sm font-body text-foreground flex-1">{c.name}</span>
                <div className="flex-1 h-1.5 bg-secondary max-w-[120px]">
                  <div className="h-full bg-accent" style={{ width: `${c.pct}%`, opacity: 0.4 + c.pct / 100 }} />
                </div>
                <span className="text-xs text-muted-foreground font-body w-10 text-right">{c.pct}%</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Outfit Types */}
        <Card className="border-b md:border-b-0 md:border-r">
          <CardLabel>Outfit Types</CardLabel>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={outfitTypes} dataKey="value" innerRadius={45} outerRadius={72} paddingAngle={2} strokeWidth={0}>
                  {outfitTypes.map((e) => <Cell key={e.name} fill={e.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {outfitTypes.map((t) => (
                <div key={t.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="text-xs font-body text-foreground w-20">{t.name}</span>
                  <span className="text-xs text-muted-foreground font-body">{t.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* AI Style Insight */}
        <Card className="flex flex-col justify-between">
          <div>
            <CardLabel>AI Style Insight</CardLabel>
            <div className="mt-2 mb-4">
              <Sparkles className="w-5 h-5 text-accent mb-3" />
              <p className="font-heading text-lg md:text-xl text-foreground italic leading-relaxed">
                "Phong cách của bạn là modern minimal với ảnh hưởng streetwear nhẹ nhàng."
              </p>
              <p className="text-xs text-muted-foreground font-body mt-3 leading-relaxed">
                Bạn ưa chuộng outfit trung tính, linh hoạt cho cả casual lẫn office.
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            {insights.slice(0, 3).map((text, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-accent shrink-0 mt-1.5" />
                <p className="text-[11px] text-muted-foreground font-body leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Fade>

    {/* ── Wardrobe Favorites ── */}
    <Fade>
      <div className="border-b border-border">
        <div className="px-6 py-6 border-b border-border">
          <p className="editorial-label">Wardrobe Favorites</p>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6">
          {wardrobeFavorites.map((item, i) => (
            <div key={item.name} className={`group p-4 text-center ${i < wardrobeFavorites.length - 1 ? "border-r border-border" : ""}`}>
              <div className="aspect-square overflow-hidden mb-2 mag-img-zoom">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-[11px] font-body font-medium text-foreground truncate">{item.name}</p>
              <p className="text-[10px] text-muted-foreground font-body mt-0.5">
                <Shirt className="w-3 h-3 inline mr-0.5" />{item.worn}×
              </p>
            </div>
          ))}
        </div>
      </div>
    </Fade>

    {/* ── Style Evolution (compact) ── */}
    <Fade>
      <div className="border-b border-border">
        <div className="px-6 py-6 border-b border-border flex items-center justify-between">
          <p className="editorial-label">Style Evolution</p>
          <div className="flex gap-4">
            {[
              { label: "Minimal", color: "hsl(0 100% 70%)" },
              { label: "Casual", color: "hsl(0 0% 65%)" },
              { label: "Office", color: "hsl(0 0% 40%)" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <span className="w-2 h-2" style={{ backgroundColor: l.color }} />
                <span className="text-[9px] font-body text-muted-foreground uppercase tracking-wider">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="px-6 py-8 max-w-3xl mx-auto">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: "hsl(0 0% 45%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(0 0% 45%)" }} width={30} />
              <Tooltip contentStyle={{ background: "hsl(0 0% 100%)", border: "1px solid hsl(0 0% 92%)", fontSize: 11 }} />
              <Area type="monotone" dataKey="Minimal" stackId="1" stroke="hsl(0 100% 70%)" fill="hsl(0 100% 70%)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="Casual" stackId="1" stroke="hsl(0 0% 65%)" fill="hsl(0 0% 65%)" fillOpacity={0.15} />
              <Area type="monotone" dataKey="Office" stackId="1" stroke="hsl(0 0% 40%)" fill="hsl(0 0% 40%)" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Fade>

    {/* ── Suggested Styles ── */}
    <Fade>
      <div className="border-b border-border">
        <div className="px-6 py-6 border-b border-border">
          <p className="editorial-label">Suggested Styles</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4">
          {suggestedStyles.map((s, i) => (
            <div key={s.name} className={`group ${i < suggestedStyles.length - 1 ? "border-r border-border" : ""}`}>
              <div className="aspect-[3/4] overflow-hidden mag-img-zoom">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 border-t border-border">
                <h3 className="font-heading text-base text-foreground">{s.name}</h3>
                <p className="text-[11px] text-muted-foreground font-body mt-0.5">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Fade>

    {/* ── CTA ── */}
    <div className="px-6 py-14 text-center">
      <p className="editorial-label mb-3">Tiếp theo</p>
      <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground mb-5">
        Tạo outfit <span className="italic">cho phong cách của bạn</span>
      </h2>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button variant="accent" size="lg" className="gap-2">
          Generate Outfits <ArrowRight className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="lg" className="gap-2">
          <TrendingUp className="w-4 h-4" /> Khám phá xu hướng
        </Button>
      </div>
    </div>
  </div>
);

export default StyleProfile;

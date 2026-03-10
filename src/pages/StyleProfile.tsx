import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, Shirt, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/landing/Navbar";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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

/* ── Section wrapper ── */
const Section = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.5 }}
    className={className}
  >
    {children}
  </motion.section>
);

const SectionHeader = ({ label, title }: { label: string; title: React.ReactNode }) => (
  <div className="border-b border-border px-6 py-10 text-center">
    <p className="editorial-label mb-3">{label}</p>
    <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground">{title}</h2>
  </div>
);

/* ── Page ── */
const StyleProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* ── Hero ── */}
      <div className="pt-16">
        <div className="border-b border-border px-6 py-16 md:py-24 text-center">
          <p className="editorial-label mb-4">AI-Powered Analytics</p>
          <h1 className="font-heading text-4xl md:text-6xl font-light text-foreground blur-text-reveal">
            Your <span className="italic">Style Profile</span>
          </h1>
          <p className="text-muted-foreground font-body mt-4 text-sm max-w-lg mx-auto blur-text-reveal blur-text-reveal-delay-1">
            Khám phá xu hướng thời trang cá nhân được phân tích bởi StyleAI
          </p>
          <p className="text-muted-foreground/60 font-body mt-2 text-xs max-w-md mx-auto blur-text-reveal blur-text-reveal-delay-2">
            Tủ đồ và lựa chọn outfit của bạn tiết lộ những pattern phong cách độc đáo.
          </p>
        </div>
      </div>

      {/* ── Style DNA (Radar) ── */}
      <Section>
        <SectionHeader label="Phân tích" title={<>Style <span className="italic">DNA</span></>} />
        <div className="px-6 py-12 max-w-xl mx-auto">
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={styleDna} outerRadius="75%">
              <PolarGrid stroke="hsl(0 0% 90%)" />
              <PolarAngleAxis
                dataKey="style"
                tick={{ fontSize: 11, fill: "hsl(0 0% 45%)", fontFamily: "'DM Sans'" }}
              />
              <Radar
                dataKey="value"
                stroke="hsl(0 100% 70%)"
                fill="hsl(0 100% 70%)"
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="text-center text-xs text-muted-foreground font-body mt-4">
            Phong cách chủ đạo: <span className="text-foreground font-medium">Minimal (70%)</span>
          </p>
        </div>
      </Section>

      {/* ── Favorite Colors ── */}
      <Section>
        <SectionHeader label="Bảng màu" title={<>Favorite <span className="italic">Colors</span></>} />
        <div className="mag-grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
          {favoriteColors.map((c) => (
            <div key={c.name} className="p-8 text-center group">
              <div
                className="w-16 h-16 mx-auto mb-4 border border-border transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: c.hex }}
              />
              <p className="font-heading text-lg text-foreground">{c.name}</p>
              <p className="text-xs text-muted-foreground font-body mt-1">{c.pct}% tủ đồ</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Outfit Types (Donut) ── */}
      <Section>
        <SectionHeader label="Phân loại" title={<>Your Outfit <span className="italic">Types</span></>} />
        <div className="px-6 py-12 flex flex-col md:flex-row items-center justify-center gap-10 max-w-2xl mx-auto">
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={outfitTypes}
                dataKey="value"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={2}
                strokeWidth={0}
              >
                {outfitTypes.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {outfitTypes.map((t) => (
              <div key={t.name} className="flex items-center gap-3">
                <span className="w-3 h-3 shrink-0" style={{ backgroundColor: t.color }} />
                <span className="text-sm font-body text-foreground w-24">{t.name}</span>
                <div className="flex-1 h-1.5 bg-secondary min-w-[100px]">
                  <div className="h-full" style={{ width: `${t.value}%`, backgroundColor: t.color }} />
                </div>
                <span className="text-xs text-muted-foreground font-body w-8 text-right">{t.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── Wardrobe Insights ── */}
      <Section>
        <SectionHeader label="AI Insights" title={<>Wardrobe <span className="italic">Insights</span></>} />
        <div className="mag-grid grid-cols-1 md:grid-cols-2">
          {insights.map((text, i) => (
            <div key={i} className="p-8 flex items-start gap-4">
              <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5" />
              <p className="text-sm text-foreground font-body leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Most Worn Items ── */}
      <Section>
        <SectionHeader label="Yêu thích" title={<>Wardrobe <span className="italic">Favorites</span></>} />
        <div className="mag-grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          {wardrobeFavorites.map((item) => (
            <div key={item.name} className="group p-4 text-center">
              <div className="aspect-square overflow-hidden mb-3 mag-img-zoom">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <p className="text-xs font-body font-medium text-foreground">{item.name}</p>
              <p className="text-[10px] text-muted-foreground font-body mt-0.5">
                <Shirt className="w-3 h-3 inline mr-1" />{item.worn} lần mặc
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── Style Evolution ── */}
      <Section>
        <SectionHeader label="Hành trình" title={<>Style <span className="italic">Evolution</span></>} />
        <div className="px-6 py-12 max-w-2xl mx-auto">
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={evolution}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 92%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} />
              <Tooltip
                contentStyle={{
                  background: "hsl(0 0% 100%)",
                  border: "1px solid hsl(0 0% 92%)",
                  fontSize: 12,
                }}
              />
              <Area type="monotone" dataKey="Minimal" stackId="1" stroke="hsl(0 100% 70%)" fill="hsl(0 100% 70%)" fillOpacity={0.2} />
              <Area type="monotone" dataKey="Casual" stackId="1" stroke="hsl(0 0% 65%)" fill="hsl(0 0% 65%)" fillOpacity={0.15} />
              <Area type="monotone" dataKey="Office" stackId="1" stroke="hsl(0 0% 40%)" fill="hsl(0 0% 40%)" fillOpacity={0.1} />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-4">
            {[
              { label: "Minimal", color: "hsl(0 100% 70%)" },
              { label: "Casual", color: "hsl(0 0% 65%)" },
              { label: "Office", color: "hsl(0 0% 40%)" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <span className="w-3 h-3" style={{ backgroundColor: l.color }} />
                <span className="text-[10px] font-body text-muted-foreground uppercase tracking-wider">{l.label}</span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── AI Style Insight ── */}
      <Section>
        <div className="border-y border-border px-6 py-14 text-center max-w-2xl mx-auto">
          <Sparkles className="w-5 h-5 text-accent mx-auto mb-4" />
          <p className="editorial-label mb-4">AI Style Insight</p>
          <p className="font-heading text-xl md:text-2xl text-foreground italic leading-relaxed">
            "Phong cách của bạn là modern minimal với ảnh hưởng streetwear nhẹ nhàng."
          </p>
          <p className="text-sm text-muted-foreground font-body mt-4 max-w-md mx-auto">
            Bạn ưa chuộng outfit trung tính, linh hoạt cho cả casual lẫn office.
          </p>
        </div>
      </Section>

      {/* ── Suggested Styles ── */}
      <Section>
        <SectionHeader label="Gợi ý" title={<>Suggested <span className="italic">Styles</span></>} />
        <div className="mag-grid grid-cols-2 lg:grid-cols-4">
          {suggestedStyles.map((s) => (
            <div key={s.name} className="group">
              <div className="aspect-[3/4] overflow-hidden mag-img-zoom">
                <img src={s.img} alt={s.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 border-t border-border">
                <h3 className="font-heading text-lg text-foreground">{s.name}</h3>
                <p className="text-xs text-muted-foreground font-body mt-1">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── CTA ── */}
      <div className="border-t border-border px-6 py-16 text-center">
        <p className="editorial-label mb-4">Tiếp theo</p>
        <h2 className="font-heading text-2xl md:text-3xl font-light text-foreground mb-6">
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
};

export default StyleProfile;

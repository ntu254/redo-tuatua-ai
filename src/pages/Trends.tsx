import { motion } from "framer-motion";
import { Wand2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import trendsHeroBg from "@/assets/trends-hero-bg.jpg";
import TrendingSearches from "@/components/trends/TrendingSearches";
import TrendingColors from "@/components/trends/TrendingColors";
import TrendingItems from "@/components/trends/TrendingItems";
import TrendingStyles from "@/components/trends/TrendingStyles";
import AITrendInsights from "@/components/trends/AITrendInsights";
import TrendInspirationGrid from "@/components/trends/TrendInspirationGrid";

const Trends = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="pt-16">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img src={trendsHeroBg} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
          </div>

          <div className="relative px-6 py-24 md:py-36">
            <div className="container mx-auto max-w-5xl text-center">
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                className="editorial-label mb-5">StyleAI tuyển chọn</motion.p>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
                className="font-heading text-5xl md:text-7xl font-light text-foreground mb-6">
                Xu hướng <span className="italic">Thời trang</span>
              </motion.h1>
              <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                className="font-body text-sm md:text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Khám phá những gì mọi người đang tìm kiếm, mặc và bàn luận trong thời trang ngay lúc này.
                Từ khóa, màu sắc, sản phẩm và phong cách xu hướng được StyleAI tuyển chọn.
              </motion.p>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-8">
                <button onClick={() => navigate("/recommender")}
                  className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-[10px] font-body font-medium uppercase tracking-[0.2em] hover:bg-foreground/85 transition-colors">
                  <Wand2 className="w-3.5 h-3.5" />
                  Tạo outfit từ xu hướng
                </button>
              </motion.div>
            </div>
          </div>
          <div className="border-b border-border" />
        </section>

        <TrendingSearches />
        <TrendingColors />
        <TrendingItems />
        <TrendingStyles />
        <AITrendInsights />
        <TrendInspirationGrid />
      </div>

      <Footer />
    </div>
  );
};

export default Trends;

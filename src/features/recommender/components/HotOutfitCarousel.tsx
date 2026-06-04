import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Flame, Heart, Star, TrendingUp, Zap } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface HotOutfit {
  id: number;
  title: string;
  image: string;
  tags: string[];
  badge: string;
  badgeIcon: React.ReactNode;
  platform: string;
  platformColor: string;
  price: string;
  description: string;
}

const HOT_OUTFITS: HotOutfit[] = [
  {
    id: 1,
    title: "Thanh lịch công sở",
    image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&q=80",
    tags: ["Thanh lịch", "Tối giản", "Công sở"],
    badge: "Hot",
    badgeIcon: <Flame className="w-3 h-3" />,
    platform: "Shopee",
    platformColor: "bg-shopee",
    price: "1.290.000đ",
    description: "Set thanh lịch cho nàng công sở hiện đại",
  },
  {
    id: 2,
    title: "Năng động đi học",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    tags: ["Năng động", "Trẻ trung", "Đi học"],
    badge: "Best seller",
    badgeIcon: <Star className="w-3 h-3" />,
    platform: "Shopee",
    platformColor: "bg-shopee",
    price: "890.000đ",
    description: "Phong cách trẻ trung, năng động cho nữ sinh",
  },
  {
    id: 3,
    title: "Dạo phố pastel",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    tags: ["Nữ tính", "Ngọt ngào", "Dạo phố"],
    badge: "96% phù hợp",
    badgeIcon: <TrendingUp className="w-3 h-3" />,
    platform: "TikTok Shop",
    platformColor: "bg-tiktok",
    price: "1.050.000đ",
    description: "Set pastel nữ tính, nhẹ nhàng dạo phố",
  },
  {
    id: 4,
    title: "Hẹn hò nữ tính",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    tags: ["Nữ tính", "Romantic", "Hẹn hò"],
    badge: "Hot",
    badgeIcon: <Flame className="w-3 h-3" />,
    platform: "Shopee",
    platformColor: "bg-shopee",
    price: "780.000đ",
    description: "Phong cách lãng mạn cho buổi hẹn hò",
  },
  {
    id: 5,
    title: "Café cuối tuần",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
    tags: ["Casual", "Thoải mái", "Basic"],
    badge: "New",
    badgeIcon: <Zap className="w-3 h-3" />,
    platform: "TikTok Shop",
    platformColor: "bg-tiktok",
    price: "650.000đ",
    description: "Set casual thoải mái cho cuối tuần",
  },
  {
    id: 6,
    title: "Sang trọng tối nay",
    image: "https://images.unsplash.com/photo-1518622358385-8ea7d657d6c0?w=600&q=80",
    tags: ["Dạ tiệc", "Sang trọng", "Tối giản"],
    badge: "Premium",
    badgeIcon: <Sparkles className="w-3 h-3" />,
    platform: "Shopee",
    platformColor: "bg-shopee",
    price: "1.800.000đ",
    description: "Set dạ tiệc sang trọng, nổi bật",
  },
];

const FILTER_CHIPS = ["Hot trend", "Nữ tính", "Dưới 3 triệu", "Shopee", "TikTok Shop"];

const AUTO_SLIDE_MS = 5000;

export default function HotOutfitCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string[]>([]);
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set());
  const progressRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  const total = HOT_OUTFITS.length;

  const filtered = HOT_OUTFITS.filter((o) => {
    if (activeFilter.length === 0) return true;
    if (activeFilter.includes("Dưới 3 triệu")) {
      const priceNum = Number(o.price.replace(/[^0-9]/g, ""));
      if (priceNum > 3000000) return false;
    }
    if (activeFilter.includes("Shopee") && o.platform !== "Shopee") return false;
    if (activeFilter.includes("TikTok Shop") && o.platform !== "TikTok Shop") return false;
    if (activeFilter.includes("Hot trend") && o.badge !== "Hot") return false;
    if (activeFilter.includes("Nữ tính") && !o.tags.some((t) => t.toLowerCase().includes("nữ"))) return false;
    return true;
  });

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    startTimeRef.current = Date.now();
    if (progressRef.current) {
      progressRef.current.style.transition = "none";
      progressRef.current.style.width = "0%";
      void progressRef.current.offsetHeight;
    }
    if (isAutoPlay && !isPaused) {
      timerRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % total);
        startTimeRef.current = Date.now();
        if (progressRef.current) {
          progressRef.current.style.transition = "none";
          progressRef.current.style.width = "0%";
          void progressRef.current.offsetHeight;
        }
      }, AUTO_SLIDE_MS);
    }
  }, [isAutoPlay, isPaused, total]);

  useEffect(() => {
    resetTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resetTimer]);

  useEffect(() => {
    if (!isAutoPlay || isPaused) return;
    let frame: number;
    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      const pct = Math.min((elapsed / AUTO_SLIDE_MS) * 100, 100);
      if (progressRef.current) {
        progressRef.current.style.transition = "none";
        progressRef.current.style.width = `${pct}%`;
      }
      if (pct < 100) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [isAutoPlay, isPaused, activeIndex]);

  const goTo = (idx: number) => {
    setActiveIndex(idx);
    resetTimer();
  };

  const goPrev = () => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
    resetTimer();
  };

  const goNext = () => {
    setActiveIndex((prev) => (prev + 1) % total);
    resetTimer();
  };

  const toggleLike = (id: number) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const getVisibleIndices = () => {
    const indices: { idx: number; offset: number }[] = [];
    for (let offset = -1; offset <= 2; offset++) {
      const idx = (activeIndex + offset + total) % total;
      indices.push({ idx, offset });
    }
    return indices;
  };

  return (
    <div
      className="space-y-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Flame className="w-4 h-4 text-accent" />
          <span className="text-[10px] uppercase tracking-[0.18em] font-body font-semibold text-muted-foreground/70">
            Gợi ý nổi bật
          </span>
        </div>
        <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">
          Khám phá 6 set hot hôm nay
        </h2>
        <p className="text-xs font-body text-muted-foreground mt-1">
          Chưa biết mặc gì? Xem ngay các set đang thịnh hành.
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {FILTER_CHIPS.map((chip) => {
          const isSelected = activeFilter.includes(chip);
          return (
            <button
              key={chip}
              onClick={() => {
                setActiveFilter(isSelected ? activeFilter.filter((c) => c !== chip) : [...activeFilter, chip]);
              }}
              className={`text-[11px] font-body px-3 py-1.5 rounded-full border whitespace-nowrap transition-all shrink-0 ${
                isSelected
                  ? "bg-foreground text-background border-foreground font-medium"
                  : "border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground bg-background/30"
              }`}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Arrow Left */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 z-20 w-10 h-10 rounded-full bg-card border border-border/60 shadow-md flex items-center justify-center text-foreground/70 hover:text-foreground hover:shadow-lg transition-all cursor-pointer hidden md:flex"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Cards */}
        <div className="overflow-hidden px-2 py-4">
          <div className="flex items-center justify-center gap-5 transition-transform duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
            {getVisibleIndices().map(({ idx, offset }) => {
              const outfit = filtered[idx % filtered.length] || HOT_OUTFITS[idx];
              const isActive = offset === 1;
              const isLeft = offset === 0;
              const isRight = offset === 2;
              const isFar = offset === -1;

              return (
                <motion.div
                  key={`${outfit.id}-${offset}`}
                  initial={false}
                  animate={{
                    scale: isActive ? 1 : 0.85,
                    opacity: isFar || offset > 2 ? 0 : isActive ? 1 : isLeft || isRight ? 0.5 : 0.3,
                    x: 0,
                  }}
                  transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className={`shrink-0 transition-all duration-500 ${
                    isActive
                      ? "w-[280px] md:w-[320px] z-10"
                      : "w-[200px] md:w-[240px] z-0"
                  }`}
                >
                  <div
                    className={`rounded-2xl overflow-hidden border transition-all duration-500 ${
                      isActive
                        ? "border-foreground/30 shadow-lg shadow-foreground/8 bg-card"
                        : "border-border/30 shadow-sm bg-card/80"
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative overflow-hidden ${isActive ? "aspect-[4/5]" : "aspect-[3/4]"}`}>
                      <img
                        src={outfit.image}
                        alt={outfit.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      {/* Badge */}
                      <div className="absolute top-3 left-3 flex items-center gap-1 bg-foreground/85 text-background px-2.5 py-1 rounded-full text-[10px] font-body font-semibold backdrop-blur-sm">
                        {outfit.badgeIcon}
                        {outfit.badge}
                      </div>
                      {/* Like */}
                      <button
                        onClick={(e) => { e.stopPropagation(); toggleLike(outfit.id); }}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center border border-border/30 hover:scale-110 transition-transform cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            likedIds.has(outfit.id) ? "fill-red-500 text-red-500" : "text-foreground/50"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Content */}
                    <div className={`p-4 ${isActive ? "space-y-3" : "space-y-2"}`}>
                      <h3 className={`font-heading font-bold text-foreground ${isActive ? "text-base" : "text-sm"}`}>
                        {outfit.title}
                      </h3>

                      {isActive && (
                        <p className="text-[11px] font-body text-muted-foreground">{outfit.description}</p>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {outfit.tags.slice(0, isActive ? 3 : 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-body px-2 py-0.5 rounded-full bg-secondary/60 text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Price + Platform */}
                      <div className="flex items-center justify-between">
                        <span className={`font-body font-bold text-foreground ${isActive ? "text-sm" : "text-xs"}`}>
                          {outfit.price}
                        </span>
                        <span className={`text-[10px] font-body font-semibold px-2 py-0.5 rounded-full ${
                          outfit.platform === "Shopee" ? "bg-shopee/10 text-shopee" : "bg-tiktok/10 text-tiktok"
                        }`}>
                          {outfit.platform}
                        </span>
                      </div>

                      {/* CTA */}
                      {isActive && (
                        <button className="w-full h-10 rounded-xl bg-foreground text-background text-xs font-body font-semibold flex items-center justify-center gap-1.5 hover:bg-foreground/90 transition-colors cursor-pointer">
                          Xem chi tiết set <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Arrow Right */}
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 z-20 w-10 h-10 rounded-full bg-card border border-border/60 shadow-md flex items-center justify-center text-foreground/70 hover:text-foreground hover:shadow-lg transition-all cursor-pointer hidden md:flex"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 pt-2">
        {/* Progress bar */}
        <div className="flex-1 max-w-[200px] h-1 bg-secondary/60 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full bg-foreground/40 rounded-full"
            style={{ width: "0%", transition: "none" }}
          />
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                i === activeIndex ? "bg-foreground scale-110" : "bg-foreground/20 hover:bg-foreground/40"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

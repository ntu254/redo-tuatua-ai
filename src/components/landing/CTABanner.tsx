import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { value: "12,400+", label: "Người dùng" },
  { value: "50K+", label: "Outfit" },
  { value: "5", label: "Sàn TMĐT" },
  { value: "98%", label: "Hài lòng" },
];

const CTABanner = () => (
  <section className="bg-background">
    {/* Stats — magazine grid strip */}
    <div className="mag-grid grid-cols-2 md:grid-cols-4 border-t border-border">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="py-12 text-center">
          <p className="font-heading text-4xl md:text-5xl font-light text-foreground">{s.value}</p>
          <p className="editorial-label mt-3">{s.label}</p>
        </motion.div>
      ))}
    </div>

    {/* CTA */}
    <div className="mag-grid grid-cols-1 md:grid-cols-2">
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        className="bg-foreground text-background p-12 md:p-20 flex flex-col justify-center">
        <p className="text-[10px] font-body font-medium uppercase tracking-[0.35em] text-background/40 mb-6">Bắt đầu ngay</p>
        <h2 className="font-heading text-3xl md:text-4xl font-light leading-tight mb-6">
          Sẵn sàng tìm <span className="italic">phong cách của bạn?</span>
        </h2>
        <p className="text-background/50 text-sm font-body leading-relaxed mb-10 max-w-sm">
          Bắt đầu với quiz phong cách 2 phút — hoàn toàn miễn phí. AI sẽ phân tích và gợi ý outfit phù hợp nhất.
        </p>
        <Button variant="accent" size="lg" className="gap-2 self-start">
          Bắt đầu ngay <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </motion.div>
      <div className="bg-accent p-12 md:p-20 flex items-center justify-center">
        <div className="text-center">
          <p className="font-heading text-6xl md:text-8xl font-light text-accent-foreground italic">AI</p>
          <p className="text-[10px] font-body font-medium uppercase tracking-[0.4em] text-accent-foreground/60 mt-4">Powered Styling</p>
        </div>
      </div>
    </div>
  </section>
);

export default CTABanner;

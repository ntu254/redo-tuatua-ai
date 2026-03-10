import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTABanner = () => (
  <section className="relative overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-foreground/90" />
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: "radial-gradient(circle at 25% 25%, hsl(var(--accent)) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    }} />

    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.7, type: "spring", damping: 20 }}
      className="relative z-10 text-center px-6 py-24 md:py-32">
      <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
        className="text-[10px] font-body font-medium uppercase tracking-[0.4em] text-background/30 mb-6">Sẵn sàng chưa?</motion.p>
      <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-semibold text-background leading-tight mb-6 max-w-2xl mx-auto">
        Để AI trở thành <span className="italic font-medium">stylist riêng</span> của bạn
      </h2>
      <p className="text-background/40 text-sm font-body leading-relaxed mb-10 max-w-md mx-auto">
        Làm bài quiz phong cách 2 phút — hoàn toàn miễn phí. AI sẽ phân tích sở thích và gợi ý outfit hoàn hảo cho bạn.
      </p>
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button variant="accent" size="lg" className="gap-2">
          Bắt đầu ngay <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </motion.div>
    </motion.div>
  </section>
);

export default CTABanner;

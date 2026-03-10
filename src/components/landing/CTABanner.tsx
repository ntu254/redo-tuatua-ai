import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { value: "12,400+", label: "Người dùng" },
  { value: "50K+", label: "Outfit được tạo" },
  { value: "5", label: "Sàn TMĐT" },
  { value: "98%", label: "Hài lòng" },
];

const CTABanner = () => (
  <section className="py-28 bg-background">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto mb-20">
        {stats.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
            <p className="font-heading text-3xl md:text-4xl font-semibold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground mt-2 font-body uppercase tracking-wider">{s.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        className="bg-foreground text-background rounded-[2rem] p-12 md:p-20 text-center max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl md:text-4xl font-semibold italic mb-5">
          Sẵn sàng tìm phong cách của bạn?
        </h2>
        <p className="text-background/60 mb-10 max-w-md mx-auto font-body text-sm leading-relaxed">
          Bắt đầu với quiz phong cách 2 phút — hoàn toàn miễn phí.
          AI sẽ phân tích và gợi ý outfit phù hợp nhất cho bạn.
        </p>
        <Button variant="accent" size="lg" className="gap-2 rounded-full font-body px-8">
          Bắt đầu ngay <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  </section>
);

export default CTABanner;

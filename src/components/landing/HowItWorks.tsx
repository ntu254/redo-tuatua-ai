import { MessageSquare, Wand2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: MessageSquare, title: "Mô tả phong cách", desc: "Nhập mô tả outfit bạn muốn — casual, công sở, dạ tiệc. Thêm màu sắc, dịp mặc, ngân sách.", accent: "text-accent", bg: "bg-coral-light", num: "01" },
  { icon: Wand2, title: "AI tạo outfit", desc: "AI tự động tổ hợp các item phù hợp: Quần, Áo, Giày, Phụ kiện theo phong cách và ngân sách.", accent: "text-teal", bg: "bg-teal-light", num: "02" },
  { icon: ShoppingBag, title: "Mua ngay trên sàn", desc: "Mỗi item liên kết sản phẩm tốt nhất trên Shopee, Lazada, Tiki. Mua chỉ với 1 click.", accent: "text-foreground", bg: "bg-secondary", num: "03" },
];

const HowItWorks = () => (
  <section className="py-0 bg-background">
    <div className="mag-grid grid-cols-1 md:grid-cols-[300px_1fr]">
      {/* Left label */}
      <div className="flex items-center justify-center p-12 md:p-16 bg-off-white">
        <div>
          <p className="editorial-label mb-4">Cách hoạt động</p>
          <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground leading-tight">
            Ba bước đến<br /><span className="italic">outfit hoàn hảo</span>
          </h2>
          <div className="editorial-divider mt-6" />
        </div>
      </div>

      {/* Right — 3 cards grid */}
      <div className="mag-grid grid-cols-1 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.5 }}
            className={`${step.bg} p-8 md:p-10 flex flex-col justify-between min-h-[300px]`}>
            <div>
              <span className="editorial-label">{step.num}</span>
              <div className={`mt-6 mb-5 ${step.accent}`}>
                <step.icon className="w-6 h-6" strokeWidth={1.5} />
              </div>
            </div>
            <div>
              <h3 className="font-heading text-xl font-medium text-foreground mb-3">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed font-body">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

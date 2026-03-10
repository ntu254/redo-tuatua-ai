import { MessageSquare, Wand2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { icon: MessageSquare, title: "Mô tả phong cách", desc: "Nhập mô tả outfit bạn muốn — casual, công sở, dạ tiệc. Thêm màu sắc, dịp mặc, ngân sách.", bg: "bg-peach-light", iconColor: "text-peach", num: "01" },
  { icon: Wand2, title: "AI tạo outfit", desc: "AI tự động tổ hợp các item phù hợp: Quần, Áo, Giày, Phụ kiện theo phong cách và ngân sách.", bg: "bg-sky-light", iconColor: "text-sky", num: "02" },
  { icon: ShoppingBag, title: "Mua ngay trên sàn", desc: "Mỗi item liên kết sản phẩm tốt nhất trên Shopee, Lazada, Tiki. Mua chỉ với 1 click.", bg: "bg-sage-light", iconColor: "text-sage", num: "03" },
];

const HowItWorks = () => (
  <section className="py-28 bg-card">
    <div className="container mx-auto px-6">
      <div className="text-center mb-20">
        <p className="text-[11px] font-body uppercase tracking-[0.3em] text-muted-foreground mb-4">Cách hoạt động</p>
        <h2 className="font-heading text-3xl md:text-4xl font-semibold text-foreground italic">
          Ba bước đến outfit hoàn hảo
        </h2>
        <div className="editorial-divider mx-auto mt-6" />
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div key={step.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
            className={`${step.bg} rounded-3xl p-8 editorial-card`}>
            <span className="text-[11px] font-body font-medium tracking-[0.2em] text-muted-foreground">{step.num}</span>
            <div className={`w-12 h-12 mt-4 mb-5 flex items-center justify-center ${step.iconColor}`}>
              <step.icon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-3">{step.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-body">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

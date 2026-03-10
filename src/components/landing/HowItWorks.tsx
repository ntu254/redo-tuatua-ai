import { MessageSquare, Wand2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: MessageSquare,
    title: "Mô tả phong cách",
    desc: "Nhập mô tả outfit bạn muốn — casual, công sở, dạ tiệc. Thêm màu sắc, dịp mặc, ngân sách, ngày.",
    bg: "bg-pastel-orange",
  },
  {
    icon: Wand2,
    title: "AI tạo outfit",
    desc: "Từ lệnh AI, hệ thống tự động tổ hợp lại các item: Quần/Áo/Giày/Phụ kiện phù hợp với sở thích, phong cách và ngân sách.",
    bg: "bg-pastel-blue",
  },
  {
    icon: ShoppingBag,
    title: "Mua ngay trên sàn",
    desc: "Mỗi item trong outfit đã liên kết đến sản phẩm tốt nhất/giá tốt nhất trên Shopee, Lazada, Tiki,...",
    bg: "bg-pastel-green",
  },
];

const HowItWorks = () => (
  <section className="py-24 bg-card">
    <div className="container mx-auto px-4">
      <div className="text-center mb-16">
        <span className="inline-block text-xs font-heading uppercase tracking-widest text-muted-foreground border border-border rounded-full px-4 py-1.5 mb-4">
          Cách hoạt động
        </span>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
          Ba bước đến outfit hoàn hảo
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className={`${step.bg} rounded-2xl p-8 text-center`}
          >
            <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center text-accent">
              <step.icon className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
              {step.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {step.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

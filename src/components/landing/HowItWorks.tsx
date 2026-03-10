import { ClipboardList, Wand2, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: ClipboardList,
    title: "Làm bài quiz phong cách",
    desc: "Trả lời vài câu hỏi nhanh hoặc tải lên tủ đồ. Cho chúng tôi biết vibe, ngân sách và dịp mặc.",
    accent: "text-accent",
    bg: "bg-coral-light",
    num: "01",
  },
  {
    icon: Wand2,
    title: "AI tạo outfit",
    desc: "AI tạo bộ outfit hoàn chỉnh — áo, quần, giày, phụ kiện — phù hợp với phong cách của bạn.",
    accent: "text-teal",
    bg: "bg-teal-light",
    num: "02",
  },
  {
    icon: ShoppingBag,
    title: "Mua sắm ngay",
    desc: "Mỗi sản phẩm đều có link giá tốt nhất trên Shopee, Lazada, Tiki, Zalora. Mua chỉ với một click.",
    accent: "text-foreground",
    bg: "bg-secondary",
    num: "03",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="py-0 bg-background">
    <div className="mag-grid grid-cols-1 md:grid-cols-[280px_1fr]">
      {/* Left label */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center p-12 md:p-16 bg-off-white"
      >
        <div>
          <p className="editorial-label mb-4">Cách hoạt động</p>
          <h2 className="font-heading text-3xl md:text-4xl font-medium text-foreground leading-tight">
            Ba bước để có<br /><span className="font-semibold">outfit hoàn hảo</span>
          </h2>
          <div className="editorial-divider mt-6" />
        </div>
      </motion.div>

      {/* Right — 3 cards */}
      <div className="mag-grid grid-cols-1 md:grid-cols-3">
        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, type: "spring", damping: 20 }}
            className={`${step.bg} p-8 md:p-10 flex flex-col justify-between min-h-[320px] group hover:shadow-lg transition-shadow duration-500`}
          >
            <div>
              <span className="editorial-label">{step.num}</span>
              <motion.div
                className={`mt-6 mb-5 ${step.accent}`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <step.icon className="w-7 h-7" strokeWidth={1.5} />
              </motion.div>
            </div>
            <div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-body">{step.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

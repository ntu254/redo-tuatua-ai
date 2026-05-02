import { motion } from "framer-motion";
import { ClipboardList, ShoppingBag, Wand2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Làm bài quiz phong cách",
    desc: "Trả lời vài câu hỏi nhanh hoặc tải lên tủ đồ. Cho chúng tôi biết vibe, ngân sách và dịp mặc.",
    accent: "text-primary",
    bg: "bg-[hsl(var(--coral-light))]",
    num: "01",
  },
  {
    icon: Wand2,
    title: "AI tạo outfit",
    desc: "AI tạo bộ outfit hoàn chỉnh — áo, quần, giày, phụ kiện — phù hợp với phong cách của bạn.",
    accent: "text-accent",
    bg: "bg-[hsl(var(--mint-light))]",
    num: "02",
  },
  {
    icon: ShoppingBag,
    title: "Mua sắm ngay",
    desc: "Mỗi sản phẩm đều có link giá tốt nhất trên Shopee, Lazada, Tiki, Zalora. Mua chỉ với một click.",
    accent: "text-teal",
    bg: "bg-[hsl(var(--secondary))]",
    num: "03",
  },
];

const HowItWorks = () => (
  <section id="how-it-works" className="bg-background py-8 md:py-12">
    <div className="grid grid-cols-1 gap-4 md:grid-cols-[320px_1fr]">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="soft-panel flex items-center justify-center p-12 md:p-16"
      >
        <div>
          <p className="editorial-label mb-4">Cách hoạt động</p>
          <h2 className="font-heading text-3xl font-medium leading-tight text-foreground md:text-4xl">
            Ba bước để có
            <br />
            <span className="font-semibold">outfit hoàn hảo</span>
          </h2>
          <div className="editorial-divider mt-6" />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {steps.map((step, index) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15, type: "spring", damping: 20 }}
            className={`${step.bg} flex min-h-[320px] flex-col justify-between rounded-[32px] border border-border/70 p-8 shadow-[0_24px_50px_-34px_hsl(var(--primary)/0.18)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_30px_60px_-28px_hsl(var(--accent)/0.2)] md:p-10`}
          >
            <div>
              <span className="editorial-label">{step.num}</span>
              <motion.div
                className={`mb-5 mt-6 ${step.accent}`}
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <step.icon className="h-7 w-7" strokeWidth={1.5} />
              </motion.div>
            </div>
            <div>
              <h3 className="mb-3 font-heading text-xl font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {step.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;

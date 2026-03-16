import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

const CTABanner = () => (
  <section className="relative my-8 overflow-hidden md:mx-6 md:my-12">
    <div
      className="absolute inset-0 rounded-[40px]"
      style={{
        background: `
          radial-gradient(circle at 88% 18%, hsl(var(--coral-light)) 0%, transparent 26%),
          radial-gradient(circle at 16% 86%, hsl(var(--mint-light)) 0%, transparent 24%),
          linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--teal)) 42%, hsl(var(--accent)) 100%)
        `,
      }}
    />
    <div
      className="absolute inset-0 rounded-[40px] opacity-[0.08]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.9) 1px, transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    />
    <div className="absolute inset-0 rounded-[40px] border border-white/15" />

    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, type: "spring", damping: 20 }}
      className="relative z-10 px-6 py-24 text-center md:py-28"
    >
      <div className="absolute left-1/2 top-1/2 h-[360px] w-[min(980px,94%)] -translate-x-1/2 -translate-y-1/2 rounded-[56px] bg-black/32 blur-3xl" />
      <div
        className="absolute left-1/2 top-1/2 h-[278px] w-[min(820px,88%)] -translate-x-1/2 -translate-y-1/2 rounded-[42px] border border-white/10"
        style={{
          background:
            "linear-gradient(180deg, rgba(7, 10, 18, 0.42) 0%, rgba(10, 14, 24, 0.32) 100%)",
          boxShadow: "0 24px 60px -28px rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(8px)",
        }}
      />

      <div className="relative z-10">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-6 text-md font-body font-medium uppercase tracking-[0.4em] text-background"
        >
          Are you ready?
        </motion.p>

        <h2
          className="mx-auto mb-6 max-w-3xl font-heading text-4xl font-semibold leading-tight text-background md:text-5xl lg:text-6xl"
          style={{ textShadow: "0 8px 24px rgba(0, 0, 0, 0.28)" }}
        >
          Để trở thành <span className="font-semibold">stylist riêng</span> của bạn
        </h2>

        <p
          className="mx-auto mb-10 max-w-xl text-sm leading-relaxed text-background/80 md:text-base"
          style={{ textShadow: "0 4px 18px rgba(0, 0, 0, 0.18)" }}
        >
          Mô tả phong cách của bạn và nhận gợi ý outfit ngay lập tức kèm link mua hàng từ Shopee,
          Lazada, Tiki và nhiều sàn khác.
        </p>

        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="accent"
            size="lg"
            className="gap-2 bg-background text-foreground shadow-[0_22px_38px_-20px_hsl(var(--foreground)/0.28)] hover:bg-background/96"
          >
            Bắt đầu ngay <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  </section>
);

export default CTABanner;

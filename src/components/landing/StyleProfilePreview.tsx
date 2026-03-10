import { motion } from "framer-motion";
import { BarChart3, Palette, User } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { icon: BarChart3, label: "Style DNA", value: "Minimal 70%" },
  { icon: Palette, label: "Top Color", value: "White · 35%" },
  { icon: User, label: "Outfit Type", value: "Casual · 42%" },
];

const StyleProfilePreview = () => (
  <section className="bg-background">
    <div className="border-b border-border px-6 py-16 text-center">
      <p className="editorial-label mb-4">AI Analytics</p>
      <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
        Your <span className="italic">Style Profile</span>
      </h2>
    </div>

    <div className="mag-grid grid-cols-1 md:grid-cols-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="p-10 text-center"
        >
          <s.icon className="w-6 h-6 text-accent mx-auto mb-4" />
          <p className="editorial-label mb-2">{s.label}</p>
          <p className="font-heading text-2xl text-foreground">{s.value}</p>
        </motion.div>
      ))}
    </div>

    <div className="border-t border-border px-6 py-10 text-center">
      <Link
        to="/style-profile"
        className="inline-block text-[11px] font-body font-medium uppercase tracking-[0.2em] text-accent hover:text-accent/80 transition-colors"
      >
        Khám phá Style Profile của bạn →
      </Link>
    </div>
  </section>
);

export default StyleProfilePreview;

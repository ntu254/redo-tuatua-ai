import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const stats = [
  { value: "12,400+", label: "Active Users" },
  { value: "50K+", label: "Outfits Generated" },
  { value: "5", label: "Shopping Platforms" },
  { value: "98%", label: "Satisfaction Rate" },
];

const testimonials = [
  {
    text: "StyleAI completely changed how I shop. I save hours every week and my outfits always get compliments!",
    author: "Minh Anh",
    role: "Fashion Enthusiast",
    rating: 5,
  },
  {
    text: "The AI suggestions are scarily accurate. It knows my style better than I do. And the shopping links make it so easy.",
    author: "Thu Hà",
    role: "Content Creator",
    rating: 5,
  },
  {
    text: "As a busy professional, this app is a lifesaver. Perfect office outfits in seconds, all within my budget.",
    author: "Đức Trung",
    role: "Marketing Manager",
    rating: 5,
  },
];

const SocialProof = () => (
  <section className="bg-background">
    {/* Stats strip */}
    <div className="mag-grid grid-cols-2 md:grid-cols-4 border-t border-border">
      {stats.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: i * 0.08 }}
          className="py-14 text-center">
          <p className="font-heading text-4xl md:text-5xl font-light text-foreground">{s.value}</p>
          <p className="editorial-label mt-3">{s.label}</p>
        </motion.div>
      ))}
    </div>

    {/* Testimonials */}
    <div className="border-t border-border">
      <div className="px-6 py-16 text-center">
        <p className="editorial-label mb-4">What Users Say</p>
        <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
          Loved by <span className="italic">fashion enthusiasts</span>
        </h2>
      </div>

      <div className="mag-grid grid-cols-1 md:grid-cols-3">
        {testimonials.map((t, i) => (
          <motion.div key={t.author} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="p-8 md:p-10 flex flex-col">
            <Quote className="w-6 h-6 text-accent/30 mb-5" />
            <p className="text-sm font-body text-foreground leading-relaxed mb-6 flex-1">{t.text}</p>
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: t.rating }).map((_, j) => (
                <Star key={j} className="w-3.5 h-3.5 fill-accent text-accent" />
              ))}
            </div>
            <div>
              <p className="text-sm font-body font-semibold text-foreground">{t.author}</p>
              <p className="text-xs font-body text-muted-foreground">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default SocialProof;

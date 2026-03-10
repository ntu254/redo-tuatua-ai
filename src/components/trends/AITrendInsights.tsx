import { motion } from "framer-motion";
import { Sparkles, TrendingUp, ArrowUpRight } from "lucide-react";

const insights = [
  { text: "Linen outfit searches increased 64% this summer.", stat: "+64%", category: "Fabric" },
  { text: "Gorpcore style grew 40% on social media.", stat: "+40%", category: "Aesthetic" },
  { text: "Butter yellow appears in 38% of summer 2026 collections.", stat: "38%", category: "Color" },
  { text: "Cargo pants are the #1 searched item globally.", stat: "#1", category: "Item" },
  { text: "Quiet luxury outfits have 2.3x higher save rates.", stat: "2.3x", category: "Style" },
  { text: "Korean fashion content engagement up 55% year-over-year.", stat: "+55%", category: "Culture" },
];

const AITrendInsights = () => {
  return (
    <section className="py-14 md:py-20 border-t border-border bg-muted/30">
      <div className="container mx-auto max-w-6xl px-6">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="editorial-label mb-3 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-accent" /> Powered by StyleAI
            </p>
            <h2 className="font-heading text-3xl md:text-4xl font-light text-foreground">
              AI Trend <span className="italic">Insights</span>
            </h2>
          </div>
          <TrendingUp className="w-5 h-5 text-muted-foreground hidden md:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
          {insights.map((ins, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="bg-background p-6 flex gap-4 items-start group hover:bg-card transition-colors"
            >
              <div className="text-2xl md:text-3xl font-heading font-light text-accent shrink-0 w-14 text-right">
                {ins.stat}
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-body font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  {ins.category}
                </span>
                <p className="text-[12px] font-body text-foreground leading-relaxed mt-1">
                  {ins.text}
                </p>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-1" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AITrendInsights;

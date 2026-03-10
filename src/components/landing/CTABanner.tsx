import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTABanner = () => (
  <section className="relative overflow-hidden">
    {/* Gradient background */}
    <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground to-foreground/90" />
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: "radial-gradient(circle at 25% 25%, hsl(var(--accent)) 1px, transparent 1px)",
      backgroundSize: "32px 32px",
    }} />

    <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
      className="relative z-10 text-center px-6 py-24 md:py-32">
      <p className="text-[10px] font-body font-medium uppercase tracking-[0.4em] text-background/30 mb-6">Ready to start?</p>
      <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl font-light text-background leading-tight mb-6 max-w-2xl mx-auto">
        Let AI become your <span className="italic">personal stylist</span>
      </h2>
      <p className="text-background/40 text-sm font-body leading-relaxed mb-10 max-w-md mx-auto">
        Take a 2-minute style quiz — completely free. AI will analyze your preferences and suggest perfect outfits.
      </p>
      <Button variant="accent" size="lg" className="gap-2">
        Start Styling Now <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </motion.div>
  </section>
);

export default CTABanner;

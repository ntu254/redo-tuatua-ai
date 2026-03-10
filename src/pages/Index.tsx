import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import StylePicker from "@/components/landing/StylePicker";
import AIInput from "@/components/landing/AIInput";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <StylePicker />
    <AIInput />
    <CTABanner />
    <Footer />
  </div>
);

export default Index;

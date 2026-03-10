import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorks from "@/components/landing/HowItWorks";
import StyleExplorer from "@/components/landing/StyleExplorer";
import OutfitGenerator from "@/components/landing/OutfitGenerator";
import AIInput from "@/components/landing/AIInput";
import SocialProof from "@/components/landing/SocialProof";
import StyleProfilePreview from "@/components/landing/StyleProfilePreview";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

const Index = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <HeroSection />
    <HowItWorks />
    <StyleExplorer />
    <OutfitGenerator />
    <AIInput />
    <SocialProof />
    <StyleProfilePreview />
    <CTABanner />
    <Footer />
  </div>
);

export default Index;

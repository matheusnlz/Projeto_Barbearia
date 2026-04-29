import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import ServicesPreview from "@/components/layout/ServicesPreview";
import AboutSection from "@/components/layout/AboutSection";
import ContactSection from "@/components/layout/ContactSection";
import Footer from "@/components/layout/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesPreview />
      <AboutSection />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Index;

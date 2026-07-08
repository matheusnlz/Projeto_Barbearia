import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/layout/HeroSection";
import ServicesPreview from "@/components/layout/ServicesPreview";
import ContactSection from "@/components/layout/ContactSection";
import Footer from "@/components/layout/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ServicesPreview />
      <ContactSection />
      <Footer />
    </div>
  );
};

export default Home;

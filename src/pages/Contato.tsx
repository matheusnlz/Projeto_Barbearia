import Navbar from "@/components/layout/Navbar";
import ContactSection from "@/components/layout/ContactSection";
import Footer from "@/components/layout/Footer";

const Contato = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Contato;

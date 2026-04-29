import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AppointmentForm from "@/features/agendamento/components/AppointmentForm";

const Agendar = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <AppointmentForm />
      <Footer />
    </div>
  );
};

export default Agendar;

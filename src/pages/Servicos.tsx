import { motion } from "framer-motion";
import { Clock, DollarSign } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { defaultServices } from "@/data/services";
import { Link } from "react-router-dom";
import beardImg from "@/assets/beard-service.jpg";

const Servicos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-16 relative">
        <div className="container mx-auto px-4 text-center">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-3">O Que Oferecemos</p>
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Nossos <span className="text-gold-gradient">Serviços</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Serviços premium para o homem moderno que valoriza estilo e cuidado pessoal.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="pb-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {defaultServices.map((service, i) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary/50 hover:shadow-gold transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-display text-xl font-semibold">{service.name}</h3>
                  <span className="text-primary font-bold text-xl">
                    R$ {service.price}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    {service.duration} min
                  </div>
                  <Link
                    to={`/agendar?servico=${service.id}`}
                    className="text-primary text-xs font-semibold uppercase tracking-wider hover:underline"
                  >
                    Agendar →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 relative rounded-lg overflow-hidden max-w-4xl mx-auto">
            <img src={beardImg} alt="Serviço de barba" className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <div className="text-center">
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  Pronto para um novo <span className="text-gold-gradient">visual</span>?
                </h3>
                <Link
                  to="/agendar"
                  className="bg-gold-gradient text-primary-foreground px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity inline-block"
                >
                  Agendar Agora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Servicos;

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-barbershop.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Barbearia Seu Jota" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-semibold mb-4">
            Barbearia Premium
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight">
            Seu <span className="text-gold-gradient">Jota</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-10 font-light">
            Estilo, tradição e qualidade no seu corte
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/agendar"
              className="bg-gold-gradient text-primary-foreground px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity inline-block"
            >
              Agendar Horário
            </Link>
            <Link
              to="/servicos"
              className="border border-primary text-primary px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground transition-colors inline-block"
            >
              Nossos Serviços
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-primary/40 rounded-full flex justify-center pt-2">
          <div className="w-1 h-2 bg-primary rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

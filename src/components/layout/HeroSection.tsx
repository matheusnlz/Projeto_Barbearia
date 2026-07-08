import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-barbershop.jpg";
import logo from "@/assets/logo-seu-jota.png";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Barbearia Seu Jota" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          <motion.img
            src={logo}
            alt="Logo Barbearia Seu Jota"
            className="w-40 h-40 md:w-52 md:h-52 rounded-full object-cover mb-8 border-2 border-primary/30"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          />
          <p className="text-primary uppercase tracking-[0.3em] text-sm font-semibold mb-4">
            Barbearia Premium
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 leading-tight text-foreground">
            Seu <span className="text-gold-gradient">Jota</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-10 font-light">
            Old school, moderno e aconchegante.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/agendar"
              className="bg-primary text-primary-foreground px-10 py-4 rounded-sm text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity inline-block"
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

    </section>
  );
};

export default HeroSection;

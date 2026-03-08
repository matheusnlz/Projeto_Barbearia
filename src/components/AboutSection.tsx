import { motion } from "framer-motion";
import barberImg from "@/assets/barber-working.jpg";

const AboutSection = () => {
  return (
    <section className="py-20 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img
                src={barberImg}
                alt="Barbeiro trabalhando"
                className="rounded-lg w-full h-[400px] object-cover"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gold-gradient rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <span className="text-primary-foreground font-display text-2xl font-bold block">10+</span>
                  <span className="text-primary-foreground text-xs uppercase tracking-wider">Anos</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-3">Sobre Nós</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
              Tradição & <span className="text-gold-gradient">Estilo</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A Barbearia Seu Jota nasceu da paixão por transformar o visual masculino. 
              Há mais de 10 anos, oferecemos cortes modernos, cuidados com a barba e 
              uma experiência única para cada cliente.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              Nosso compromisso é com a qualidade, o atendimento personalizado e a 
              satisfação de cada homem que passa pela nossa cadeira. Aqui, cada corte 
              é uma obra de arte.
            </p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { number: "5000+", label: "Clientes" },
                { number: "10+", label: "Anos" },
                { number: "8", label: "Serviços" },
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 bg-secondary rounded-lg">
                  <span className="text-primary font-display text-2xl font-bold block">{stat.number}</span>
                  <span className="text-muted-foreground text-xs uppercase tracking-wider">{stat.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

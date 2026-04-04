import { motion } from "framer-motion";
import { Scissors, Sparkles, Sun, Layers, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useServices } from "@/hooks/useServices";

const iconMap: Record<string, any> = {
  "Corte": Scissors,
  "Barba": Sparkles,
  "Luzes": Sun,
  "Corte + Barba": Layers,
};

const ServicesPreview = () => {
  const { services, loading } = useServices();

  // Pegar apenas os 4 primeiros para o preview
  const previewServices = services.slice(0, 4);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-3">Nossos Serviços</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            O Melhor Para <span className="text-gold-gradient">Você</span>
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {previewServices.map((service, i) => {
              const Icon = iconMap[service.name] || Scissors;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary/50 hover:shadow-gold transition-all duration-300 group"
                >
                  <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-secondary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-1">{service.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{service.description}</p>
                  <p className="text-primary font-bold text-xl">R$ {Number(service.price).toFixed(0)}</p>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to="/servicos"
            className="text-primary text-sm font-semibold uppercase tracking-wider hover:underline"
          >
            Ver todos os serviços →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;

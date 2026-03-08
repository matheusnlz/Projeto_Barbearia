import { Scissors, Phone, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Scissors className="h-5 w-5 text-primary" />
              <span className="font-display text-lg font-bold">
                Barbearia Seu <span className="text-gold-gradient">Jota</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Estilo, tradição e qualidade no seu corte. Há mais de 10 anos transformando visual e autoestima.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Links Rápidos
            </h4>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Início</Link>
              <Link to="/servicos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Serviços</Link>
              <Link to="/agendar" className="text-sm text-muted-foreground hover:text-primary transition-colors">Agendar</Link>
              <Link to="/contato" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contato</Link>
            </div>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary mb-4">
              Contato
            </h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="h-4 w-4 text-primary" />
                (11) 99999-9999
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                Rua Exemplo, 123 - Centro
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Seg-Sáb: 9h - 20h
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Barbearia Seu Jota. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

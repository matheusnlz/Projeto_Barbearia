import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";

const ContactSection = () => {
  return (
    <section className="py-20 bg-background" id="contato">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-3">Contato</p>
          <h2 className="font-display text-3xl md:text-5xl font-bold">
            Fale <span className="text-gold-gradient">Conosco</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="space-y-6">
            {[
              { icon: Phone, title: "Telefone", value: "(11) 93002-2620" },
              { icon: MapPin, title: "Endereço", value: "Rua Álvaro Alvim, 519 - Paulicéia, São Bernardo do Campo - SP, 09693-000" },
              { icon: Clock, title: "Horário", value: "Seg-Sáb: 9h às 20h" },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 p-4 bg-card rounded-lg border border-border">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-1">{item.title}</h4>
                  <p className="text-muted-foreground text-sm">{item.value}</p>
                </div>
              </div>
            ))}

            <a
              href="https://wa.me/5511930022620"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-gold-gradient text-primary-foreground py-3 rounded-lg font-semibold text-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="h-5 w-5" />
              Chamar no WhatsApp
            </a>
          </div>

          <div className="rounded-lg overflow-hidden border border-border h-[300px] md:h-full min-h-[300px]">
            <iframe
              src="https://maps.app.goo.gl/fkr37T3Mcn7N8F9Y9?g_st=ic"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Localização da Barbearia"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

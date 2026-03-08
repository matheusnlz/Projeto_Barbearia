import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { defaultServices } from "@/data/services";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30",
];

const Agendar = () => {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("servico") || "";

  const [selectedService, setSelectedService] = useState(preselected);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !date || !time || !name || !phone) {
      toast.error("Preencha todos os campos");
      return;
    }

    // Save to localStorage for now (will be replaced with DB)
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const service = defaultServices.find((s) => s.id === selectedService);
    appointments.push({
      id: Date.now().toString(),
      serviceId: selectedService,
      serviceName: service?.name,
      date: format(date, "yyyy-MM-dd"),
      time,
      clientName: name,
      clientPhone: phone,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("appointments", JSON.stringify(appointments));

    setSubmitted(true);
    toast.success("Agendamento confirmado!");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-28 pb-20 container mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="h-10 w-10 text-primary-foreground" />
          </motion.div>
          <h1 className="font-display text-3xl font-bold mb-4">Agendamento Confirmado!</h1>
          <p className="text-muted-foreground mb-2">
            {defaultServices.find((s) => s.id === selectedService)?.name} — {date && format(date, "dd/MM/yyyy")} às {time}
          </p>
          <p className="text-muted-foreground text-sm mb-8">Esperamos você, {name}!</p>
          <button
            onClick={() => { setSubmitted(false); setSelectedService(""); setDate(undefined); setTime(""); setName(""); setPhone(""); }}
            className="bg-gold-gradient text-primary-foreground px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            Novo Agendamento
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-10">
            <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-3">Agendamento</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Agende seu <span className="text-gold-gradient">Horário</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Service */}
            <div>
              <label className="block text-sm font-semibold mb-3 uppercase tracking-wider">Serviço</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {defaultServices.map((service) => (
                  <button
                    type="button"
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={cn(
                      "p-4 rounded-lg border text-left transition-all",
                      selectedService === service.id
                        ? "border-primary bg-primary/10 shadow-gold"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm">{service.name}</span>
                      <span className="text-primary font-bold text-sm">R$ {service.price}</span>
                    </div>
                    <span className="text-muted-foreground text-xs">{service.duration} min</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-semibold mb-3 uppercase tracking-wider">Data</label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "w-full flex items-center gap-2 p-3 rounded-lg border bg-card text-left text-sm",
                      date ? "border-primary" : "border-border text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    {date ? format(date, "dd 'de' MMMM, yyyy", { locale: ptBR }) : "Selecione uma data"}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(d) => d < new Date() || d.getDay() === 0}
                    className="p-3 pointer-events-auto bg-popover"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            {date && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider">Horário</label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setTime(slot)}
                      className={cn(
                        "py-2 rounded-md border text-sm font-medium transition-all",
                        time === slot
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-foreground hover:border-primary/30"
                      )}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Client info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider">Nome</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider">Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gold-gradient text-primary-foreground py-4 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Confirmar Agendamento
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Agendar;

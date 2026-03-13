import { useState, useEffect } from "react";
import { format, isToday, addHours, setHours, setMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, Loader2, User } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { defaultServices } from "@/data/services";
import { barbers } from "@/data/barbers";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const ALL_TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30",
];

const Agendar = () => {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("servico") || "";

  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedService, setSelectedService] = useState(preselected);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch booked slots when date or barber changes
  useEffect(() => {
    if (!date || !selectedBarber) return;
    setTime("");
    setLoadingSlots(true);

    const dateStr = format(date, "yyyy-MM-dd");
    supabase
      .from("appointments")
      .select("appointment_time")
      .eq("appointment_date", dateStr)
      .eq("barber_name", selectedBarber)
      .eq("status", "confirmed")
      .then(({ data, error }) => {
        if (error) {
          console.error("Error fetching slots:", error);
          setBookedSlots([]);
        } else {
          setBookedSlots((data || []).map((r) => r.appointment_time));
        }
        setLoadingSlots(false);
      });
  }, [date, selectedBarber]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBarber || !selectedService || !date || !time || !name || !phone) {
      toast.error("Preencha todos os campos");
      return;
    }

    setSubmitting(true);
    const service = defaultServices.find((s) => s.id === selectedService);
    const dateStr = format(date, "yyyy-MM-dd");

    const { error } = await supabase.from("appointments").insert({
      service_id: selectedService,
      service_name: service?.name || "",
      appointment_date: dateStr,
      appointment_time: time,
      client_name: name,
      client_phone: phone,
      barber_name: selectedBarber,
      status: "confirmed",
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("Este horário já foi reservado. Escolha outro.");
        setBookedSlots((prev) => [...prev, time]);
        setTime("");
      } else {
        toast.error("Erro ao agendar. Tente novamente.");
        console.error(error);
      }
      return;
    }

    setSubmitted(true);
    toast.success("Agendamento confirmado!");
  };

  const resetForm = () => {
    setSubmitted(false);
    setSelectedBarber("");
    setSelectedService("");
    setDate(undefined);
    setTime("");
    setName("");
    setPhone("");
    setBookedSlots([]);
  };

  if (submitted) {
    const barber = barbers.find((b) => b.name === selectedBarber);
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
          <p className="text-muted-foreground mb-1">
            Barbeiro: <span className="text-foreground font-semibold">{selectedBarber}</span>
          </p>
          <p className="text-muted-foreground mb-2">
            {defaultServices.find((s) => s.id === selectedService)?.name} — {date && format(date, "dd/MM/yyyy")} às {time}
          </p>
          <p className="text-muted-foreground text-sm mb-8">Esperamos você, {name}!</p>
          <button
            onClick={resetForm}
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
            {/* Barber Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3 uppercase tracking-wider">Barbeiro</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {barbers.map((barber) => (
                  <button
                    type="button"
                    key={barber.id}
                    onClick={() => {
                      setSelectedBarber(barber.name);
                      setTime("");
                    }}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                      selectedBarber === barber.name
                        ? "border-primary bg-primary/10 shadow-gold"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className={cn(
                      "w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                      selectedBarber === barber.name
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    )}>
                      {barber.initials}
                    </div>
                    <span className="font-semibold text-sm">{barber.name}</span>
                  </button>
                ))}
              </div>
            </div>

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
                    disabled={(d) => {
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return d < today || d.getDay() === 0 || d.getDay() === 1;
                    }}
                    className="p-3 pointer-events-auto bg-popover"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            {date && selectedBarber && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                <label className="block text-sm font-semibold mb-3 uppercase tracking-wider">
                  Horários de {selectedBarber}
                </label>
                {loadingSlots ? (
                  <div className="flex items-center justify-center py-6 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Carregando horários...
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {ALL_TIME_SLOTS.map((slot) => {
                      const isBooked = bookedSlots.includes(slot);
                      
                      // For same-day bookings, require 2h minimum advance
                      let isTooSoon = false;
                      if (date && isToday(date)) {
                        const now = new Date();
                        const minTime = addHours(now, 2);
                        const [h, m] = slot.split(":").map(Number);
                        const slotTime = setMinutes(setHours(new Date(), h), m);
                        isTooSoon = slotTime <= minTime;
                      }
                      
                      const isDisabled = isBooked || isTooSoon;
                      return (
                        <button
                          type="button"
                          key={slot}
                          disabled={isDisabled}
                          onClick={() => setTime(slot)}
                          className={cn(
                            "py-2 rounded-md border text-sm font-medium transition-all",
                            isDisabled
                              ? "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed line-through"
                              : time === slot
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border bg-card text-foreground hover:border-primary/30"
                          )}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                )}
                {bookedSlots.length > 0 && !loadingSlots && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Horários riscados já estão reservados para {selectedBarber}
                  </p>
                )}
              </motion.div>
            )}

            {date && !selectedBarber && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Selecione um barbeiro para ver os horários disponíveis
              </p>
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
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground py-4 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitting ? "Agendando..." : "Confirmar Agendamento"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Agendar;

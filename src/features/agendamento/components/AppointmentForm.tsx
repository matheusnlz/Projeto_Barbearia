import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, Loader2 } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

import { useServices } from "@/features/services/hooks/useServices";
import { isDateDisabled } from "@/utils/timeSlots";
import { validateEmail, validatePhone } from "@/utils/validators";
import { formatPhone, onlyDigits } from "@/utils/format";

import BarberSelector from "./BarberSelector";
import TimeSelector from "./TimeSelector";
import { useAppointments } from "../hooks/useAppointments";
import { createAppointment } from "../services/appointmentsService";

const AppointmentForm = () => {
  const [searchParams] = useSearchParams();
  const preselected = searchParams.get("servico") || "";
  const { services } = useServices({ onlyActive: true });
  const getServiceById = (id: string) => services.find((s) => s.id === id);


  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedService, setSelectedService] = useState(preselected);
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; email?: string }>({});

  const { bookedSlots, loading: loadingSlots, addBookedSlot } = useAppointments(date, selectedBarber);

  const handleBarberChange = (name: string) => {
    setSelectedBarber(name);
    setTime("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { phone?: string; email?: string } = {};
    if (!validatePhone(phone)) newErrors.phone = "Digite um telefone válido";
    if (!validateEmail(email)) newErrors.email = "Digite um e-mail válido";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    if (!selectedBarber || !selectedService || !date || !time || !name.trim()) {
      toast.error("Preencha todos os campos");
      return;
    }

    setSubmitting(true);
    const service = getServiceById(selectedService);

    const { error } = await createAppointment({
      service_id: selectedService,
      service_name: service?.name || "",
      appointment_date: format(date, "yyyy-MM-dd"),
      appointment_time: time,
      client_name: name.trim(),
      client_phone: onlyDigits(phone),
      client_email: email.trim().toLowerCase(),
      barber_name: selectedBarber,
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("Este horário já foi reservado. Escolha outro.");
        addBookedSlot(time);
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
    setEmail("");
    setErrors({});
  };

  if (submitted) {
    return (
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
          {getServiceById(selectedService)?.name} — {date && format(date, "dd/MM/yyyy")} às {time}
        </p>
        <p className="text-muted-foreground text-sm mb-8">Esperamos você, {name}!</p>
        <button
          onClick={resetForm}
          className="bg-gold-gradient text-primary-foreground px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
        >
          Novo Agendamento
        </button>
      </div>
    );
  }

  return (
    <section className="pt-28 pb-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-10">
          <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-3">Agendamento</p>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Agende seu <span className="text-gold-gradient">Horário</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <BarberSelector value={selectedBarber} onChange={handleBarberChange} />

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
                  disabled={isDateDisabled}
                  className="p-3 pointer-events-auto bg-popover"
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Time */}
          {date && selectedBarber && (
            <TimeSelector
              date={date}
              barberName={selectedBarber}
              value={time}
              bookedSlots={bookedSlots}
              loading={loadingSlots}
              onChange={setTime}
            />
          )}

          {date && !selectedBarber && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Selecione um barbeiro para ver os horários disponíveis
            </p>
          )}

          {/* Client info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 uppercase tracking-wider">Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                maxLength={100}
                className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider">Telefone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(formatPhone(e.target.value));
                    if (errors.phone) setErrors((prev) => ({ ...prev, phone: undefined }));
                  }}
                  placeholder="(11) 99999-9999"
                  className={cn(
                    "w-full p-3 rounded-lg border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none transition-colors",
                    errors.phone ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                  )}
                />
                {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 uppercase tracking-wider">E-mail</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="seu@email.com"
                  maxLength={255}
                  className={cn(
                    "w-full p-3 rounded-lg border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none transition-colors",
                    errors.email ? "border-destructive focus:border-destructive" : "border-border focus:border-primary"
                  )}
                />
                {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
              </div>
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
  );
};

export default AppointmentForm;

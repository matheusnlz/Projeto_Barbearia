import { useState, useEffect } from "react";
import { format, isToday, isBefore, addHours, startOfToday, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Check, Loader2, Scissors, User, Phone, Mail } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useServices } from "@/hooks/useServices";
import { useBarbers } from "@/hooks/useBarbers";
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

const formSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  phone: z.string().min(10, "Telefone inválido").max(15, "Telefone inválido"),
  email: z.string().email("E-mail inválido"),
  barber: z.string().min(1, "Selecione um barbeiro"),
  service: z.string().min(1, "Selecione um serviço"),
  time: z.string().min(1, "Selecione um horário"),
});

type FormValues = z.infer<typeof formSchema>;

const Agendar = () => {
  const [searchParams] = useSearchParams();
  const preselectedService = searchParams.get("servico") || "";
  
  const { services, loading: loadingServices } = useServices();
  const { barbers, loading: loadingBarbers } = useBarbers();
  
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: preselectedService,
      time: "",
      barber: "",
    }
  });

  const selectedBarber = watch("barber");
  const selectedTime = watch("time");
  const selectedService = watch("service");

  // Fetch booked slots when date or barber changes
  useEffect(() => {
    if (!date || !selectedBarber) return;
    
    setValue("time", "");
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
  }, [date, selectedBarber, setValue]);

  const onSubmit = async (values: FormValues) => {
    if (!date) {
      toast.error("Selecione uma data");
      return;
    }

    setSubmitting(true);
    const service = services.find((s) => s.id === values.service);
    const dateStr = format(date, "yyyy-MM-dd");

    const { error } = await supabase.from("appointments").insert({
      service_id: values.service,
      service_name: service?.name || "",
      appointment_date: dateStr,
      appointment_time: values.time,
      client_name: values.name.trim(),
      client_phone: values.phone.replace(/\D/g, ""),
      client_email: values.email.trim().toLowerCase(),
      barber_name: values.barber,
      status: "confirmed",
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error("Este horário já foi reservado. Escolha outro.");
        setBookedSlots((prev) => [...prev, values.time]);
        setValue("time", "");
      } else {
        toast.error("Erro ao agendar. Tente novamente.");
        console.error(error);
      }
      return;
    }

    setSubmitted(true);
    toast.success("Agendamento confirmado!");
  };

  const isSlotAvailable = (time: string) => {
    if (bookedSlots.includes(time)) return false;
    
    if (date && isToday(date)) {
      const [hours, minutes] = time.split(":").map(Number);
      const slotDate = addHours(startOfToday(), hours);
      slotDate.setMinutes(minutes);
      
      // Regra: 2 horas de antecedência
      return isBefore(addHours(new Date(), 2), slotDate);
    }
    
    return true;
  };

  // Bloquear domingos (0) e segundas (1)
  const disabledDays = (date: Date) => {
    const day = getDay(date);
    return day === 0 || day === 1 || isBefore(date, startOfToday());
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
          <h2 className="font-display text-3xl font-bold mb-4">Agendamento Realizado!</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Tudo certo! Seu horário foi reservado com sucesso. Enviamos os detalhes para o seu e-mail.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              reset();
              setDate(undefined);
            }}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-sm text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
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
            <p className="text-primary uppercase tracking-[0.3em] text-xs font-semibold mb-3">Reserve seu horário</p>
            <h1 className="font-display text-4xl font-bold">Agendamento <span className="text-gold-gradient">Online</span></h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Barber & Service */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <Scissors className="h-5 w-5 text-primary" /> 1. Profissional e Serviço
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Barbeiro</label>
                  <select 
                    {...register("barber")}
                    className={cn(
                      "w-full p-3 rounded-lg border bg-background text-sm focus:outline-none transition-colors",
                      errors.barber ? "border-destructive" : "border-border focus:border-primary"
                    )}
                  >
                    <option value="">Selecione um barbeiro</option>
                    {barbers.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                  </select>
                  {errors.barber && <p className="text-destructive text-xs">{errors.barber.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Serviço</label>
                  <select 
                    {...register("service")}
                    className={cn(
                      "w-full p-3 rounded-lg border bg-background text-sm focus:outline-none transition-colors",
                      errors.service ? "border-destructive" : "border-border focus:border-primary"
                    )}
                  >
                    <option value="">Selecione um serviço</option>
                    {services.map(s => <option key={s.id} value={s.id}>{s.name} - R$ {Number(s.price).toFixed(0)}</option>)}
                  </select>
                  {errors.service && <p className="text-destructive text-xs">{errors.service.message}</p>}
                </div>
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-primary" /> 2. Data e Horário
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block">Data</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg border bg-background text-sm transition-colors",
                          !date ? "text-muted-foreground" : "text-foreground",
                          "border-border hover:border-primary"
                        )}
                      >
                        {date ? format(date, "PPP", { locale: ptBR }) : "Escolha uma data"}
                        <CalendarIcon className="h-4 w-4 opacity-50" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={disabledDays}
                        initialFocus
                        locale={ptBR}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {date && selectedBarber && (
                  <div className="space-y-3">
                    <label className="text-xs uppercase tracking-wider font-semibold text-muted-foreground block">Horários Disponíveis</label>
                    {loadingSlots ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                        <Loader2 className="h-4 w-4 animate-spin" /> Carregando horários...
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                        {ALL_TIME_SLOTS.map((t) => {
                          const available = isSlotAvailable(t);
                          return (
                            <button
                              key={t}
                              type="button"
                              disabled={!available}
                              onClick={() => setValue("time", t)}
                              className={cn(
                                "py-2 rounded-md text-xs font-bold transition-all border",
                                !available 
                                  ? "bg-secondary/50 text-muted-foreground/30 border-transparent cursor-not-allowed" 
                                  : selectedTime === t
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background border-border hover:border-primary text-foreground"
                              )}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {errors.time && <p className="text-destructive text-xs">{errors.time.message}</p>}
                  </div>
                )}
              </div>
            </div>

            {/* Step 3: Personal Info */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="font-display text-xl font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> 3. Seus Dados
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      {...register("name")}
                      placeholder="Seu nome completo"
                      className={cn(
                        "w-full pl-10 p-3 rounded-lg border bg-background text-sm focus:outline-none transition-colors",
                        errors.name ? "border-destructive" : "border-border focus:border-primary"
                      )}
                    />
                  </div>
                  {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        {...register("phone")}
                        placeholder="(00) 00000-0000"
                        className={cn(
                          "w-full pl-10 p-3 rounded-lg border bg-background text-sm focus:outline-none transition-colors",
                          errors.phone ? "border-destructive" : "border-border focus:border-primary"
                        )}
                      />
                    </div>
                    {errors.phone && <p className="text-destructive text-xs">{errors.phone.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        {...register("email")}
                        placeholder="seu@email.com"
                        className={cn(
                          "w-full pl-10 p-3 rounded-lg border bg-background text-sm focus:outline-none transition-colors",
                          errors.email ? "border-destructive" : "border-border focus:border-primary"
                        )}
                      />
                    </div>
                    {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground py-4 rounded-xl text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Check className="h-5 w-5" />}
              {submitting ? "Processando..." : "Confirmar Agendamento"}
            </button>
          </form>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Agendar;

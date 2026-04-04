import { useState, useEffect } from "react";
import { useBarbers } from "@/hooks/useBarbers";
import { cn } from "@/lib/utils";
import { Loader2, Calendar as CalendarIcon, Clock, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Appointment {
  id: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_phone: string;
  barber_name: string;
  status: string;
}

const TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30",
];

interface AdminBarberAgendaProps {
  appointments: Appointment[];
}

const AdminBarberAgenda = ({ appointments }: AdminBarberAgendaProps) => {
  const { barbers, loading: loadingBarbers } = useBarbers();
  const [selectedBarber, setSelectedBarber] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (barbers.length > 0 && !selectedBarber) {
      setSelectedBarber(barbers[0].name);
    }
  }, [barbers, selectedBarber]);

  const barberAppointments = appointments.filter(
    (a) => a.barber_name === selectedBarber && a.appointment_date === selectedDate
  );

  const occupiedTimes = new Set(barberAppointments.map((a) => a.appointment_time));

  if (loadingBarbers) return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Barber selector */}
      <div className="flex flex-wrap gap-2">
        {barbers.map((b) => (
          <button
            key={b.id}
            onClick={() => setSelectedBarber(b.name)}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-semibold transition-all",
              selectedBarber === b.name
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {b.name}
          </button>
        ))}
      </div>

      {/* Date picker */}
      <div className="flex items-center gap-3">
        <CalendarIcon className="h-5 w-5 text-primary" />
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="p-2 rounded-lg border border-border bg-card text-foreground text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {/* Time grid */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {TIME_SLOTS.map((time) => {
          const occupied = occupiedTimes.has(time);
          const apt = barberAppointments.find((a) => a.appointment_time === time);
          return (
            <div
              key={time}
              className={cn(
                "rounded-lg p-2 text-center text-sm border transition-all",
                occupied
                  ? "bg-destructive/10 border-destructive/30 text-destructive"
                  : "bg-card border-border text-muted-foreground"
              )}
              title={apt ? `${apt.client_name} - ${apt.service_name}` : "Disponível"}
            >
              <span className="font-semibold">{time}</span>
              {apt && <p className="text-[10px] mt-1 truncate">{apt.client_name}</p>}
            </div>
          );
        })}
      </div>

      {/* Appointments list for selected barber+date */}
      {barberAppointments.length > 0 && (
        <div className="animate-in fade-in slide-in-from-bottom-2">
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Detalhes ({barberAppointments.length} agendamento{barberAppointments.length > 1 ? "s" : ""})
          </h4>
          <div className="space-y-2">
            {barberAppointments
              .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
              .map((apt) => (
                <div key={apt.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{apt.client_name}</span>
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded uppercase font-bold">{apt.appointment_time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{apt.service_name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium">{apt.client_phone}</p>
                    <p className="text-[10px] text-muted-foreground">ID: {apt.id.slice(0, 8)}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBarberAgenda;

import { useState } from "react";
import { barbers } from "@/data/barbers";
import { cn } from "@/lib/utils";

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
  const [selectedBarber, setSelectedBarber] = useState(barbers[0]?.name || "");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const barberAppointments = appointments.filter(
    (a) => a.barber_name === selectedBarber && a.appointment_date === selectedDate
  );

  const occupiedTimes = new Set(barberAppointments.map((a) => a.appointment_time));

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
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="p-2 rounded-lg border border-border bg-card text-foreground text-sm focus:border-primary focus:outline-none"
      />

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
              {apt && <p className="text-xs mt-1 truncate">{apt.client_name}</p>}
            </div>
          );
        })}
      </div>

      {/* Appointments list for selected barber+date */}
      {barberAppointments.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Detalhes ({barberAppointments.length} agendamento{barberAppointments.length > 1 ? "s" : ""})
          </h4>
          <div className="space-y-2">
            {barberAppointments
              .sort((a, b) => a.appointment_time.localeCompare(b.appointment_time))
              .map((apt) => (
                <div key={apt.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-sm">{apt.client_name}</span>
                    <span className="text-xs text-muted-foreground ml-2">{apt.service_name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold">{apt.appointment_time}</span>
                    <p className="text-xs text-muted-foreground">{apt.client_phone}</p>
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

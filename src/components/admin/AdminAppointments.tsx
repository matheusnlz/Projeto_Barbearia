import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useBarbers } from "@/hooks/useBarbers";
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

interface AdminAppointmentsProps {
  appointments: Appointment[];
  loading: boolean;
  onDelete: (id: string) => void;
}

const AdminAppointments = ({ appointments, loading, onDelete }: AdminAppointmentsProps) => {
  const [filterBarber, setFilterBarber] = useState("");
  const { barbers, loading: loadingBarbers } = useBarbers();

  const filtered = filterBarber
    ? appointments.filter((a) => a.barber_name === filterBarber)
    : appointments;

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilterBarber("")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
            !filterBarber ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          Todos
        </button>
        {barbers.map((b) => (
          <button
            key={b.id}
            onClick={() => setFilterBarber(b.name)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
              filterBarber === b.name ? "bg-primary text-primary-foreground" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {b.name}
          </button>
        ))}
      </div>

      {loading || loadingBarbers ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando agendamentos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">Nenhum agendamento encontrado</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div key={apt.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold">{apt.client_name}</span>
                  <span className="text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded font-semibold">{apt.barber_name}</span>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{apt.service_name}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {apt.appointment_date} às {apt.appointment_time} · {apt.client_phone}
                </div>
              </div>
              <button
                onClick={() => onDelete(apt.id)}
                className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                title="Cancelar agendamento"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminAppointments;

import { CalendarDays, Users, Clock, CheckCircle } from "lucide-react";

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

interface AdminDashboardProps {
  appointments: Appointment[];
}

const AdminDashboard = ({ appointments }: AdminDashboardProps) => {
  const today = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((a) => a.appointment_date === today);
  const uniqueBarbers = new Set(appointments.map((a) => a.barber_name)).size;
  const confirmedToday = todayAppointments.filter((a) => a.status === "confirmed").length;

  const stats = [
    { label: "Agendamentos Hoje", value: todayAppointments.length, icon: CalendarDays, color: "text-primary" },
    { label: "Total Agendamentos", value: appointments.length, icon: Clock, color: "text-blue-400" },
    { label: "Barbeiros Ativos", value: uniqueBarbers, icon: Users, color: "text-green-400" },
    { label: "Confirmados Hoje", value: confirmedToday, icon: CheckCircle, color: "text-emerald-400" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Today's appointments */}
      <div>
        <h3 className="font-display text-lg font-semibold mb-4">Agendamentos de Hoje</h3>
        {todayAppointments.length === 0 ? (
          <p className="text-muted-foreground text-sm py-8 text-center">Nenhum agendamento para hoje</p>
        ) : (
          <div className="space-y-2">
            {todayAppointments.map((apt) => (
              <div key={apt.id} className="bg-card border border-border rounded-lg p-3 flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{apt.client_name}</span>
                    <span className="text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded">{apt.barber_name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{apt.appointment_time} · {apt.service_name}</p>
                </div>
                <span className="text-xs text-muted-foreground">{apt.client_phone}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

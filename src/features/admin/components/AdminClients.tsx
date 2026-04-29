import { useState, useEffect } from "react";
import { Users, Search, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";

interface AppointmentRecord {
  id: string;
  service_name: string;
  barber_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

interface ClientGroup {
  client_name: string;
  client_phone: string;
  client_email: string;
  visits: number;
  appointments: AppointmentRecord[];
}

const AdminClients = () => {
  const [clients, setClients] = useState<ClientGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Group by email or phone
    const groupMap = new Map<string, ClientGroup>();
    for (const apt of data || []) {
      const key = (apt.client_email && apt.client_email !== "") 
        ? apt.client_email.toLowerCase() 
        : apt.client_phone;
      
      if (!groupMap.has(key)) {
        groupMap.set(key, {
          client_name: apt.client_name,
          client_phone: apt.client_phone,
          client_email: apt.client_email || "",
          visits: 0,
          appointments: [],
        });
      }
      const group = groupMap.get(key)!;
      group.visits++;
      // Keep latest name
      if (apt.client_name) group.client_name = apt.client_name;
      group.appointments.push({
        id: apt.id,
        service_name: apt.service_name,
        barber_name: apt.barber_name,
        appointment_date: apt.appointment_date,
        appointment_time: apt.appointment_time,
        status: apt.status,
      });
    }

    const sorted = Array.from(groupMap.values()).sort((a, b) => b.visits - a.visits);
    setClients(sorted);
    setLoading(false);
  };

  const filtered = search.trim()
    ? clients.filter(
        (c) =>
          c.client_name.toLowerCase().includes(search.toLowerCase()) ||
          c.client_email.toLowerCase().includes(search.toLowerCase()) ||
          c.client_phone.includes(search.replace(/\D/g, ""))
      )
    : clients;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" /> Carregando clientes...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou telefone..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>{filtered.length} clientes</span>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-center py-12 text-muted-foreground">Nenhum cliente encontrado</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => {
            const key = client.client_email || client.client_phone;
            const isExpanded = expandedClient === key;
            return (
              <div key={key} className="bg-card border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedClient(isExpanded ? null : key)}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-muted/30 transition-colors"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold">{client.client_name}</span>
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded font-semibold">
                        {client.visits} {client.visits === 1 ? "visita" : "visitas"}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground flex flex-wrap gap-3">
                      {client.client_phone && <span>{client.client_phone}</span>}
                      {client.client_email && <span>{client.client_email}</span>}
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
                  )}
                </button>

                {isExpanded && (
                  <div className="border-t border-border px-4 py-3 space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-2">
                      Histórico de atendimentos
                    </p>
                    {client.appointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="flex items-center justify-between text-sm py-1.5 border-b border-border/50 last:border-0"
                      >
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-foreground">{apt.service_name}</span>
                          <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded">
                            {apt.barber_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {apt.appointment_date} {apt.appointment_time}
                          </span>
                          <span
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded",
                              apt.status === "confirmed"
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-destructive/20 text-destructive"
                            )}
                          >
                            {apt.status === "confirmed" ? "Confirmado" : apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminClients;

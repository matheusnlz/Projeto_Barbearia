import { useState, useEffect } from "react";
import { Trash2, Edit2, Lock, LogIn, Loader2, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { defaultServices, type Service } from "@/data/services";
import { barbers } from "@/data/barbers";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface Appointment {
  id: string;
  service_id: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_phone: string;
  barber_name: string;
  status: string;
  created_at: string;
}

const ADMIN_PASS = "seujota2024";

const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      onLogin();
      toast.success("Bem-vindo, administrador!");
    } else {
      toast.error("Senha incorreta");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-28 pb-20 container mx-auto px-4 max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold">Área Administrativa</h1>
          <p className="text-muted-foreground text-sm mt-2">Acesso restrito ao administrador</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha de acesso"
            className="w-full p-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-gold-gradient text-primary-foreground py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <LogIn className="h-4 w-4" /> Entrar
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

const AppointmentsList = ({
  appointments,
  loading,
  onDelete,
  filterBarber,
  onFilterChange,
}: {
  appointments: Appointment[];
  loading: boolean;
  onDelete: (id: string) => void;
  filterBarber: string;
  onFilterChange: (barber: string) => void;
}) => {
  const filtered = filterBarber
    ? appointments.filter((a) => a.barber_name === filterBarber)
    : appointments;

  return (
    <div>
      {/* Barber filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => onFilterChange("")}
          className={cn(
            "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
            !filterBarber
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          Todos
        </button>
        {barbers.map((b) => (
          <button
            key={b.id}
            onClick={() => onFilterChange(b.name)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all",
              filterBarber === b.name
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {b.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando agendamentos...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          Nenhum agendamento encontrado
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((apt) => (
            <div
              key={apt.id}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-semibold">{apt.client_name}</span>
                  <span className="text-xs text-primary-foreground bg-primary px-2 py-0.5 rounded font-semibold">
                    {apt.barber_name}
                  </span>
                  <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                    {apt.service_name}
                  </span>
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

const ServicesList = ({
  services,
  editingService,
  editPrice,
  onEdit,
  onSave,
  onEditPriceChange,
}: {
  services: Service[];
  editingService: string | null;
  editPrice: string;
  onEdit: (id: string, price: number) => void;
  onSave: (id: string) => void;
  onEditPriceChange: (val: string) => void;
}) => (
  <div className="space-y-3">
    {services.map((service) => (
      <div
        key={service.id}
        className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
      >
        <div>
          <span className="font-semibold">{service.name}</span>
          <span className="text-muted-foreground text-sm ml-3">{service.duration} min</span>
        </div>
        <div className="flex items-center gap-3">
          {editingService === service.id ? (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={editPrice}
                onChange={(e) => onEditPriceChange(e.target.value)}
                className="w-20 p-1.5 rounded border border-border bg-background text-sm text-foreground focus:border-primary focus:outline-none"
              />
              <button onClick={() => onSave(service.id)} className="text-primary text-sm font-semibold">
                Salvar
              </button>
            </div>
          ) : (
            <>
              <span className="text-primary font-bold">R$ {service.price}</span>
              <button
                onClick={() => onEdit(service.id, service.price)}
                className="text-muted-foreground hover:text-primary p-2 rounded-lg transition-colors"
              >
                <Edit2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    ))}
  </div>
);

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [activeTab, setActiveTab] = useState<"appointments" | "services">("appointments");
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [filterBarber, setFilterBarber] = useState("");

  const fetchAppointments = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true })
      .order("appointment_time", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar agendamentos");
      console.error(error);
    } else {
      setAppointments(data as Appointment[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (authenticated) {
      fetchAppointments();
    }
  }, [authenticated]);

  const deleteAppointment = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao cancelar agendamento");
      console.error(error);
    } else {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Agendamento cancelado — horário liberado!");
    }
  };

  const updateServicePrice = (id: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price)) return;
    setServices(services.map((s) => (s.id === id ? { ...s, price } : s)));
    setEditingService(null);
    toast.success("Preço atualizado");
  };

  if (!authenticated) {
    return <AdminLogin onLogin={() => setAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold">
              Painel <span className="text-gold-gradient">Administrativo</span>
            </h1>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 justify-center">
            {[
              { key: "appointments" as const, label: "Agendamentos" },
              { key: "services" as const, label: "Serviços" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "appointments" && (
            <AppointmentsList
              appointments={appointments}
              loading={loading}
              onDelete={deleteAppointment}
              filterBarber={filterBarber}
              onFilterChange={setFilterBarber}
            />
          )}

          {activeTab === "services" && (
            <ServicesList
              services={services}
              editingService={editingService}
              editPrice={editPrice}
              onEdit={(id, price) => {
                setEditingService(id);
                setEditPrice(price.toString());
              }}
              onSave={updateServicePrice}
              onEditPriceChange={setEditPrice}
            />
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;

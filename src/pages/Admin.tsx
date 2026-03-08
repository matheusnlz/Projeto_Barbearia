import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2, Edit2, Lock, LogIn } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { defaultServices, type Service } from "@/data/services";
import { toast } from "sonner";

interface Appointment {
  id: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  clientName: string;
  clientPhone: string;
  status: string;
  createdAt: string;
}

const ADMIN_PASS = "seujota2026";

const Admin = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [activeTab, setActiveTab] = useState<"appointments" | "services">("appointments");
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  useEffect(() => {
    if (authenticated) {
      const data = JSON.parse(localStorage.getItem("appointments") || "[]");
      setAppointments(data);
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASS) {
      setAuthenticated(true);
      toast.success("Bem-vindo, administrador!");
    } else {
      toast.error("Senha incorreta");
    }
  };

  const deleteAppointment = (id: string) => {
    const updated = appointments.filter((a) => a.id !== id);
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    toast.success("Agendamento removido");
  };

  const updateServicePrice = (id: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price)) return;
    setServices(services.map((s) => (s.id === id ? { ...s, price } : s)));
    setEditingService(null);
    toast.success("Preço atualizado");
  };

  if (!authenticated) {
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

          {/* Appointments */}
          {activeTab === "appointments" && (
            <div className="space-y-3">
              {appointments.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  Nenhum agendamento encontrado
                </div>
              ) : (
                appointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <span className="font-semibold">{apt.clientName}</span>
                        <span className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{apt.serviceName}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {apt.date} às {apt.time} · {apt.clientPhone}
                      </div>
                    </div>
                    <button
                      onClick={() => deleteAppointment(apt.id)}
                      className="text-destructive hover:bg-destructive/10 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Services */}
          {activeTab === "services" && (
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
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-20 p-1.5 rounded border border-border bg-background text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                        <button
                          onClick={() => updateServicePrice(service.id)}
                          className="text-primary text-sm font-semibold"
                        >
                          Salvar
                        </button>
                      </div>
                    ) : (
                      <>
                        <span className="text-primary font-bold">R$ {service.price}</span>
                        <button
                          onClick={() => {
                            setEditingService(service.id);
                            setEditPrice(service.price.toString());
                          }}
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
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Admin;

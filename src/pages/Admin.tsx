import { useState, useEffect } from "react";
import { LogOut, LayoutDashboard, Calendar, Scissors, Users, UserCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminAppointments from "@/components/admin/AdminAppointments";
import AdminBarberAgenda from "@/components/admin/AdminBarberAgenda";
import AdminServices from "@/components/admin/AdminServices";
import AdminClients from "@/components/admin/AdminClients";
import type { User } from "@supabase/supabase-js";

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

type Tab = "dashboard" | "appointments" | "barber-agenda" | "services" | "clients";

const tabs: { key: Tab; label: string; icon: any }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "appointments", label: "Agendamentos", icon: Calendar },
  { key: "barber-agenda", label: "Agenda por Barbeiro", icon: Users },
  { key: "services", label: "Serviços", icon: Scissors },
  { key: "clients", label: "Clientes", icon: UserCheck },
];

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setAuthLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
    if (user) fetchAppointments();
  }, [user]);

  const deleteAppointment = async (id: string) => {
    const { error } = await supabase.from("appointments").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao cancelar agendamento");
    } else {
      setAppointments((prev) => prev.filter((a) => a.id !== id));
      toast.success("Agendamento cancelado — horário liberado!");
    }
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Erro ao sair");
    } else {
      toast.success("Sessão encerrada");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-28 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="font-display text-2xl md:text-3xl font-bold">
              Painel <span className="text-gold-gradient">Administrativo</span>
            </h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap",
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "dashboard" && <AdminDashboard appointments={appointments} />}
          {activeTab === "appointments" && (
            <AdminAppointments appointments={appointments} loading={loading} onDelete={deleteAppointment} />
          )}
          {activeTab === "barber-agenda" && <AdminBarberAgenda appointments={appointments} />}
          {activeTab === "services" && <AdminServices />}
          {activeTab === "clients" && <AdminClients />}
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Admin;

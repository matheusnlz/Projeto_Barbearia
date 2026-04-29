import { useState } from "react";
import { LayoutDashboard, CalendarDays, Users, Scissors, LogOut, UserCheck } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AdminLogin from "@/features/admin/components/AdminLogin";
import AdminDashboard from "@/features/admin/components/AdminDashboard";
import AdminAppointments from "@/features/admin/components/AdminAppointments";
import AdminBarberAgenda from "@/features/admin/components/AdminBarberAgenda";
import AdminServices from "@/features/admin/components/AdminServices";
import AdminClients from "@/features/admin/components/AdminClients";
import { useAdmin, useAdminAuth } from "@/features/admin/hooks/useAdmin";
import { cn } from "@/lib/utils";

type Tab = "dashboard" | "appointments" | "barber-agenda" | "services" | "clients";

const tabs: { key: Tab; label: string; icon: typeof LayoutDashboard }[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "appointments", label: "Agendamentos", icon: CalendarDays },
  { key: "barber-agenda", label: "Agenda Barbeiros", icon: Users },
  { key: "services", label: "Serviços", icon: Scissors },
  { key: "clients", label: "Clientes", icon: UserCheck },
];

const Admin = () => {
  const { authenticated, login, logout } = useAdminAuth();
  const { appointments, loading, removeAppointment } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");

  if (!authenticated) {
    return <AdminLogin onLogin={login} />;
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
              onClick={logout}
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
            <AdminAppointments appointments={appointments} loading={loading} onDelete={removeAppointment} />
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

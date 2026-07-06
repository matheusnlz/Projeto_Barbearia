import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { adminService } from "../services/adminService";
import type { Appointment } from "@/features/agendamento/types";

export const useAdminAuth = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const verifyRole = async (userId: string | undefined) => {
    if (!userId) return false;
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();
    return !error && !!data;
  };

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setTimeout(async () => {
        const ok = await verifyRole(session?.user?.id);
        setAuthenticated(ok);
        setChecking(false);
      }, 0);
    });

    supabase.auth.getSession().then(async ({ data }) => {
      const ok = await verifyRole(data.session?.user?.id);
      setAuthenticated(ok);
      setChecking(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const login = () => {
    // Session/role state is driven by onAuthStateChange; no-op kept for API compatibility.
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthenticated(false);
    toast.success("Sessão encerrada");
  };

  return { authenticated, checking, login, logout };
};

export const useAdmin = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await adminService.fetchAllAppointments();
      setAppointments(data);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao carregar agendamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const removeAppointment = async (id: string) => {
    const { error } = await adminService.deleteAppointment(id);
    if (error) {
      toast.error("Erro ao cancelar agendamento");
      return;
    }
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    toast.success("Agendamento cancelado — horário liberado!");
  };

  return { appointments, loading, removeAppointment, refetch: fetchAppointments };
};

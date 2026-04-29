import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminService } from "../services/adminService";
import type { Appointment } from "@/features/agendamento/types";

const ADMIN_AUTH_KEY = "admin_auth";

export const useAdminAuth = () => {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(ADMIN_AUTH_KEY) === "true"
  );

  const login = () => {
    sessionStorage.setItem(ADMIN_AUTH_KEY, "true");
    setAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
    setAuthenticated(false);
    toast.success("Sessão encerrada");
  };

  return { authenticated, login, logout };
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

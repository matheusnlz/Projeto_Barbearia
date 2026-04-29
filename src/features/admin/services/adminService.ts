import { supabase } from "@/lib/supabaseClient";
import {
  fetchAllAppointments,
  deleteAppointment,
} from "@/features/agendamento/services/appointmentsService";
import type { Appointment } from "@/features/agendamento/types";

export const adminService = {
  fetchAllAppointments,
  deleteAppointment,

  async fetchAppointmentsForClients(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false })
      .order("appointment_time", { ascending: false });
    if (error) throw error;
    return (data ?? []) as Appointment[];
  },
};

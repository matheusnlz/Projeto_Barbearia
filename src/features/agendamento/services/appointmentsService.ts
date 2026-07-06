import { supabase } from "@/lib/supabaseClient";
import type { Appointment, NewAppointmentInput } from "../types";

export const fetchBookedSlots = async (
  date: string,
  barberName: string
): Promise<string[]> => {
  const { data, error } = await (supabase.rpc as any)("get_booked_slots", {
    _date: date,
    _barber: barberName,
  });

  if (error) {
    console.error("Erro ao buscar horários:", error);
    return [];
  }
  return (data ?? []).map((r: { appointment_time: string }) => r.appointment_time);
};

export const createAppointment = async (input: NewAppointmentInput) => {
  return supabase.from("appointments").insert({
    ...input,
    status: "confirmed",
  });
};

export const fetchAllAppointments = async (): Promise<Appointment[]> => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  if (error) throw error;
  return (data ?? []) as Appointment[];
};

export const deleteAppointment = async (id: string) => {
  return supabase.from("appointments").delete().eq("id", id);
};

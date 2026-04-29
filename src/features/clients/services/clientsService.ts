import { supabase } from "@/lib/supabaseClient";

export interface ClientAppointmentRecord {
  id: string;
  service_name: string;
  barber_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
}

export interface ClientGroup {
  client_name: string;
  client_phone: string;
  client_email: string;
  visits: number;
  appointments: ClientAppointmentRecord[];
}

export const fetchClientsGrouped = async (): Promise<ClientGroup[]> => {
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: false })
    .order("appointment_time", { ascending: false });

  if (error) throw error;

  const groupMap = new Map<string, ClientGroup>();
  for (const apt of data ?? []) {
    const key =
      apt.client_email && apt.client_email !== ""
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
    group.visits += 1;
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

  return Array.from(groupMap.values()).sort((a, b) => b.visits - a.visits);
};

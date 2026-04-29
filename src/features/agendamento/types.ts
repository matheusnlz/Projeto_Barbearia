export type AppointmentStatus = "confirmed" | "cancelled" | "completed";

export interface Appointment {
  id: string;
  service_id: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_phone: string;
  client_email?: string;
  barber_name: string;
  status: string;
  created_at?: string;
}

export interface NewAppointmentInput {
  service_id: string;
  service_name: string;
  appointment_date: string;
  appointment_time: string;
  client_name: string;
  client_phone: string;
  client_email: string;
  barber_name: string;
}

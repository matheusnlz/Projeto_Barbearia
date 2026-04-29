import { addHours, isToday, setHours, setMinutes } from "date-fns";

export const ALL_TIME_SLOTS = [
  "09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30",
  "15:00","15:30","16:00","16:30","17:00","17:30",
  "18:00","18:30","19:00","19:30",
];

/** Retorna true se o slot estiver a menos de 2 horas do horário atual (apenas para hoje). */
export const isSlotTooSoon = (date: Date, slot: string): boolean => {
  if (!isToday(date)) return false;
  const minTime = addHours(new Date(), 2);
  const [h, m] = slot.split(":").map(Number);
  const slotTime = setMinutes(setHours(new Date(), h), m);
  return slotTime <= minTime;
};

/** Domingo (0) e segunda (1) — barbearia fechada. Datas passadas também. */
export const isDateDisabled = (d: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today || d.getDay() === 0 || d.getDay() === 1;
};

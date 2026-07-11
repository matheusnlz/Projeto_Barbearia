import { addMinutes, isToday, setHours, setMinutes, setSeconds, setMilliseconds } from "date-fns";

/**
 * Regras de funcionamento da barbearia (fonte única de verdade):
 * - Domingo (0) e Segunda (1): fechado.
 * - Terça a Sexta (2-5): 09:30 às 19:30, intervalos de 30 min.
 * - Sábado (6): 09:00 às 18:00, intervalos de 30 min.
 * - Antecedência mínima para agendamento no mesmo dia: 30 minutos.
 */

export const MIN_ADVANCE_MINUTES = 30;

const buildSlots = (startH: number, startM: number, endH: number, endM: number): string[] => {
  const slots: string[] = [];
  let h = startH;
  let m = startM;
  while (h < endH || (h === endH && m <= endM)) {
    slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    m += 30;
    if (m >= 60) {
      m -= 60;
      h += 1;
    }
  }
  return slots;
};

const WEEKDAY_SLOTS = buildSlots(9, 30, 19, 30); // Tue-Fri
const SATURDAY_SLOTS = buildSlots(9, 0, 18, 0);  // Sat

/** Retorna os slots de horários disponíveis para o dia da semana da data. */
export const getSlotsForDate = (date: Date): string[] => {
  const day = date.getDay();
  if (day === 0 || day === 1) return []; // Domingo/Segunda fechados
  if (day === 6) return SATURDAY_SLOTS;
  return WEEKDAY_SLOTS;
};

/** Compatibilidade: união de todos os horários possíveis da semana. */
export const ALL_TIME_SLOTS = Array.from(
  new Set([...WEEKDAY_SLOTS, ...SATURDAY_SLOTS])
).sort();

/** Retorna true se o slot estiver a menos de 30 minutos do horário atual (apenas para hoje). */
export const isSlotTooSoon = (date: Date, slot: string): boolean => {
  if (!isToday(date)) return false;
  const minTime = addMinutes(new Date(), MIN_ADVANCE_MINUTES);
  const [h, m] = slot.split(":").map(Number);
  let slotTime = setHours(new Date(), h);
  slotTime = setMinutes(slotTime, m);
  slotTime = setSeconds(slotTime, 0);
  slotTime = setMilliseconds(slotTime, 0);
  return slotTime < minTime;
};

/** Domingo (0) e segunda (1) — barbearia fechada. Datas passadas também. */
export const isDateDisabled = (d: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today || d.getDay() === 0 || d.getDay() === 1;
};

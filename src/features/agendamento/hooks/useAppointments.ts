import { useEffect, useState } from "react";
import { format } from "date-fns";
import { fetchBookedSlots } from "../services/appointmentsService";

/**
 * Carrega os horários já reservados para um barbeiro em uma data.
 * Reage a mudanças de date/barber.
 */
export const useAppointments = (date: Date | undefined, barberName: string) => {
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!date || !barberName) {
      setBookedSlots([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetchBookedSlots(format(date, "yyyy-MM-dd"), barberName).then((slots) => {
      if (!cancelled) {
        setBookedSlots(slots);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [date, barberName]);

  const addBookedSlot = (slot: string) =>
    setBookedSlots((prev) => [...prev, slot]);

  return { bookedSlots, loading, addBookedSlot };
};

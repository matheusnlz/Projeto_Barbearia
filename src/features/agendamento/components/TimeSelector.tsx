import { isToday } from "date-fns";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { getSlotsForDate, isSlotTooSoon, MIN_ADVANCE_MINUTES } from "@/utils/timeSlots";
import { cn } from "@/lib/utils";

interface TimeSelectorProps {
  date: Date;
  barberName: string;
  value: string;
  bookedSlots: string[];
  loading: boolean;
  onChange: (slot: string) => void;
}

const TimeSelector = ({
  date,
  barberName,
  value,
  bookedSlots,
  loading,
  onChange,
}: TimeSelectorProps) => {
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider">
        Horários de {barberName}
      </label>
      {loading ? (
        <div className="flex items-center justify-center py-6 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          Carregando horários...
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {getSlotsForDate(date).map((slot) => {
            const isBooked = bookedSlots.includes(slot);
            const tooSoon = isSlotTooSoon(date, slot);
            const isDisabled = isBooked || tooSoon;
            return (
              <button
                type="button"
                key={slot}
                disabled={isDisabled}
                onClick={() => onChange(slot)}
                className={cn(
                  "py-2 rounded-md border text-sm font-medium transition-all",
                  isDisabled
                    ? "border-border bg-muted text-muted-foreground opacity-50 cursor-not-allowed line-through"
                    : value === slot
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground hover:border-primary/30"
                )}
              >
                {slot}
              </button>
            );
          })}
        </div>
      )}
      {!loading && (
        <p className="text-xs text-muted-foreground mt-2">
          {isToday(date) ? `Para hoje, agendamentos com no mínimo ${MIN_ADVANCE_MINUTES} minutos de antecedência. ` : ""}
          {bookedSlots.length > 0
            ? `Horários riscados já estão reservados para ${barberName}.`
            : ""}
          A barbearia não funciona aos domingos e segundas-feiras.
        </p>
      )}
    </motion.div>
  );
};

export default TimeSelector;

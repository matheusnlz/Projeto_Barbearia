import { barbers } from "@/features/barbers/services/barbersService";
import { cn } from "@/lib/utils";

interface BarberSelectorProps {
  value: string;
  onChange: (name: string) => void;
}

const BarberSelector = ({ value, onChange }: BarberSelectorProps) => {
  return (
    <div>
      <label className="block text-sm font-semibold mb-3 uppercase tracking-wider">Barbeiro</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {barbers.map((barber) => (
          <button
            type="button"
            key={barber.id}
            onClick={() => onChange(barber.name)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
              value === barber.name
                ? "border-primary bg-primary/10 shadow-gold"
                : "border-border bg-card hover:border-primary/30"
            )}
          >
            <div
              className={cn(
                "w-14 h-14 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                value === barber.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {barber.initials}
            </div>
            <span className="font-semibold text-sm">{barber.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default BarberSelector;

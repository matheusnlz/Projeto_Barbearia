
-- Add barber_name column
ALTER TABLE public.appointments ADD COLUMN barber_name text NOT NULL DEFAULT '';

-- Drop old unique constraint if exists and add new one including barber
DO $$
BEGIN
  -- Try dropping any existing unique constraint on date+time
  BEGIN
    ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS appointments_date_time_unique;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
  BEGIN
    ALTER TABLE public.appointments DROP CONSTRAINT IF EXISTS unique_appointment_slot;
  EXCEPTION WHEN OTHERS THEN NULL;
  END;
END $$;

-- Add unique constraint per barber+date+time
ALTER TABLE public.appointments ADD CONSTRAINT unique_barber_appointment_slot UNIQUE (barber_name, appointment_date, appointment_time);

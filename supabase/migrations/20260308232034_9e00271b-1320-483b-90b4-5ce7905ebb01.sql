
-- Create appointments table
CREATE TABLE public.appointments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Prevent double booking: one slot per date+time
  UNIQUE (appointment_date, appointment_time)
);

-- Enable RLS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read appointments (to check availability)
CREATE POLICY "Anyone can view appointments" 
  ON public.appointments FOR SELECT 
  USING (true);

-- Allow anyone to insert appointments (public booking)
CREATE POLICY "Anyone can create appointments" 
  ON public.appointments FOR INSERT 
  WITH CHECK (true);

-- Allow anyone to delete (admin panel)
CREATE POLICY "Anyone can delete appointments" 
  ON public.appointments FOR DELETE 
  USING (true);

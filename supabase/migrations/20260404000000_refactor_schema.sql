-- Create services table
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create barbers table
CREATE TABLE public.barbers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  initials TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;

-- Policies for services
CREATE POLICY "Public can view services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admins can manage services" ON public.services 
  FOR ALL USING (auth.role() = 'authenticated');

-- Policies for barbers
CREATE POLICY "Public can view barbers" ON public.barbers FOR SELECT USING (true);
CREATE POLICY "Admins can manage barbers" ON public.barbers 
  FOR ALL USING (auth.role() = 'authenticated');

-- Update appointments policies to be more secure
DROP POLICY IF EXISTS "Anyone can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can delete appointments" ON public.appointments;

CREATE POLICY "Public can view appointments" ON public.appointments 
  FOR SELECT USING (true); -- Needed for checking availability

CREATE POLICY "Public can create appointments" ON public.appointments 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage appointments" ON public.appointments 
  FOR ALL USING (auth.role() = 'authenticated');

-- Insert initial data
INSERT INTO public.services (name, description, price, duration) VALUES
('Corte', 'Corte moderno personalizado de acordo com seu estilo', 40.00, 30),
('Barba', 'Alinhamento, modelagem e hidratação da barba', 30.00, 20),
('Sobrancelha', 'Design e alinhamento de sobrancelhas', 10.00, 10),
('Luzes', 'Coloração, mechas e luzes no cabelo', 80.00, 90),
('Corte + Barba', 'Combo de corte de cabelo e barba completa', 70.00, 50),
('Corte + Sobrancelha', 'Combo de corte de cabelo e design de sobrancelha', 45.00, 40),
('Corte + Luzes', 'Combo de corte com coloração e mechas', 130.00, 100),
('Corte + Barba + Sobrancelha', 'Pacote completo: corte, barba e sobrancelha', 80.00, 60);

INSERT INTO public.barbers (name, initials) VALUES
('Jullian', 'JU'),
('Nathan', 'NA'),
('Kelvin', 'KE'),
('Matheus', 'MA');

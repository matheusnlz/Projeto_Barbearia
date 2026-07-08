
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration INTEGER NOT NULL DEFAULT 30,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.services TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.services TO authenticated;
GRANT ALL ON public.services TO service_role;

ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view services"
ON public.services FOR SELECT
USING (true);

CREATE POLICY "Admins can insert services"
ON public.services FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update services"
ON public.services FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete services"
ON public.services FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_services_updated_at
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.services (name, description, price, duration) VALUES
  ('Corte', 'Corte moderno personalizado de acordo com seu estilo', 40, 30),
  ('Barba', 'Alinhamento, modelagem e hidratação da barba', 30, 20),
  ('Sobrancelha', 'Design e alinhamento de sobrancelhas', 10, 10),
  ('Luzes', 'Coloração, mechas e luzes no cabelo', 80, 90),
  ('Corte + Barba', 'Combo de corte de cabelo e barba completa', 70, 50),
  ('Corte + Sobrancelha', 'Combo de corte de cabelo e design de sobrancelha', 45, 40),
  ('Corte + Luzes', 'Combo de corte com coloração e mechas', 130, 100),
  ('Corte + Barba + Sobrancelha', 'Pacote completo: corte, barba e sobrancelha', 80, 60);

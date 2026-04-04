import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
}

export const useServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar serviços");
      console.error(error);
    } else {
      setServices(data as Service[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return { services, loading, refetch: fetchServices };
};

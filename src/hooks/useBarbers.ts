import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Barber {
  id: string;
  name: string;
  initials: string;
  active: boolean;
}

export const useBarbers = () => {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBarbers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("barbers")
      .select("*")
      .eq("active", true)
      .order("name", { ascending: true });

    if (error) {
      toast.error("Erro ao carregar barbeiros");
      console.error(error);
    } else {
      setBarbers(data as Barber[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBarbers();
  }, []);

  return { barbers, loading, refetch: fetchBarbers };
};

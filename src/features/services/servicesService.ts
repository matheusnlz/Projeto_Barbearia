import { supabase } from "@/lib/supabaseClient";
import type { Service, ServiceInput, ServiceUpdate } from "./types";

interface ServiceRow {
  id: string;
  name: string;
  description: string;
  price: number | string;
  duration: number;
  active: boolean;
}

const mapRow = (row: ServiceRow): Service => ({
  id: row.id,
  name: row.name,
  description: row.description,
  price: typeof row.price === "string" ? parseFloat(row.price) : row.price,
  duration: row.duration,
  active: row.active,
});

export const fetchServices = async (opts?: { onlyActive?: boolean }): Promise<Service[]> => {
  let query = supabase
    .from("services")
    .select("id, name, description, price, duration, active")
    .order("created_at", { ascending: true });

  if (opts?.onlyActive) query = query.eq("active", true);

  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []).map((r) => mapRow(r as ServiceRow));
};

export const fetchServiceById = async (id: string): Promise<Service | null> => {
  const { data, error } = await supabase
    .from("services")
    .select("id, name, description, price, duration, active")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as ServiceRow) : null;
};

export const createService = async (input: ServiceInput): Promise<Service> => {
  const { data, error } = await supabase
    .from("services")
    .insert({
      name: input.name,
      description: input.description,
      price: input.price,
      duration: input.duration,
      active: input.active ?? true,
    })
    .select("id, name, description, price, duration, active")
    .single();
  if (error) throw error;
  return mapRow(data as ServiceRow);
};

export const updateService = async (id: string, patch: ServiceUpdate): Promise<Service> => {
  const { data, error } = await supabase
    .from("services")
    .update(patch)
    .eq("id", id)
    .select("id, name, description, price, duration, active")
    .single();
  if (error) throw error;
  return mapRow(data as ServiceRow);
};

export const deleteService = async (id: string): Promise<void> => {
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) throw error;
};

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  createService,
  deleteService,
  fetchServices,
  updateService,
} from "../servicesService";
import type { Service, ServiceInput, ServiceUpdate } from "../types";

export const useServices = (opts?: { onlyActive?: boolean }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchServices(opts);
      setServices(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar serviços");
    } finally {
      setLoading(false);
    }
  }, [opts?.onlyActive]);

  useEffect(() => {
    load();
  }, [load]);

  const create = async (input: ServiceInput) => {
    try {
      const created = await createService(input);
      setServices((prev) => [...prev, created]);
      toast.success("Serviço criado com sucesso");
      return created;
    } catch (err) {
      console.error(err);
      toast.error("Erro ao criar serviço");
      throw err;
    }
  };

  const update = async (id: string, patch: ServiceUpdate) => {
    try {
      const updated = await updateService(id, patch);
      setServices((prev) => prev.map((s) => (s.id === id ? updated : s)));
      toast.success("Serviço atualizado");
      return updated;
    } catch (err) {
      console.error(err);
      toast.error("Erro ao atualizar serviço");
      throw err;
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
      toast.success("Serviço removido");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover serviço");
      throw err;
    }
  };

  return { services, loading, error, refetch: load, create, update, remove };
};

import { useState } from "react";
import { Edit2 } from "lucide-react";
import { defaultServices } from "@/features/services/servicesService";
import type { Service } from "@/features/services/types";
import { toast } from "sonner";

const AdminServices = () => {
  const [services, setServices] = useState<Service[]>(defaultServices);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const updateServicePrice = (id: string) => {
    const price = parseFloat(editPrice);
    if (isNaN(price)) return;
    setServices(services.map((s) => (s.id === id ? { ...s, price } : s)));
    setEditingService(null);
    toast.success("Preço atualizado");
  };

  return (
    <div className="space-y-3">
      {services.map((service) => (
        <div key={service.id} className="bg-card border border-border rounded-lg p-4 flex items-center justify-between">
          <div>
            <span className="font-semibold">{service.name}</span>
            <span className="text-muted-foreground text-sm ml-3">{service.duration} min</span>
          </div>
          <div className="flex items-center gap-3">
            {editingService === service.id ? (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  className="w-20 p-1.5 rounded border border-border bg-background text-sm text-foreground focus:border-primary focus:outline-none"
                />
                <button onClick={() => updateServicePrice(service.id)} className="text-primary text-sm font-semibold">
                  Salvar
                </button>
              </div>
            ) : (
              <>
                <span className="text-primary font-bold">R$ {service.price}</span>
                <button
                  onClick={() => { setEditingService(service.id); setEditPrice(service.price.toString()); }}
                  className="text-muted-foreground hover:text-primary p-2 rounded-lg transition-colors"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AdminServices;

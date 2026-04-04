import { useState } from "react";
import { Edit2, Plus, Trash2, Loader2, Check, X } from "lucide-react";
import { useServices, type Service } from "@/hooks/useServices";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AdminServices = () => {
  const { services, loading, refetch } = useServices();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: ""
  });

  const handleEdit = (service: Service) => {
    setEditingId(service.id);
    setFormData({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration.toString()
    });
  };

  const handleSave = async (id?: string) => {
    if (!formData.name || !formData.price || !formData.duration) {
      toast.error("Preencha os campos obrigatórios");
      return;
    }

    setSubmitting(true);
    const payload = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration)
    };

    let error;
    if (id) {
      const { error: err } = await supabase.from("services").update(payload).eq("id", id);
      error = err;
    } else {
      const { error: err } = await supabase.from("services").insert(payload);
      error = err;
    }

    setSubmitting(false);
    if (error) {
      toast.error("Erro ao salvar serviço");
      console.error(error);
    } else {
      toast.success(id ? "Serviço atualizado" : "Serviço adicionado");
      setEditingId(null);
      setIsAdding(false);
      refetch();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este serviço?")) return;

    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir serviço");
    } else {
      toast.success("Serviço excluído");
      refetch();
    }
  };

  if (loading) return <div className="flex justify-center py-10"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-display text-lg font-semibold">Gestão de Serviços</h3>
        <button 
          onClick={() => { setIsAdding(true); setFormData({ name: "", description: "", price: "", duration: "" }); }}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
        >
          <Plus className="h-4 w-4" /> Adicionar Serviço
        </button>
      </div>

      <div className="grid gap-4">
        {isAdding && (
          <div className="bg-card border border-primary/50 rounded-lg p-4 space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                placeholder="Nome do serviço" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="bg-background border border-border p-2 rounded text-sm"
              />
              <input 
                placeholder="Preço (ex: 40)" 
                type="number"
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                className="bg-background border border-border p-2 rounded text-sm"
              />
              <input 
                placeholder="Duração em minutos (ex: 30)" 
                type="number"
                value={formData.duration}
                onChange={e => setFormData({...formData, duration: e.target.value})}
                className="bg-background border border-border p-2 rounded text-sm"
              />
              <input 
                placeholder="Descrição curta" 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="bg-background border border-border p-2 rounded text-sm"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button onClick={() => setIsAdding(false)} className="p-2 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
              <button onClick={() => handleSave()} disabled={submitting} className="bg-primary text-primary-foreground px-4 py-2 rounded text-xs font-bold uppercase">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Salvar"}
              </button>
            </div>
          </div>
        )}

        {services.map((service) => (
          <div key={service.id} className="bg-card border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {editingId === service.id ? (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-2">
                <input value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-background border border-border p-1.5 rounded text-sm" />
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="bg-background border border-border p-1.5 rounded text-sm" />
                <input type="number" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="bg-background border border-border p-1.5 rounded text-sm" />
                <div className="flex gap-2">
                  <button onClick={() => handleSave(service.id)} className="text-primary"><Check className="h-5 w-5" /></button>
                  <button onClick={() => setEditingId(null)} className="text-muted-foreground"><X className="h-5 w-5" /></button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{service.name}</span>
                    <span className="text-primary font-bold">R$ {Number(service.price).toFixed(0)}</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-1">{service.duration} min · {service.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleEdit(service)} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => handleDelete(service.id)} className="p-2 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="h-4 w-4" /></button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminServices;

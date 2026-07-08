import { useState } from "react";
import { Edit2, Plus, Trash2, X, Check, Loader2 } from "lucide-react";
import { useServices } from "@/features/services/hooks/useServices";
import type { Service, ServiceInput } from "@/features/services/types";

interface EditState {
  name: string;
  description: string;
  price: string;
  duration: string;
}

const emptyForm: EditState = { name: "", description: "", price: "", duration: "" };

const toInput = (s: EditState): ServiceInput | null => {
  const price = parseFloat(s.price);
  const duration = parseInt(s.duration, 10);
  if (!s.name.trim() || isNaN(price) || isNaN(duration)) return null;
  return {
    name: s.name.trim(),
    description: s.description.trim(),
    price,
    duration,
  };
};

const AdminServices = () => {
  const { services, loading, create, update, remove } = useServices();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<EditState>(emptyForm);
  const [creating, setCreating] = useState(false);
  const [createForm, setCreateForm] = useState<EditState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const startEdit = (s: Service) => {
    setEditingId(s.id);
    setEditForm({
      name: s.name,
      description: s.description,
      price: s.price.toString(),
      duration: s.duration.toString(),
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const saveEdit = async (id: string) => {
    const payload = toInput(editForm);
    if (!payload) return;
    setSaving(true);
    try {
      await update(id, payload);
      cancelEdit();
    } finally {
      setSaving(false);
    }
  };

  const saveCreate = async () => {
    const payload = toInput(createForm);
    if (!payload) return;
    setSaving(true);
    try {
      await create(payload);
      setCreating(false);
      setCreateForm(emptyForm);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s: Service) => {
    if (!confirm(`Remover o serviço "${s.name}"?`)) return;
    await remove(s.id);
  };

  const inputCls =
    "w-full p-2 rounded border border-border bg-background text-sm text-foreground focus:border-primary focus:outline-none";

  if (loading) {
    return (
      <div className="flex justify-center py-10 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        {!creating && (
          <button
            onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider hover:opacity-90 transition-opacity"
          >
            <Plus className="h-4 w-4" /> Novo Serviço
          </button>
        )}
      </div>

      {creating && (
        <div className="bg-card border border-primary/50 rounded-lg p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nome"
              value={createForm.name}
              onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })}
              className={inputCls}
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Preço"
                value={createForm.price}
                onChange={(e) => setCreateForm({ ...createForm, price: e.target.value })}
                className={inputCls}
              />
              <input
                type="number"
                placeholder="Duração (min)"
                value={createForm.duration}
                onChange={(e) => setCreateForm({ ...createForm, duration: e.target.value })}
                className={inputCls}
              />
            </div>
          </div>
          <textarea
            placeholder="Descrição"
            value={createForm.description}
            onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
            rows={2}
            className={inputCls}
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setCreating(false); setCreateForm(emptyForm); }}
              className="text-muted-foreground text-sm px-3 py-1.5"
            >
              Cancelar
            </button>
            <button
              onClick={saveCreate}
              disabled={saving}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded text-sm font-semibold disabled:opacity-50"
            >
              {saving && <Loader2 className="h-3 w-3 animate-spin" />} Criar
            </button>
          </div>
        </div>
      )}

      {services.length === 0 && !creating && (
        <p className="text-center text-muted-foreground py-8">Nenhum serviço cadastrado.</p>
      )}

      {services.map((service) => {
        const isEditing = editingId === service.id;
        return (
          <div key={service.id} className="bg-card border border-border rounded-lg p-4">
            {isEditing ? (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={inputCls}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className={inputCls}
                    />
                    <input
                      type="number"
                      value={editForm.duration}
                      onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                </div>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  rows={2}
                  className={inputCls}
                />
                <div className="flex gap-2 justify-end">
                  <button onClick={cancelEdit} className="text-muted-foreground hover:text-foreground p-2 rounded">
                    <X className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => saveEdit(service.id)}
                    disabled={saving}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-1.5 rounded text-sm font-semibold disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />} Salvar
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="font-semibold">{service.name}</span>
                    <span className="text-muted-foreground text-sm">{service.duration} min</span>
                  </div>
                  {service.description && (
                    <p className="text-muted-foreground text-xs mt-1 truncate">{service.description}</p>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-primary font-bold">R$ {service.price}</span>
                  <button
                    onClick={() => startEdit(service)}
                    className="text-muted-foreground hover:text-primary p-2 rounded-lg transition-colors"
                    aria-label="Editar serviço"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(service)}
                    className="text-muted-foreground hover:text-destructive p-2 rounded-lg transition-colors"
                    aria-label="Remover serviço"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AdminServices;

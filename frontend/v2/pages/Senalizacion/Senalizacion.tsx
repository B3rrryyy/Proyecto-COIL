import { useEffect, useState } from "react";
import { Plus, Download, Search, TriangleAlert, Eye, Pencil, Trash2, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import SenalizacionForm, { type SenalizacionFormData } from "../../components/forms/SenalizacionForm";
import api from "../../services/api";

interface SenalizacionRecord {
  id: string;
  numero: number;
  parroquia: string;
  canton: string;
  provincia: string;
  fecha: string;
  tramo_vial: string;
  tipo_reglamentaria: boolean;
  tipo_preventiva: boolean;
  tipo_informativa: boolean;
  material_metal: boolean;
  material_pvc: boolean;
  material_aluminio: boolean;
  estado_bueno: boolean;
  estado_malo: boolean;
  estado_regular: boolean;
  utm_este: string;
  utm_norte: string;
  observaciones: string;
}

type EstadoKey = "Bueno" | "Regular" | "Malo";
type TipoKey = "Reglamentaria" | "Preventiva" | "Informativa" | "—";

function getEstado(r: SenalizacionRecord): EstadoKey {
  if (r.estado_bueno) return "Bueno";
  if (r.estado_regular) return "Regular";
  return "Malo";
}

function getTipo(r: SenalizacionRecord): TipoKey {
  if (r.tipo_reglamentaria) return "Reglamentaria";
  if (r.tipo_preventiva) return "Preventiva";
  if (r.tipo_informativa) return "Informativa";
  return "—";
}

function getMaterial(r: SenalizacionRecord): string {
  if (r.material_metal) return "Metal";
  if (r.material_pvc) return "PVC";
  if (r.material_aluminio) return "Aluminio";
  return "—";
}

const ESTADO_STYLES: Record<EstadoKey, string> = {
  Bueno: "bg-emerald-50 text-emerald-600",
  Regular: "bg-amber-50 text-amber-600",
  Malo: "bg-red-50 text-red-500",
};

const TIPO_STYLES: Record<TipoKey, string> = {
  Reglamentaria: "bg-red-50 text-red-500",
  Preventiva: "bg-amber-50 text-amber-600",
  Informativa: "bg-blue-50 text-blue-500",
  "—": "bg-gray-50 text-gray-400",
};

const MOCK: SenalizacionRecord[] = [
  {
    id: "1", numero: 12, parroquia: "Puerto Limón", canton: "Santo Domingo",
    provincia: "Santo Domingo de los Tsáchilas", fecha: "2026-01-18",
    tramo_vial: "Vía Quevedo - Pto. Limón",
    tipo_reglamentaria: false, tipo_preventiva: true, tipo_informativa: false,
    material_metal: true, material_pvc: false, material_aluminio: false,
    estado_bueno: false, estado_regular: true, estado_malo: false,
    utm_este: "", utm_norte: "", observaciones: "Señal preventiva con desgaste visible.",
  },
  {
    id: "2", numero: 13, parroquia: "Puerto Limón", canton: "Santo Domingo",
    provincia: "Santo Domingo de los Tsáchilas", fecha: "2026-01-15",
    tramo_vial: "Vía Quevedo - Pto. Limón",
    tipo_reglamentaria: true, tipo_preventiva: false, tipo_informativa: false,
    material_metal: false, material_pvc: false, material_aluminio: true,
    estado_bueno: true, estado_regular: false, estado_malo: false,
    utm_este: "681490", utm_norte: "9957300", observaciones: "En buen estado, buena visibilidad.",
  },
];

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 bg-white py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
        <TriangleAlert size={22} className="text-amber-400" strokeWidth={1.8} />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-gray-700">Sin fichas registradas</p>
        <p className="mt-1 text-[12px] text-gray-400">Crea la primera ficha técnica de señalización.</p>
      </div>
      <Button variant="primary" size="sm" iconLeft={<Plus size={14} />} onClick={onNew}>
        Nueva ficha
      </Button>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{label}</span>
      <span className="text-[13px] text-gray-800">{value || "—"}</span>
    </div>
  );
}

export default function Senalizacion() {
  const [records, setRecords] = useState<SenalizacionRecord[]>(MOCK);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<SenalizacionRecord | null>(null);
  const [viewing, setViewing] = useState<SenalizacionRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SenalizacionRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/senalizacion/");
        if (Array.isArray(data) && data.length > 0) setRecords(data);
      } catch {
        // use mock
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = records.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.parroquia.toLowerCase().includes(q) ||
      r.tramo_vial.toLowerCase().includes(q) ||
      String(r.numero).includes(q)
    );
  });

  const nextNumero = Math.max(0, ...records.map((r) => r.numero)) + 1;

  const handleSubmit = async (data: SenalizacionFormData) => {
    try {
      if (editing) {
        await api.put(`/senalizacion/${editing.id}`, data);
        setRecords((p) => p.map((r) => r.id === editing.id ? { ...r, ...data } : r));
      } else {
        const res = await api.post("/senalizacion/", data);
        setRecords((p) => [...p, res.data]);
      }
    } catch {
      if (!editing) {
        setRecords((p) => [...p, { ...data, id: crypto.randomUUID(), numero: nextNumero }]);
      }
    } finally {
      setShowForm(false);
      setEditing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await api.delete(`/senalizacion/${deleteTarget.id}`); } catch { /* proceed */ }
    finally {
      setRecords((p) => p.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleExport = () => {
    const header = ["N°", "Parroquia", "Cantón", "Provincia", "Fecha", "Tramo Vial", "Tipo", "Material", "Estado", "UTM Este", "UTM Norte", "Observaciones"];
    const rows = records.map((r) => [
      r.numero, r.parroquia, r.canton, r.provincia, r.fecha, r.tramo_vial,
      getTipo(r), getMaterial(r), getEstado(r), r.utm_este, r.utm_norte, `"${r.observaciones}"`,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `senalizacion_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
            <TriangleAlert size={18} className="text-amber-500" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-gray-900 leading-tight">Señalización</h2>
            <p className="text-[11px] text-gray-400">{records.length} fichas registradas</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Download size={13} />} onClick={handleExport}>
            Exportar CSV
          </Button>
          <Button variant="primary" size="sm" iconLeft={<Plus size={14} />} onClick={() => { setEditing(null); setShowForm(true); }}>
            Nueva ficha
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative w-full max-w-xs">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" strokeWidth={2} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por parroquia, tramo o N°..."
          className="h-9 w-full rounded-md border border-gray-200 bg-white pl-8 pr-3 text-[13px] text-gray-700 placeholder-gray-300 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
            <X size={13} />
          </button>
        )}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-slate-600" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onNew={() => setShowForm(true)} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  {["N°", "Parroquia", "Tramo Vial", "Tipo", "Material", "Estado", "Fecha", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const estado = getEstado(r);
                  const tipo = getTipo(r);
                  return (
                    <tr key={r.id} className={`border-b border-gray-50 transition-colors hover:bg-gray-50/60 ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                      <td className="px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-50 text-[11px] font-bold text-amber-500">
                          {r.numero}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-medium text-gray-800">{r.parroquia}</p>
                        <p className="text-[11px] text-gray-400">{r.canton}</p>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-600">{r.tramo_vial}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TIPO_STYLES[tipo]}`}>
                          {tipo}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-600">{getMaterial(r)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium ${ESTADO_STYLES[estado]}`}>
                          {estado}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-500">
                        {new Date(r.fecha).toLocaleDateString("es-EC", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => setViewing(r)} className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"><Eye size={14} strokeWidth={1.8} /></button>
                          <button onClick={() => { setEditing(r); setShowForm(true); }} className="rounded-md p-1.5 text-gray-400 transition hover:bg-amber-50 hover:text-amber-500"><Pencil size={14} strokeWidth={1.8} /></button>
                          <button onClick={() => setDeleteTarget(r)} className="rounded-md p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"><Trash2 size={14} strokeWidth={1.8} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="border-t border-gray-50 px-4 py-2.5">
            <p className="text-[11px] text-gray-400">{filtered.length} de {records.length} fichas</p>
          </div>
        </div>
      )}

      {/* Form modal */}
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? `Editar Señalización N° ${editing.numero}` : "Nueva Ficha — Señalización"} subtitle="Completa los datos de la ficha técnica" size="lg">
        <SenalizacionForm fichaNumber={editing?.numero ?? nextNumero} initialData={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(null); }} />
      </Modal>

      {/* Detail modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Señalización N° ${viewing?.numero}`} subtitle={viewing?.tramo_vial} size="md">
        {viewing && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow label="Parroquia" value={viewing.parroquia} />
            <DetailRow label="Cantón" value={viewing.canton} />
            <DetailRow label="Provincia" value={viewing.provincia} />
            <DetailRow label="Fecha" value={new Date(viewing.fecha).toLocaleDateString("es-EC")} />
            <div className="col-span-2"><DetailRow label="Tramo Vial" value={viewing.tramo_vial} /></div>
            <DetailRow label="Tipo" value={
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${TIPO_STYLES[getTipo(viewing)]}`}>
                {getTipo(viewing)}
              </span>
            } />
            <DetailRow label="Material" value={getMaterial(viewing)} />
            <DetailRow label="Estado" value={
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${ESTADO_STYLES[getEstado(viewing)]}`}>
                {getEstado(viewing)}
              </span>
            } />
            <DetailRow label="UTM Este" value={viewing.utm_este} />
            <DetailRow label="UTM Norte" value={viewing.utm_norte} />
            <div className="col-span-2"><DetailRow label="Observaciones" value={viewing.observaciones} /></div>
          </div>
        )}
      </Modal>

      {/* Delete modal */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Eliminar ficha" subtitle="Esta acción no se puede deshacer" size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Eliminar</Button>
          </>
        }
      >
        <p className="text-[13px] text-gray-600">
          ¿Estás seguro de eliminar la ficha{" "}
          <span className="font-semibold text-gray-900">Señalización N° {deleteTarget?.numero}</span>?
          Los datos serán eliminados permanentemente.
        </p>
      </Modal>
    </div>
  );
}
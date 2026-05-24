import { useEffect, useState } from "react";
import { Plus, Download, Search, Waves, Eye, Pencil, Trash2, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import AlcantarillaForm, { type AlcantarillaFormData } from "../../components/forms/AlcantarillaForm";
import api from "../../services/api";

interface AlcantarillaRecord {
  id: string;
  numero: number;
  parroquia: string;
  canton: string;
  provincia: string;
  fecha: string;
  tramo_vial: string;
  ala_longitud: number;
  tuberia_longitud: number;
  tuberia_diametro: number;
  ala_estado_bueno: boolean;
  ala_estado_regular: boolean;
  ala_estado_malo: boolean;
  utm_este: string;
  utm_norte: string;
  observaciones: string;
}

type EstadoKey = "Bueno" | "Regular" | "Malo";

function getEstado(r: AlcantarillaRecord): EstadoKey {
  if (r.ala_estado_bueno) return "Bueno";
  if (r.ala_estado_regular) return "Regular";
  return "Malo";
}

const ESTADO_STYLES: Record<EstadoKey, string> = {
  Bueno: "bg-emerald-50 text-emerald-600",
  Regular: "bg-amber-50 text-amber-600",
  Malo: "bg-red-50 text-red-500",
};

const MOCK: AlcantarillaRecord[] = [
  {
    id: "1", numero: 9, parroquia: "Puerto Limón", canton: "Santo Domingo",
    provincia: "Santo Domingo de los Tsáchilas", fecha: "2026-01-19",
    tramo_vial: "Vía Quevedo - Pto. Limón", ala_longitud: 2.20,
    tuberia_longitud: 11, tuberia_diametro: 1.20,
    ala_estado_bueno: false, ala_estado_regular: false, ala_estado_malo: true,
    utm_este: "691393", utm_norte: "9964782",
    observaciones: "Alcantarilla obstruida al 50% por sedimentación y desechos sólidos.",
  },
  {
    id: "2", numero: 10, parroquia: "Cantón Santo Domingo", canton: "Santo Domingo",
    provincia: "Santo Domingo de los Tsáchilas", fecha: "2026-01-16",
    tramo_vial: "Vía Quevedo - Pto. Limón", ala_longitud: 3.10,
    tuberia_longitud: 8, tuberia_diametro: 0.90,
    ala_estado_bueno: true, ala_estado_regular: false, ala_estado_malo: false,
    utm_este: "691500", utm_norte: "9964900",
    observaciones: "En buen estado, accesos despejados.",
  },
];

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 bg-white py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
        <Waves size={22} className="text-emerald-400" strokeWidth={1.8} />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-gray-700">Sin fichas registradas</p>
        <p className="mt-1 text-[12px] text-gray-400">Crea la primera ficha técnica de alcantarilla.</p>
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

export default function Alcantarilla() {
  const [records, setRecords] = useState<AlcantarillaRecord[]>(MOCK);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AlcantarillaRecord | null>(null);
  const [viewing, setViewing] = useState<AlcantarillaRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AlcantarillaRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/alcantarilla/");
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

  const handleSubmit = async (data: AlcantarillaFormData) => {
    try {
      if (editing) {
        await api.put(`/alcantarilla/${editing.id}`, data);
        setRecords((p) => p.map((r) => r.id === editing.id ? { ...r, ...data, ala_longitud: Number(data.ala_longitud), tuberia_longitud: Number(data.tuberia_longitud), tuberia_diametro: Number(data.tuberia_diametro) } : r));
      } else {
        const res = await api.post("/alcantarilla/", data);
        setRecords((p) => [...p, res.data]);
      }
    } catch {
      if (!editing) {
        setRecords((p) => [...p, {
          ...data, id: crypto.randomUUID(), numero: nextNumero,
          ala_longitud: Number(data.ala_longitud),
          tuberia_longitud: Number(data.tuberia_longitud),
          tuberia_diametro: Number(data.tuberia_diametro),
        }]);
      }
    } finally {
      setShowForm(false);
      setEditing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try { await api.delete(`/alcantarilla/${deleteTarget.id}`); } catch { /* proceed */ }
    finally {
      setRecords((p) => p.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleExport = () => {
    const header = ["N°", "Parroquia", "Cantón", "Provincia", "Fecha", "Tramo Vial", "Long. Ala (m)", "Long. Tubería (m)", "Diámetro (m)", "Estado", "UTM Este", "UTM Norte", "Observaciones"];
    const rows = records.map((r) => [
      r.numero, r.parroquia, r.canton, r.provincia, r.fecha, r.tramo_vial,
      r.ala_longitud, r.tuberia_longitud, r.tuberia_diametro, getEstado(r),
      r.utm_este, r.utm_norte, `"${r.observaciones}"`,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `alcantarillas_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50">
            <Waves size={18} className="text-emerald-500" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-gray-900 leading-tight">Alcantarillas</h2>
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
                  {["N°", "Parroquia", "Tramo Vial", "Long. Ala", "Tubería Ø", "Estado", "Fecha", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const estado = getEstado(r);
                  return (
                    <tr key={r.id} className={`border-b border-gray-50 transition-colors hover:bg-gray-50/60 ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                      <td className="px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-50 text-[11px] font-bold text-emerald-500">
                          {r.numero}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-medium text-gray-800">{r.parroquia}</p>
                        <p className="text-[11px] text-gray-400">{r.canton}</p>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-600">{r.tramo_vial}</td>
                      <td className="px-4 py-3 text-[13px] font-medium text-gray-700">{r.ala_longitud} m</td>
                      <td className="px-4 py-3 text-[13px] font-medium text-gray-700">{r.tuberia_diametro} m</td>
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
                          <button onClick={() => { setEditing(r); setShowForm(true); }} className="rounded-md p-1.5 text-gray-400 transition hover:bg-emerald-50 hover:text-emerald-500"><Pencil size={14} strokeWidth={1.8} /></button>
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
      <Modal open={showForm} onClose={() => { setShowForm(false); setEditing(null); }} title={editing ? `Editar Alcantarilla N° ${editing.numero}` : "Nueva Ficha — Alcantarilla"} subtitle="Completa los datos de la ficha técnica" size="lg">
        <AlcantarillaForm fichaNumber={editing?.numero ?? nextNumero} initialData={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => { setShowForm(false); setEditing(null); }} />
      </Modal>

      {/* Detail modal */}
      <Modal open={!!viewing} onClose={() => setViewing(null)} title={`Alcantarilla N° ${viewing?.numero}`} subtitle={viewing?.tramo_vial} size="md">
        {viewing && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow label="Parroquia" value={viewing.parroquia} />
            <DetailRow label="Cantón" value={viewing.canton} />
            <DetailRow label="Provincia" value={viewing.provincia} />
            <DetailRow label="Fecha" value={new Date(viewing.fecha).toLocaleDateString("es-EC")} />
            <div className="col-span-2"><DetailRow label="Tramo Vial" value={viewing.tramo_vial} /></div>
            <DetailRow label="Long. Ala de Muro" value={`${viewing.ala_longitud} m`} />
            <DetailRow label="Long. Tubería" value={`${viewing.tuberia_longitud} m`} />
            <DetailRow label="Diámetro Tubería" value={`${viewing.tuberia_diametro} m`} />
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
          <span className="font-semibold text-gray-900">Alcantarilla N° {deleteTarget?.numero}</span>?
          Los datos serán eliminados permanentemente.
        </p>
      </Modal>
    </div>
  );
}
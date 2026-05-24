import { useEffect, useState } from "react";
import { Plus, Download, Search, ShieldAlert, Eye, Pencil, Trash2, X } from "lucide-react";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import GuardaviaForm, { type GuardaviaFormData } from "../../components/forms/GuardaviaForm";
import api from "../../services/api";

interface GuardaviaRecord {
  id: string;
  numero: number;
  parroquia: string;
  canton: string;
  provincia: string;
  fecha: string;
  tramo_vial: string;
  longitud: number;
  estado_bueno: boolean;
  estado_malo: boolean;
  estado_regular: boolean;
  utm_este: string;
  utm_norte: string;
  observaciones: string;
}

type EstadoKey = "Bueno" | "Regular" | "Malo";

function getEstado(r: GuardaviaRecord): EstadoKey {
  if (r.estado_bueno) return "Bueno";
  if (r.estado_regular) return "Regular";
  return "Malo";
}

const ESTADO_STYLES: Record<EstadoKey, string> = {
  Bueno: "bg-emerald-50 text-emerald-600",
  Regular: "bg-amber-50 text-amber-600",
  Malo: "bg-red-50 text-red-500",
};

// ── Mock data ────────────────────────────────────────────────────────────────
const MOCK: GuardaviaRecord[] = [
  {
    id: "1", numero: 4, parroquia: "Puerto Limón", canton: "Santo Domingo",
    provincia: "Santo Domingo de los Tsáchilas", fecha: "2026-01-19",
    tramo_vial: "Vía Quevedo - Pto. Limón", longitud: 163.76,
    estado_bueno: true, estado_regular: false, estado_malo: false,
    utm_este: "681380", utm_norte: "9957223",
    observaciones: "Guardavía metálica en buen estado estructural.",
  },
  {
    id: "2", numero: 5, parroquia: "Puerto Limón", canton: "Santo Domingo",
    provincia: "Santo Domingo de los Tsáchilas", fecha: "2026-01-17",
    tramo_vial: "Vía Quevedo - Pto. Limón", longitud: 87.40,
    estado_bueno: false, estado_regular: true, estado_malo: false,
    utm_este: "681512", utm_norte: "9957105",
    observaciones: "Requiere mantenimiento de elementos reflectivos.",
  },
];

// ── Sub-components ───────────────────────────────────────────────────────────

function EmptyState({ onNew }: { onNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed border-gray-200 bg-white py-16">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
        <ShieldAlert size={22} className="text-blue-400" strokeWidth={1.8} />
      </div>
      <div className="text-center">
        <p className="text-[14px] font-semibold text-gray-700">Sin fichas registradas</p>
        <p className="mt-1 text-[12px] text-gray-400">Crea la primera ficha técnica de guardavía.</p>
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

// ── Main page ────────────────────────────────────────────────────────────────

export default function Guardavia() {
  const [records, setRecords] = useState<GuardaviaRecord[]>(MOCK);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<GuardaviaRecord | null>(null);
  const [viewing, setViewing] = useState<GuardaviaRecord | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GuardaviaRecord | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/guardavia/");
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

  const handleSubmit = async (data: GuardaviaFormData) => {
    try {
      if (editing) {
        await api.put(`/guardavia/${editing.id}`, data);
        setRecords((p) =>
          p.map((r) => (r.id === editing.id ? { ...r, ...data, longitud: Number(data.longitud) } : r))
        );
      } else {
        const res = await api.post("/guardavia/", data);
        setRecords((p) => [...p, res.data]);
      }
    } catch {
      // optimistic local update already applied above for editing
      if (!editing) {
        const newRecord: GuardaviaRecord = {
          ...data,
          id: crypto.randomUUID(),
          numero: nextNumero,
          longitud: Number(data.longitud),
        };
        setRecords((p) => [...p, newRecord]);
      }
    } finally {
      setShowForm(false);
      setEditing(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/guardavia/${deleteTarget.id}`);
    } catch {
      // proceed locally
    } finally {
      setRecords((p) => p.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  };

  const handleExport = () => {
    const header = ["N°", "Parroquia", "Cantón", "Provincia", "Fecha", "Tramo Vial", "Longitud (m)", "Estado", "UTM Este", "UTM Norte", "Observaciones"];
    const rows = records.map((r) => [
      r.numero, r.parroquia, r.canton, r.provincia, r.fecha,
      r.tramo_vial, r.longitud, getEstado(r), r.utm_este, r.utm_norte,
      `"${r.observaciones}"`,
    ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guardavias_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-5">

      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50">
            <ShieldAlert size={18} className="text-blue-500" strokeWidth={2} />
          </div>
          <div>
            <h2 className="text-[18px] font-bold text-gray-900 leading-tight">Guardavías</h2>
            <p className="text-[11px] text-gray-400">{records.length} fichas registradas</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" iconLeft={<Download size={13} />} onClick={handleExport}>
            Exportar CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Plus size={14} />}
            onClick={() => { setEditing(null); setShowForm(true); }}
          >
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

      {/* Table / Empty */}
      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-200 border-t-slate-600" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState onNew={() => setShowForm(true)} />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-100 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-50 bg-gray-50/60">
                  {["N°", "Parroquia", "Tramo Vial", "Longitud", "Estado", "Fecha", "Acciones"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const estado = getEstado(r);
                  return (
                    <tr key={r.id} className={`border-b border-gray-50 transition-colors hover:bg-gray-50/60 ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                      <td className="px-4 py-3">
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-blue-500">
                          {r.numero}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[13px] font-medium text-gray-800">{r.parroquia}</p>
                        <p className="text-[11px] text-gray-400">{r.canton}</p>
                      </td>
                      <td className="px-4 py-3 text-[12px] text-gray-600">{r.tramo_vial}</td>
                      <td className="px-4 py-3 text-[13px] font-medium text-gray-700">{r.longitud} m</td>
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
                          <button onClick={() => setViewing(r)} className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
                            <Eye size={14} strokeWidth={1.8} />
                          </button>
                          <button onClick={() => { setEditing(r); setShowForm(true); }} className="rounded-md p-1.5 text-gray-400 transition hover:bg-blue-50 hover:text-blue-500">
                            <Pencil size={14} strokeWidth={1.8} />
                          </button>
                          <button onClick={() => setDeleteTarget(r)} className="rounded-md p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500">
                            <Trash2 size={14} strokeWidth={1.8} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="border-t border-gray-50 px-4 py-2.5">
            <p className="text-[11px] text-gray-400">
              {filtered.length} de {records.length} fichas
            </p>
          </div>
        </div>
      )}

      {/* Form modal */}
      <Modal
        open={showForm}
        onClose={() => { setShowForm(false); setEditing(null); }}
        title={editing ? `Editar Guardavía N° ${editing.numero}` : "Nueva Ficha — Guardavía"}
        subtitle="Completa los datos de la ficha técnica"
        size="lg"
      >
        <GuardaviaForm
          fichaNumber={editing?.numero ?? nextNumero}
          initialData={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      </Modal>

      {/* Detail modal */}
      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={`Guardavía N° ${viewing?.numero}`}
        subtitle={viewing?.tramo_vial}
        size="md"
      >
        {viewing && (
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <DetailRow label="Parroquia" value={viewing.parroquia} />
            <DetailRow label="Cantón" value={viewing.canton} />
            <DetailRow label="Provincia" value={viewing.provincia} />
            <DetailRow label="Fecha" value={new Date(viewing.fecha).toLocaleDateString("es-EC")} />
            <div className="col-span-2">
              <DetailRow label="Tramo Vial" value={viewing.tramo_vial} />
            </div>
            <DetailRow label="Longitud" value={`${viewing.longitud} m`} />
            <DetailRow label="Estado" value={
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-medium ${ESTADO_STYLES[getEstado(viewing)]}`}>
                {getEstado(viewing)}
              </span>
            } />
            <DetailRow label="UTM Este" value={viewing.utm_este} />
            <DetailRow label="UTM Norte" value={viewing.utm_norte} />
            <div className="col-span-2">
              <DetailRow label="Observaciones" value={viewing.observaciones} />
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Eliminar ficha"
        subtitle="Esta acción no se puede deshacer"
        size="sm"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setDeleteTarget(null)}>Cancelar</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Eliminar</Button>
          </>
        }
      >
        <p className="text-[13px] text-gray-600">
          ¿Estás seguro de eliminar la ficha{" "}
          <span className="font-semibold text-gray-900">Guardavía N° {deleteTarget?.numero}</span>?
          Los datos serán eliminados permanentemente.
        </p>
      </Modal>
    </div>
  );
}
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Save, X } from "lucide-react";

export interface SenalizacionFormData {
  // Ubicación
  parroquia: string;
  canton: string;
  provincia: string;
  fecha: string;
  tramo_vial: string;
  // Tipo de señal
  tipo_reglamentaria: boolean;
  tipo_preventiva: boolean;
  tipo_informativa: boolean;
  // Material
  material_metal: boolean;
  material_pvc: boolean;
  material_aluminio: boolean;
  // Estado
  estado_bueno: boolean;
  estado_malo: boolean;
  estado_regular: boolean;
  // Coordenadas
  utm_este: string;
  utm_norte: string;
  // Extra
  observaciones: string;
  fotografia?: File | null;
}

const INITIAL: SenalizacionFormData = {
  parroquia: "", canton: "", provincia: "", fecha: "", tramo_vial: "",
  tipo_reglamentaria: false, tipo_preventiva: false, tipo_informativa: false,
  material_metal: false, material_pvc: false, material_aluminio: false,
  estado_bueno: false, estado_malo: false, estado_regular: false,
  utm_este: "", utm_norte: "", observaciones: "", fotografia: null,
};

interface Props {
  initialData?: Partial<SenalizacionFormData>;
  onSubmit: (data: SenalizacionFormData) => Promise<void>;
  onCancel: () => void;
  fichaNumber?: number;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="col-span-full flex items-center gap-2">
      <div className="h-px flex-1 bg-gray-100" />
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
        {children}
      </span>
      <div className="h-px flex-1 bg-gray-100" />
    </div>
  );
}

function CheckRow({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 rounded border-gray-300 accent-amber-400"
      />
      <span className="text-[12px] text-gray-700">{label}</span>
    </label>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">{label}</span>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}

export default function SenalizacionForm({ initialData, onSubmit, onCancel, fichaNumber }: Props) {
  const [form, setForm] = useState<SenalizacionFormData>({ ...INITIAL, ...initialData });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof SenalizacionFormData, string>>>({});

  const set = <K extends keyof SenalizacionFormData>(key: K, value: SenalizacionFormData[K]) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.parroquia) e.parroquia = "Requerido";
    if (!form.canton) e.canton = "Requerido";
    if (!form.provincia) e.provincia = "Requerido";
    if (!form.fecha) e.fecha = "Requerido";
    if (!form.tramo_vial) e.tramo_vial = "Requerido";
    if (!form.utm_este) e.utm_este = "Requerido";
    if (!form.utm_norte) e.utm_norte = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try { await onSubmit(form); } finally { setLoading(false); }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Header */}
      <div className="mb-5 flex items-center justify-between rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-500">
            Ficha Técnica — Señalización
          </p>
          {fichaNumber && (
            <p className="text-[20px] font-bold text-amber-600 leading-tight">N° {fichaNumber}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-200 bg-white">
          <span className="text-[10px] font-bold text-amber-500">SÑ</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* ── Ubicación ── */}
        <SectionTitle>Ubicación</SectionTitle>
        <Input label="Parroquia" value={form.parroquia} onChange={(e) => set("parroquia", e.target.value)} error={errors.parroquia} placeholder="Puerto Limón" required />
        <Input label="Cantón" value={form.canton} onChange={(e) => set("canton", e.target.value)} error={errors.canton} placeholder="Santo Domingo" required />
        <Input label="Provincia" value={form.provincia} onChange={(e) => set("provincia", e.target.value)} error={errors.provincia} placeholder="Santo Domingo de los Tsáchilas" required />
        <Input label="Fecha" type="date" value={form.fecha} onChange={(e) => set("fecha", e.target.value)} error={errors.fecha} required />
        <div className="col-span-full">
          <Input label="Tramo vial" value={form.tramo_vial} onChange={(e) => set("tramo_vial", e.target.value)} error={errors.tramo_vial} placeholder="Vía Quevedo - Pto. Limón" required />
        </div>

        {/* ── Infraestructura Existente ── */}
        <SectionTitle>Infraestructura Existente</SectionTitle>

        {/* Tipo */}
        <div className="col-span-full">
          <FieldBlock label="Tipo de señal">
            <CheckRow label="Reglamentaria" checked={form.tipo_reglamentaria} onChange={(v) => set("tipo_reglamentaria", v)} />
            <CheckRow label="Preventiva" checked={form.tipo_preventiva} onChange={(v) => set("tipo_preventiva", v)} />
            <CheckRow label="Informativa" checked={form.tipo_informativa} onChange={(v) => set("tipo_informativa", v)} />
          </FieldBlock>
        </div>

        {/* Material */}
        <div className="col-span-full">
          <FieldBlock label="Material">
            <CheckRow label="Metal" checked={form.material_metal} onChange={(v) => set("material_metal", v)} />
            <CheckRow label="PVC" checked={form.material_pvc} onChange={(v) => set("material_pvc", v)} />
            <CheckRow label="Aluminio" checked={form.material_aluminio} onChange={(v) => set("material_aluminio", v)} />
          </FieldBlock>
        </div>

        {/* Estado */}
        <div className="col-span-full">
          <FieldBlock label="Estado">
            <CheckRow label="Bueno" checked={form.estado_bueno} onChange={(v) => set("estado_bueno", v)} />
            <CheckRow label="Malo" checked={form.estado_malo} onChange={(v) => set("estado_malo", v)} />
            <CheckRow label="Regular" checked={form.estado_regular} onChange={(v) => set("estado_regular", v)} />
          </FieldBlock>
        </div>

        {/* ── Coordenadas UTM ── */}
        <SectionTitle>Coordenadas UTM</SectionTitle>
        <Input label="Este" value={form.utm_este} onChange={(e) => set("utm_este", e.target.value)} error={errors.utm_este} placeholder="681380" required />
        <Input label="Norte" value={form.utm_norte} onChange={(e) => set("utm_norte", e.target.value)} error={errors.utm_norte} placeholder="9957223" required />

        {/* ── Fotografía y Observaciones ── */}
        <SectionTitle>Fotografía y Observaciones</SectionTitle>

        <div className="col-span-full">
          <label className="text-[12px] font-medium text-gray-600">Fotografía</label>
          <div className="mt-1.5 flex h-24 w-full items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-amber-400 hover:bg-amber-50">
            <input type="file" accept="image/*" className="absolute opacity-0 w-0 h-0" id="foto-senalizacion" onChange={(e) => set("fotografia", e.target.files?.[0] ?? null)} />
            <label htmlFor="foto-senalizacion" className="cursor-pointer text-center">
              {form.fotografia ? (
                <p className="text-[12px] font-medium text-amber-600">{form.fotografia.name}</p>
              ) : (
                <>
                  <p className="text-[12px] text-gray-400">Haz clic para subir una imagen</p>
                  <p className="text-[11px] text-gray-300">PNG, JPG hasta 10MB</p>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="col-span-full">
          <label className="text-[12px] font-medium text-gray-600">Observaciones</label>
          <textarea
            rows={3}
            value={form.observaciones}
            onChange={(e) => set("observaciones", e.target.value)}
            placeholder="Estado actual de la señalización vial..."
            className="mt-1.5 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-900 placeholder-gray-300 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
        <Button variant="outline" size="md" onClick={onCancel} iconLeft={<X size={14} />}>Cancelar</Button>
        <Button type="submit" variant="primary" size="md" loading={loading} iconLeft={<Save size={14} />}>Guardar ficha</Button>
      </div>
    </form>
  );
}
import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Save, X } from "lucide-react";

export interface AlcantarillaFormData {
  // Ubicación
  parroquia: string;
  canton: string;
  provincia: string;
  fecha: string;
  tramo_vial: string;
  // Muros de Ala
  ala_longitud: number | "";
  ala_material_simple: boolean;
  ala_material_armado: boolean;
  ala_material_ciclopeo: boolean;
  ala_material_gavion: boolean;
  ala_estado_bueno: boolean;
  ala_estado_regular: boolean;
  ala_estado_malo: boolean;
  ala_espesor: number | "";
  // Tubería
  tuberia_material_cemento: boolean;
  tuberia_material_pvc: boolean;
  tuberia_material_corrugado: boolean;
  tuberia_longitud: number | "";
  tuberia_diametro: number | "";
  // Muro Cabezal
  cabezal_longitud: number | "";
  cabezal_espesor: number | "";
  cabezal_estado_bueno: boolean;
  cabezal_estado_regular: boolean;
  cabezal_estado_malo: boolean;
  // Pozo de recolección
  pozo_si: boolean;
  pozo_no: boolean;
  pozo_ancho: string;
  pozo_largo: string;
  pozo_estado_bueno: boolean;
  pozo_estado_regular: boolean;
  pozo_estado_malo: boolean;
  // Coordenadas
  utm_este: string;
  utm_norte: string;
  // Extra
  observaciones: string;
  fotografia?: File | null;
}

const INITIAL: AlcantarillaFormData = {
  parroquia: "", canton: "", provincia: "", fecha: "", tramo_vial: "",
  ala_longitud: "", ala_material_simple: false, ala_material_armado: false,
  ala_material_ciclopeo: false, ala_material_gavion: false,
  ala_estado_bueno: false, ala_estado_regular: false, ala_estado_malo: false,
  ala_espesor: "",
  tuberia_material_cemento: false, tuberia_material_pvc: false,
  tuberia_material_corrugado: false, tuberia_longitud: "", tuberia_diametro: "",
  cabezal_longitud: "", cabezal_espesor: "",
  cabezal_estado_bueno: false, cabezal_estado_regular: false, cabezal_estado_malo: false,
  pozo_si: false, pozo_no: false, pozo_ancho: "", pozo_largo: "",
  pozo_estado_bueno: false, pozo_estado_regular: false, pozo_estado_malo: false,
  utm_este: "", utm_norte: "", observaciones: "", fotografia: null,
};

interface Props {
  initialData?: Partial<AlcantarillaFormData>;
  onSubmit: (data: AlcantarillaFormData) => Promise<void>;
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

export default function AlcantarillaForm({ initialData, onSubmit, onCancel, fichaNumber }: Props) {
  const [form, setForm] = useState<AlcantarillaFormData>({ ...INITIAL, ...initialData });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof AlcantarillaFormData, string>>>({});

  const set = <K extends keyof AlcantarillaFormData>(key: K, value: AlcantarillaFormData[K]) => {
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
      <div className="mb-5 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400">
            Ficha Técnica — Alcantarilla
          </p>
          {fichaNumber && (
            <p className="text-[20px] font-bold text-emerald-600 leading-tight">N° {fichaNumber}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-200 bg-white">
          <span className="text-[10px] font-bold text-emerald-400">AL</span>
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

        {/* ── Muros de Ala ── */}
        <SectionTitle>Muros de Ala</SectionTitle>

        <Input label="Longitud (m)" type="number" value={form.ala_longitud} onChange={(e) => set("ala_longitud", e.target.value === "" ? "" : Number(e.target.value))} placeholder="2.20" />
        <Input label="Espesor (m)" type="number" value={form.ala_espesor} onChange={(e) => set("ala_espesor", e.target.value === "" ? "" : Number(e.target.value))} placeholder="0.25" />

        <div className="col-span-full">
          <FieldBlock label="Material">
            <CheckRow label="H. Simple" checked={form.ala_material_simple} onChange={(v) => set("ala_material_simple", v)} />
            <CheckRow label="H. Armado" checked={form.ala_material_armado} onChange={(v) => set("ala_material_armado", v)} />
            <CheckRow label="H. Ciclopeo" checked={form.ala_material_ciclopeo} onChange={(v) => set("ala_material_ciclopeo", v)} />
            <CheckRow label="Muro gavión" checked={form.ala_material_gavion} onChange={(v) => set("ala_material_gavion", v)} />
          </FieldBlock>
        </div>

        <div className="col-span-full">
          <FieldBlock label="Estado">
            <CheckRow label="Bueno" checked={form.ala_estado_bueno} onChange={(v) => set("ala_estado_bueno", v)} />
            <CheckRow label="Regular" checked={form.ala_estado_regular} onChange={(v) => set("ala_estado_regular", v)} />
            <CheckRow label="Malo" checked={form.ala_estado_malo} onChange={(v) => set("ala_estado_malo", v)} />
          </FieldBlock>
        </div>

        {/* ── Tubería ── */}
        <SectionTitle>Tubería</SectionTitle>

        <Input label="Longitud (m)" type="number" value={form.tuberia_longitud} onChange={(e) => set("tuberia_longitud", e.target.value === "" ? "" : Number(e.target.value))} placeholder="11" />
        <Input label="Diámetro (m)" type="number" value={form.tuberia_diametro} onChange={(e) => set("tuberia_diametro", e.target.value === "" ? "" : Number(e.target.value))} placeholder="1.20" />

        <div className="col-span-full">
          <FieldBlock label="Material">
            <CheckRow label="Cemento" checked={form.tuberia_material_cemento} onChange={(v) => set("tuberia_material_cemento", v)} />
            <CheckRow label="PVC" checked={form.tuberia_material_pvc} onChange={(v) => set("tuberia_material_pvc", v)} />
            <CheckRow label="M. Corrugado" checked={form.tuberia_material_corrugado} onChange={(v) => set("tuberia_material_corrugado", v)} />
          </FieldBlock>
        </div>

        {/* ── Muro Cabezal ── */}
        <SectionTitle>Muro Cabezal</SectionTitle>

        <Input label="Longitud (m)" type="number" value={form.cabezal_longitud} onChange={(e) => set("cabezal_longitud", e.target.value === "" ? "" : Number(e.target.value))} placeholder="2" />
        <Input label="Espesor (m)" type="number" value={form.cabezal_espesor} onChange={(e) => set("cabezal_espesor", e.target.value === "" ? "" : Number(e.target.value))} placeholder="0.25" />

        <div className="col-span-full">
          <FieldBlock label="Estado">
            <CheckRow label="Bueno" checked={form.cabezal_estado_bueno} onChange={(v) => set("cabezal_estado_bueno", v)} />
            <CheckRow label="Regular" checked={form.cabezal_estado_regular} onChange={(v) => set("cabezal_estado_regular", v)} />
            <CheckRow label="Malo" checked={form.cabezal_estado_malo} onChange={(v) => set("cabezal_estado_malo", v)} />
          </FieldBlock>
        </div>

        {/* ── Pozo de recolección ── */}
        <SectionTitle>Pozo de Recolección</SectionTitle>

        <div className="col-span-full">
          <FieldBlock label="Existe pozo">
            <CheckRow label="Sí" checked={form.pozo_si} onChange={(v) => set("pozo_si", v)} />
            <CheckRow label="No" checked={form.pozo_no} onChange={(v) => set("pozo_no", v)} />
          </FieldBlock>
        </div>

        <Input label="Ancho" value={form.pozo_ancho} onChange={(e) => set("pozo_ancho", e.target.value)} placeholder="NA" />
        <Input label="Largo" value={form.pozo_largo} onChange={(e) => set("pozo_largo", e.target.value)} placeholder="NA" />

        <div className="col-span-full">
          <FieldBlock label="Estado del pozo">
            <CheckRow label="Bueno" checked={form.pozo_estado_bueno} onChange={(v) => set("pozo_estado_bueno", v)} />
            <CheckRow label="Regular" checked={form.pozo_estado_regular} onChange={(v) => set("pozo_estado_regular", v)} />
            <CheckRow label="Malo" checked={form.pozo_estado_malo} onChange={(v) => set("pozo_estado_malo", v)} />
          </FieldBlock>
        </div>

        {/* ── Coordenadas UTM ── */}
        <SectionTitle>Coordenadas UTM</SectionTitle>
        <Input label="Este" value={form.utm_este} onChange={(e) => set("utm_este", e.target.value)} error={errors.utm_este} placeholder="691393" required />
        <Input label="Norte" value={form.utm_norte} onChange={(e) => set("utm_norte", e.target.value)} error={errors.utm_norte} placeholder="9964782" required />

        {/* ── Fotografía y Observaciones ── */}
        <SectionTitle>Fotografía y Observaciones</SectionTitle>

        <div className="col-span-full">
          <label className="text-[12px] font-medium text-gray-600">Fotografía</label>
          <div className="mt-1.5 flex h-24 w-full items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-amber-400 hover:bg-amber-50">
            <input type="file" accept="image/*" className="absolute opacity-0 w-0 h-0" id="foto-alcantarilla" onChange={(e) => set("fotografia", e.target.files?.[0] ?? null)} />
            <label htmlFor="foto-alcantarilla" className="cursor-pointer text-center">
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
            placeholder="Alcantarilla obstruida al 50% por sedimentación..."
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
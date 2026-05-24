import { useState } from "react";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { Save, X } from "lucide-react";

export interface GuardaviaFormData {
  // Ubicación
  parroquia: string;
  canton: string;
  provincia: string;
  fecha: string;
  tramo_vial: string;
  // Infraestructura
  longitud: number | "";
  material_metalica: boolean;
  material_concreto: boolean;
  material_otro: boolean;
  elementos_reflectivos_si: boolean;
  elementos_reflectivos_no: boolean;
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

const INITIAL: GuardaviaFormData = {
  parroquia: "",
  canton: "",
  provincia: "",
  fecha: "",
  tramo_vial: "",
  longitud: "",
  material_metalica: false,
  material_concreto: false,
  material_otro: false,
  elementos_reflectivos_si: false,
  elementos_reflectivos_no: false,
  estado_bueno: false,
  estado_malo: false,
  estado_regular: false,
  utm_este: "",
  utm_norte: "",
  observaciones: "",
  fotografia: null,
};

interface Props {
  initialData?: Partial<GuardaviaFormData>;
  onSubmit: (data: GuardaviaFormData) => Promise<void>;
  onCancel: () => void;
  fichaNumber?: number;
}

// ── Reusable sub-components ──────────────────────────────────────────────────

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

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
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
      <span className="text-[11px] font-medium uppercase tracking-wider text-gray-400">
        {label}
      </span>
      <div className="flex flex-wrap gap-4">{children}</div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────

export default function GuardaviaForm({
  initialData,
  onSubmit,
  onCancel,
  fichaNumber,
}: Props) {
  const [form, setForm] = useState<GuardaviaFormData>({
    ...INITIAL,
    ...initialData,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof GuardaviaFormData, string>>>({});

  const set = <K extends keyof GuardaviaFormData>(key: K, value: GuardaviaFormData[K]) => {
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
    if (form.longitud === "" || Number(form.longitud) <= 0) e.longitud = "Ingresa una longitud válida";
    if (!form.utm_este) e.utm_este = "Requerido";
    if (!form.utm_norte) e.utm_norte = "Requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Ficha header */}
      <div className="mb-5 flex items-center justify-between rounded-lg border border-blue-100 bg-blue-50 px-4 py-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400">
            Ficha Técnica — Guardavía
          </p>
          {fichaNumber && (
            <p className="text-[20px] font-bold text-blue-600 leading-tight">
              N° {fichaNumber}
            </p>
          )}
        </div>
        <div className="h-10 w-10 rounded-full border-2 border-blue-200 bg-white flex items-center justify-center">
          <span className="text-[10px] font-bold text-blue-400">GV</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

        {/* ── Ubicación ── */}
        <SectionTitle>Ubicación</SectionTitle>

        <Input
          label="Parroquia"
          value={form.parroquia}
          onChange={(e) => set("parroquia", e.target.value)}
          error={errors.parroquia}
          placeholder="Puerto Limón"
          required
        />
        <Input
          label="Cantón"
          value={form.canton}
          onChange={(e) => set("canton", e.target.value)}
          error={errors.canton}
          placeholder="Santo Domingo"
          required
        />
        <Input
          label="Provincia"
          value={form.provincia}
          onChange={(e) => set("provincia", e.target.value)}
          error={errors.provincia}
          placeholder="Santo Domingo de los Tsáchilas"
          required
        />
        <Input
          label="Fecha"
          type="date"
          value={form.fecha}
          onChange={(e) => set("fecha", e.target.value)}
          error={errors.fecha}
          required
        />
        <div className="col-span-full">
          <Input
            label="Tramo vial"
            value={form.tramo_vial}
            onChange={(e) => set("tramo_vial", e.target.value)}
            error={errors.tramo_vial}
            placeholder="Vía Quevedo - Pto. Limón"
            required
          />
        </div>

        {/* ── Infraestructura existente ── */}
        <SectionTitle>Infraestructura Existente</SectionTitle>

        <div className="col-span-full grid grid-cols-2 gap-4">
          <Input
            label="Longitud (m)"
            type="number"
            value={form.longitud}
            onChange={(e) =>
              set("longitud", e.target.value === "" ? "" : Number(e.target.value))
            }
            error={errors.longitud}
            placeholder="163.76"
            required
          />
          <div className="col-span-1" />
        </div>

        {/* Material */}
        <div className="col-span-full">
          <FieldBlock label="Material">
            <CheckRow
              label="Metálica"
              checked={form.material_metalica}
              onChange={(v) => set("material_metalica", v)}
            />
            <CheckRow
              label="Concreto"
              checked={form.material_concreto}
              onChange={(v) => set("material_concreto", v)}
            />
            <CheckRow
              label="Otro"
              checked={form.material_otro}
              onChange={(v) => set("material_otro", v)}
            />
          </FieldBlock>
        </div>

        {/* Elementos reflectivos */}
        <div className="col-span-full">
          <FieldBlock label="Elementos reflectivos">
            <CheckRow
              label="Sí"
              checked={form.elementos_reflectivos_si}
              onChange={(v) => set("elementos_reflectivos_si", v)}
            />
            <CheckRow
              label="No"
              checked={form.elementos_reflectivos_no}
              onChange={(v) => set("elementos_reflectivos_no", v)}
            />
          </FieldBlock>
        </div>

        {/* Estado */}
        <div className="col-span-full">
          <FieldBlock label="Estado">
            <CheckRow
              label="Bueno"
              checked={form.estado_bueno}
              onChange={(v) => set("estado_bueno", v)}
            />
            <CheckRow
              label="Malo"
              checked={form.estado_malo}
              onChange={(v) => set("estado_malo", v)}
            />
            <CheckRow
              label="Regular"
              checked={form.estado_regular}
              onChange={(v) => set("estado_regular", v)}
            />
          </FieldBlock>
        </div>

        {/* ── Coordenadas UTM ── */}
        <SectionTitle>Coordenadas UTM</SectionTitle>

        <Input
          label="Este"
          value={form.utm_este}
          onChange={(e) => set("utm_este", e.target.value)}
          error={errors.utm_este}
          placeholder="681380"
          required
        />
        <Input
          label="Norte"
          value={form.utm_norte}
          onChange={(e) => set("utm_norte", e.target.value)}
          error={errors.utm_norte}
          placeholder="9957223"
          required
        />

        {/* ── Fotografía y Observaciones ── */}
        <SectionTitle>Fotografía y Observaciones</SectionTitle>

        <div className="col-span-full">
          <label className="text-[12px] font-medium text-gray-600">
            Fotografía
          </label>
          <div className="mt-1.5 flex h-24 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-200 bg-gray-50 transition hover:border-amber-400 hover:bg-amber-50">
            <input
              type="file"
              accept="image/*"
              className="absolute opacity-0 w-0 h-0"
              id="foto-guardavia"
              onChange={(e) => set("fotografia", e.target.files?.[0] ?? null)}
            />
            <label htmlFor="foto-guardavia" className="cursor-pointer text-center">
              {form.fotografia ? (
                <p className="text-[12px] font-medium text-amber-600">
                  {form.fotografia.name}
                </p>
              ) : (
                <>
                  <p className="text-[12px] text-gray-400">
                    Haz clic para subir una imagen
                  </p>
                  <p className="text-[11px] text-gray-300">PNG, JPG hasta 10MB</p>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="col-span-full">
          <label className="text-[12px] font-medium text-gray-600">
            Observaciones
          </label>
          <textarea
            rows={3}
            value={form.observaciones}
            onChange={(e) => set("observaciones", e.target.value)}
            placeholder="Descripción del estado actual de la guardavía..."
            className="mt-1.5 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-[13px] text-gray-900 placeholder-gray-300 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 resize-none"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 pt-4">
        <Button variant="outline" size="md" onClick={onCancel} iconLeft={<X size={14} />}>
          Cancelar
        </Button>
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={loading}
          iconLeft={<Save size={14} />}
        >
          Guardar ficha
        </Button>
      </div>
    </form>
  );
}
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Route, Eye, EyeOff, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import api from "../../services/api";

interface RegisterFormData {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const INITIAL: RegisterFormData = {
  nombre: "",
  apellido: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: "Mínimo 8 caracteres", ok: password.length >= 8 },
    { label: "Una letra mayúscula", ok: /[A-Z]/.test(password) },
    { label: "Un número", ok: /[0-9]/.test(password) },
  ];

  if (!password) return null;

  return (
    <div className="flex flex-col gap-1 mt-1.5">
      {checks.map(({ label, ok }) => (
        <div key={label} className="flex items-center gap-1.5">
          <CheckCircle2
            size={11}
            strokeWidth={2.5}
            className={ok ? "text-emerald-500" : "text-gray-300"}
          />
          <span className={`text-[11px] ${ok ? "text-emerald-600" : "text-gray-400"}`}>
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState<RegisterFormData>(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const set = (key: keyof RegisterFormData, value: string) => {
    setError(null);
    setForm((p) => ({ ...p, [key]: value }));
  };

  const validate = (): string | null => {
    if (!form.nombre.trim()) return "El nombre es requerido.";
    if (!form.apellido.trim()) return "El apellido es requerido.";
    if (!form.email.trim()) return "El correo es requerido.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return "Correo electrónico inválido.";
    if (form.password.length < 8) return "La contraseña debe tener al menos 8 caracteres.";
    if (!/[A-Z]/.test(form.password)) return "La contraseña debe tener al menos una mayúscula.";
    if (!/[0-9]/.test(form.password)) return "La contraseña debe tener al menos un número.";
    if (form.password !== form.confirmPassword) return "Las contraseñas no coinciden.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    setError(null);

    try {
      await api.post("/auth/register", {
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      const msg = err?.response?.data?.detail;
      if (typeof msg === "string") {
        setError(msg);
      } else {
        setError("No se pudo crear la cuenta. Intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ───────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#F4F5F7]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={28} className="text-emerald-500" strokeWidth={2} />
          </div>
          <div>
            <p className="text-[18px] font-bold text-gray-900">Cuenta creada</p>
            <p className="mt-1 text-[13px] text-gray-400">
              Redirigiendo al inicio de sesión...
            </p>
          </div>
          <div className="h-1 w-32 overflow-hidden rounded-full bg-gray-100">
            <div className="h-1 w-full animate-[shrink_2.5s_linear_forwards] rounded-full bg-emerald-400" />
          </div>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F5F7] font-sans">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[#0F1623] p-12">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400">
            <Route size={18} className="text-[#0F1623]" strokeWidth={2.5} />
          </div>
          <div>
            <p className="text-[14px] font-semibold text-white tracking-wide">VialTech</p>
            <p className="text-[10px] text-white/30 tracking-widest uppercase">Infraestructura Vial</p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <div className="h-px w-10 bg-amber-400" />
            <h2 className="text-[36px] font-bold leading-tight text-white tracking-tight">
              Crea tu cuenta<br />de acceso<br />al sistema
            </h2>
          </div>
          <p className="max-w-sm text-[14px] leading-relaxed text-white/40">
            Completa el formulario para registrarte. Solo personal autorizado puede crear cuentas en el sistema.
          </p>

          <div className="mt-4 flex flex-col gap-3">
            {[
              { step: "01", text: "Completa tus datos personales" },
              { step: "02", text: "Crea una contraseña segura" },
              { step: "03", text: "Accede al sistema de gestión" },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-center gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/15 text-[11px] font-bold text-amber-400">
                  {step}
                </span>
                <span className="text-[13px] text-white/50">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-white/20">
          © {new Date().getFullYear()} VialTech · Sistema de Gestión Vial
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 items-center justify-center overflow-y-auto px-6 py-8">
        <div className="w-full max-w-[420px]">

          {/* Mobile logo */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F1623]">
              <Route size={15} className="text-amber-400" strokeWidth={2.5} />
            </div>
            <span className="text-[14px] font-semibold text-gray-900">VialTech</span>
          </div>

          <div className="mb-7">
            <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
              Crear cuenta
            </h1>
            <p className="mt-1 text-[13px] text-gray-400">
              Ingresa tus datos para registrarte en el sistema.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>

            {/* Nombre + Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-600" htmlFor="nombre">
                  Nombre <span className="text-red-400">*</span>
                </label>
                <input
                  id="nombre"
                  type="text"
                  autoComplete="given-name"
                  value={form.nombre}
                  onChange={(e) => set("nombre", e.target.value)}
                  placeholder="Juan"
                  disabled={loading}
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-[13px] text-gray-900 placeholder-gray-300 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-600" htmlFor="apellido">
                  Apellido <span className="text-red-400">*</span>
                </label>
                <input
                  id="apellido"
                  type="text"
                  autoComplete="family-name"
                  value={form.apellido}
                  onChange={(e) => set("apellido", e.target.value)}
                  placeholder="Pérez"
                  disabled={loading}
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-[13px] text-gray-900 placeholder-gray-300 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50"
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-600" htmlFor="email">
                Correo electrónico <span className="text-red-400">*</span>
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="usuario@ejemplo.com"
                disabled={loading}
                className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-[13px] text-gray-900 placeholder-gray-300 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-600" htmlFor="password">
                Contraseña <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => set("password", e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 pr-10 text-[13px] text-gray-900 placeholder-gray-300 outline-none transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                >
                  {showPassword ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-medium text-gray-600" htmlFor="confirmPassword">
                Confirmar contraseña <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) => set("confirmPassword", e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  className={[
                    "h-10 w-full rounded-md border bg-white px-3 pr-10 text-[13px] placeholder-gray-300 outline-none transition focus:ring-2 disabled:opacity-50",
                    form.confirmPassword && form.password !== form.confirmPassword
                      ? "border-red-300 text-red-700 focus:border-red-400 focus:ring-red-400/20"
                      : "border-gray-200 text-gray-900 focus:border-amber-400 focus:ring-amber-400/20",
                  ].join(" ")}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                >
                  {showConfirm ? <EyeOff size={15} strokeWidth={1.8} /> : <Eye size={15} strokeWidth={1.8} />}
                </button>
              </div>
              {form.confirmPassword && form.password !== form.confirmPassword && (
                <p className="text-[11px] text-red-500">Las contraseñas no coinciden.</p>
              )}
              {form.confirmPassword && form.password === form.confirmPassword && form.password && (
                <p className="text-[11px] text-emerald-500 flex items-center gap-1">
                  <CheckCircle2 size={11} strokeWidth={2.5} /> Las contraseñas coinciden.
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-3 py-2.5">
                <AlertCircle size={14} className="mt-0.5 shrink-0 text-red-400" strokeWidth={2} />
                <p className="text-[12px] text-red-600 leading-snug">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="mt-1 flex h-10 w-full items-center justify-center gap-2 rounded-md bg-[#0F1623] text-[13px] font-semibold text-white transition hover:bg-[#1A2235] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Creando cuenta...
                </>
              ) : (
                "Crear cuenta"
              )}
            </button>

            {/* Link to login */}
            <p className="text-center text-[12px] text-gray-400">
              ¿Ya tienes cuenta?{" "}
              <Link
                to="/login"
                className="font-medium text-gray-700 underline-offset-2 hover:underline"
              >
                Inicia sesión
              </Link>
            </p>
          </form>

          <p className="mt-6 text-center text-[11px] text-gray-300">
            Sistema restringido · Solo personal autorizado
          </p>
        </div>
      </div>
    </div>
  );
}
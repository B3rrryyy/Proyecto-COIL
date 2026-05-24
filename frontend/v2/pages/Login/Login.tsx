import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Route, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import AuthService, { type LoginPayload } from "../../services/auth.service";
import { useAuthStore } from "../../store/auth.store";

export default function Login() {
    const navigate = useNavigate();
    const setToken = useAuthStore((s) => s.setToken);
    const setUser = useAuthStore((s) => s.setUser);

    const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError(null);
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.email || !form.password) {
        setError("Completa todos los campos.");
        return;
        }
        setLoading(true);
        setError(null);
        try {
        const { access_token } = await AuthService.login(form);
        setToken(access_token);
        const user = await AuthService.getMe();
        setUser(user);
        navigate("/dashboard");
        } catch {
        setError("Credenciales incorrectas. Verifica tu email y contraseña.");
        } finally {
        setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-[#F4F5F7] font-sans">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[#0F1623] p-12">
            {/* Logo */}
            <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-400">
                <Route size={18} className="text-[#0F1623]" strokeWidth={2.5} />
            </div>
            <div>
                <p className="text-[14px] font-semibold text-white tracking-wide">VialTech</p>
                <p className="text-[10px] text-white/30 tracking-widest uppercase">Infraestructura Vial</p>
            </div>
            </div>

            {/* Hero text */}
            <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
                <div className="h-px w-10 bg-amber-400" />
                <h2 className="text-[36px] font-bold leading-tight text-white tracking-tight">
                Gestión profesional<br />de infraestructura<br />vial
                </h2>
            </div>
            <p className="max-w-sm text-[14px] leading-relaxed text-white/40">
                Registro, seguimiento y exportación de fichas técnicas para guardavías, alcantarillas y señalización vial.
            </p>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                { label: "Fichas activas", value: "3 tipos" },
                { label: "Exportación", value: "CSV" },
                { label: "Acceso seguro", value: "JWT" },
                ].map(({ label, value }) => (
                <div key={label} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                    <p className="text-[18px] font-bold text-amber-400">{value}</p>
                    <p className="text-[11px] text-white/30 mt-0.5">{label}</p>
                </div>
                ))}
            </div>
            </div>

            {/* Footer */}
            <p className="text-[11px] text-white/20">
            © {new Date().getFullYear()} VialTech · Sistema de Gestión Vial
            </p>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-1 items-center justify-center px-6">
            <div className="w-full max-w-[400px]">
            {/* Mobile logo */}
            <div className="mb-8 flex items-center gap-3 lg:hidden">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#0F1623]">
                <Route size={15} className="text-amber-400" strokeWidth={2.5} />
                </div>
                <span className="text-[14px] font-semibold text-gray-900">VialTech</span>
            </div>

            <div className="mb-8">
                <h1 className="text-[24px] font-bold text-gray-900 tracking-tight">
                Iniciar sesión
                </h1>
                <p className="mt-1 text-[13px] text-gray-400">
                Ingresa tus credenciales para acceder al sistema.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
                {/* Email */}
                <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-600" htmlFor="email">
                    Correo electrónico
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="usuario@ejemplo.com"
                    className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 text-[13px] text-gray-900 placeholder-gray-300 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50"
                    disabled={loading}
                />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-medium text-gray-600" htmlFor="password">
                    Contraseña
                </label>
                <div className="relative">
                    <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="h-10 w-full rounded-md border border-gray-200 bg-white px-3 pr-10 text-[13px] text-gray-900 placeholder-gray-300 outline-none ring-0 transition focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 disabled:opacity-50"
                    disabled={loading}
                    />
                    <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition"
                    >
                    {showPassword
                        ? <EyeOff size={15} strokeWidth={1.8} />
                        : <Eye size={15} strokeWidth={1.8} />}
                    </button>
                </div>
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
                    Verificando...
                    </>
                ) : (
                    "Ingresar al sistema"
                )}
                </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-gray-300">
                Sistema restringido · Solo personal autorizado
            </p>
            </div>
        </div>
        </div>
    );
    }
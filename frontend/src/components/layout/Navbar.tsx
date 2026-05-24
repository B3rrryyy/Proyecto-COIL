import { useLocation } from "react-router-dom";
import { Bell, Search } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

const ROUTE_LABELS: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Resumen general del sistema" },
  "/guardavia": { title: "Guardavía", subtitle: "Fichas técnicas de guardavías" },
  "/alcantarilla": { title: "Alcantarilla", subtitle: "Fichas técnicas de alcantarillas" },
  "/senalizacion": { title: "Señalización", subtitle: "Fichas técnicas de señalización" },
  "/historial": { title: "Historial", subtitle: "Registro completo de fichas" },
};

export default function Navbar() {
  const { pathname } = useLocation();
  const user = useAuthStore((s) => s.user);
  const meta = ROUTE_LABELS[pathname] ?? { title: "VialTech", subtitle: "" };

  const initials = user
    ? `${user.nombre?.[0] ?? ""}${user.apellido?.[0] ?? ""}`.toUpperCase()
    : "U";

  return (
    <header className="flex h-[60px] shrink-0 items-center justify-between border-b border-gray-200 bg-white px-8">
      {/* Page title */}
      <div className="flex flex-col justify-center">
        <h1 className="text-[15px] font-semibold text-gray-900 leading-tight">
          {meta.title}
        </h1>
        {meta.subtitle && (
          <p className="text-[11px] text-gray-400">{meta.subtitle}</p>
        )}
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
          <Search size={16} strokeWidth={1.8} />
        </button>

        {/* Notifications */}
        <button className="relative flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600">
          <Bell size={16} strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-amber-400" />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-gray-200" />

        {/* User avatar */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0F1623] text-[11px] font-semibold text-amber-400">
            {initials}
          </div>
          {user && (
            <div className="hidden flex-col sm:flex">
              <span className="text-[12px] font-medium text-gray-800 leading-tight">
                {user.nombre} {user.apellido}
              </span>
              <span className="text-[10px] text-gray-400 leading-tight">
                {user.email}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShieldAlert,
  Waves,
  TriangleAlert,
  ClipboardList,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Route,
} from "lucide-react";
import { useAuthStore } from "../../store/auth.store";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/guardavia", icon: ShieldAlert, label: "Guardavía" },
  { to: "/alcantarilla", icon: Waves, label: "Alcantarilla" },
  { to: "/senalizacion", icon: TriangleAlert, label: "Señalización" },
  { to: "/historial", icon: ClipboardList, label: "Historial" },
];

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`relative flex h-full flex-col bg-[#0F1623] text-white transition-all duration-300 ease-in-out ${
        collapsed ? "w-[70px]" : "w-[240px]"
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-4 py-5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-400">
          <Route size={16} className="text-[#0F1623]" strokeWidth={2.5} />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="truncate text-[13px] font-semibold tracking-wide text-white">
              VialTech
            </p>
            <p className="truncate text-[10px] text-white/40 tracking-widest uppercase">
              Infraestructura
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 px-2 py-4">
        {!collapsed && (
          <p className="mb-1 px-2 text-[10px] font-medium uppercase tracking-widest text-white/30">
            Módulos
          </p>
        )}
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-all duration-150 ${
                isActive
                  ? "bg-amber-400/15 text-amber-400"
                  : "text-white/50 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={17}
                  strokeWidth={isActive ? 2.5 : 1.8}
                  className="shrink-0"
                />
                {!collapsed && (
                  <span className="truncate font-medium">{label}</span>
                )}
                {!collapsed && isActive && (
                  <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 px-2 py-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-white/40 transition-all hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={17} strokeWidth={1.8} className="shrink-0" />
          {!collapsed && <span className="font-medium">Cerrar sesión</span>}
        </button>
      </div>

      {/* Toggle button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[72px] flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-[#1A2235] text-white/50 shadow-md transition hover:text-white"
      >
        {collapsed ? (
          <ChevronRight size={13} strokeWidth={2.5} />
        ) : (
          <ChevronLeft size={13} strokeWidth={2.5} />
        )}
      </button>
    </aside>
  );
}
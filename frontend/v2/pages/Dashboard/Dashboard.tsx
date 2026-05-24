import { useEffect, useState } from "react";
import {
    ShieldAlert,
    Waves,
    TriangleAlert,
    ClipboardList,
    TrendingUp,
    MapPin,
    CheckCircle2,
    AlertTriangle,
    XCircle,
} from "lucide-react";
import api from "../../services/api";

interface StatsData {
    guardavia: number;
    alcantarilla: number;
    senalizacion: number;
    total: number;
}

interface RecentFicha {
    id: string;
    tipo: "guardavia" | "alcantarilla" | "senalizacion";
    numero: number;
    ubicacion: string;
    tramo_vial: string;
    estado: "Bueno" | "Regular" | "Malo";
    fecha: string;
}

const TIPO_CONFIG = {
    guardavia: {
        label: "Guardavía",
        icon: ShieldAlert,
        color: "text-blue-500",
        bg: "bg-blue-50",
        border: "border-blue-100",
        accent: "#3B82F6",
    },
    alcantarilla: {
        label: "Alcantarilla",
        icon: Waves,
        color: "text-emerald-500",
        bg: "bg-emerald-50",
        border: "border-emerald-100",
        accent: "#10B981",
    },
    senalizacion: {
        label: "Señalización",
        icon: TriangleAlert,
        color: "text-amber-500",
        bg: "bg-amber-50",
        border: "border-amber-100",
        accent: "#F59E0B",
    },
};

const ESTADO_CONFIG = {
    Bueno: {
        icon: CheckCircle2,
        className: "text-emerald-500 bg-emerald-50",
        label: "Bueno",
    },
    Regular: {
        icon: AlertTriangle,
        className: "text-amber-500 bg-amber-50",
        label: "Regular",
    },
    Malo: {
        icon: XCircle,
        className: "text-red-500 bg-red-50",
        label: "Malo",
    },
};

// Mock data — replace with real API calls when endpoints are ready
const MOCK_STATS: StatsData = {
    guardavia: 24,
    alcantarilla: 17,
    senalizacion: 31,
    total: 72,
};

const MOCK_RECENT: RecentFicha[] = [
    {
        id: "1",
        tipo: "guardavia",
        numero: 4,
        ubicacion: "Santo Domingo de los Tsáchilas",
        tramo_vial: "Vía Quevedo - Pto. Limón",
        estado: "Bueno",
        fecha: "2026-01-19",
    },
    {
        id: "2",
        tipo: "alcantarilla",
        numero: 9,
        ubicacion: "Santo Domingo de los Tsáchilas",
        tramo_vial: "Vía Quevedo - Pto. Limón",
        estado: "Malo",
        fecha: "2026-01-19",
    },
    {
        id: "3",
        tipo: "senalizacion",
        numero: 12,
        ubicacion: "Santo Domingo de los Tsáchilas",
        tramo_vial: "Vía Quevedo - Pto. Limón",
        estado: "Regular",
        fecha: "2026-01-18",
    },
    {
        id: "4",
        tipo: "guardavia",
        numero: 5,
        ubicacion: "Puerto Limón",
        tramo_vial: "Vía Quevedo - Pto. Limón",
        estado: "Regular",
        fecha: "2026-01-17",
    },
    {
        id: "5",
        tipo: "alcantarilla",
        numero: 10,
        ubicacion: "Cantón Santo Domingo",
        tramo_vial: "Vía Quevedo - Pto. Limón",
        estado: "Bueno",
        fecha: "2026-01-16",
    },
];

function StatCard({
    tipo,
    count,
    total,
}: {
    tipo: keyof typeof TIPO_CONFIG;
    count: number;
    total: number;
}) {
    const cfg = TIPO_CONFIG[tipo];
    const Icon = cfg.icon;
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <div
        className={`rounded-xl border ${cfg.border} bg-white p-5 transition-shadow hover:shadow-sm`}
        >
        <div className="flex items-start justify-between">
            <div className={`rounded-lg ${cfg.bg} p-2.5`}>
            <Icon size={18} className={cfg.color} strokeWidth={2} />
            </div>
            <span className="text-[11px] font-medium text-gray-400">{pct}% del total</span>
        </div>

        <div className="mt-4">
            <p className="text-[28px] font-bold text-gray-900 leading-none">{count}</p>
            <p className="mt-1 text-[13px] text-gray-500">{cfg.label}</p>
        </div>

        {/* Progress bar */}
        <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
            <div
            className="h-1 rounded-full transition-all duration-700"
            style={{ width: `${pct}%`, backgroundColor: cfg.accent }}
            />
        </div>
        </div>
    );
}

function TotalCard({ total }: { total: number }) {
    return (
        <div className="rounded-xl border border-[#0F1623]/10 bg-[#0F1623] p-5 text-white">
        <div className="flex items-start justify-between">
            <div className="rounded-lg bg-white/10 p-2.5">
            <ClipboardList size={18} className="text-amber-400" strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2 py-1">
            <TrendingUp size={11} className="text-amber-400" strokeWidth={2.5} />
            <span className="text-[11px] font-medium text-amber-400">Activas</span>
            </div>
        </div>

        <div className="mt-4">
            <p className="text-[28px] font-bold leading-none">{total}</p>
            <p className="mt-1 text-[13px] text-white/50">Total de fichas registradas</p>
        </div>

        <div className="mt-4 h-1 w-full rounded-full bg-white/10">
            <div className="h-1 w-full rounded-full bg-amber-400" />
        </div>
        </div>
    );
}

function RecentRow({ ficha }: { ficha: RecentFicha }) {
    const tipo = TIPO_CONFIG[ficha.tipo];
    const estado = ESTADO_CONFIG[ficha.estado];
    const TipoIcon = tipo.icon;
    const EstadoIcon = estado.icon;

    const formattedDate = new Date(ficha.fecha).toLocaleDateString("es-EC", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });

    return (
        <tr className="group border-b border-gray-50 transition-colors hover:bg-gray-50/60">
        {/* Tipo */}
        <td className="py-3 pl-4 pr-3">
            <div className="flex items-center gap-2.5">
            <div className={`rounded-md ${tipo.bg} p-1.5`}>
                <TipoIcon size={13} className={tipo.color} strokeWidth={2} />
            </div>
            <div>
                <p className="text-[12px] font-medium text-gray-800">{tipo.label}</p>
                <p className="text-[11px] text-gray-400">N° {ficha.numero}</p>
            </div>
            </div>
        </td>

        {/* Ubicación */}
        <td className="px-3 py-3">
            <div className="flex items-start gap-1.5">
            <MapPin size={12} className="mt-0.5 shrink-0 text-gray-300" strokeWidth={2} />
            <div>
                <p className="text-[12px] text-gray-700 leading-snug">{ficha.ubicacion}</p>
                <p className="text-[11px] text-gray-400 leading-snug">{ficha.tramo_vial}</p>
            </div>
            </div>
        </td>

        {/* Estado */}
        <td className="px-3 py-3">
            <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 ${estado.className}`}
            >
            <EstadoIcon size={11} strokeWidth={2.5} />
            <span className="text-[11px] font-medium">{estado.label}</span>
            </div>
        </td>

        {/* Fecha */}
        <td className="py-3 pl-3 pr-4 text-right">
            <span className="text-[11px] text-gray-400">{formattedDate}</span>
        </td>
        </tr>
    );
    }

    export default function Dashboard() {
        const [stats, setStats] = useState<StatsData>(MOCK_STATS);
        const [recent, setRecent] = useState<RecentFicha[]>(MOCK_RECENT);
        const [loading, setLoading] = useState(false);

        useEffect(() => {
            const fetchStats = async () => {
            setLoading(true);
            try {
                const [gRes, aRes, sRes] = await Promise.allSettled([
                api.get("/guardavia/"),
                api.get("/alcantarilla/"),
                api.get("/senalizacion/"),
                ]);

                const g = gRes.status === "fulfilled" ? gRes.value.data?.length ?? 0 : MOCK_STATS.guardavia;
                const a = aRes.status === "fulfilled" ? aRes.value.data?.length ?? 0 : MOCK_STATS.alcantarilla;
                const s = sRes.status === "fulfilled" ? sRes.value.data?.length ?? 0 : MOCK_STATS.senalizacion;

                setStats({ guardavia: g, alcantarilla: a, senalizacion: s, total: g + a + s });
            } catch {
                // fallback to mock
            } finally {
                setLoading(false);
            }
            };

            fetchStats();
        }, []);

    const estadoCount = (estado: RecentFicha["estado"]) =>
        recent.filter((f) => f.estado === estado).length;

    return (
        <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
            <div>
            <h2 className="text-[20px] font-bold text-gray-900 tracking-tight">
                Resumen general
            </h2>
            <p className="mt-0.5 text-[13px] text-gray-400">
                Estado actual del sistema de infraestructura vial
            </p>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-[12px] text-gray-500">Sistema operativo</span>
            </div>
        </div>

        {/* Stat cards */}
        <div className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${loading ? "opacity-60" : ""} transition-opacity`}>
            <TotalCard total={stats.total} />
            <StatCard tipo="guardavia" count={stats.guardavia} total={stats.total} />
            <StatCard tipo="alcantarilla" count={stats.alcantarilla} total={stats.total} />
            <StatCard tipo="senalizacion" count={stats.senalizacion} total={stats.total} />
        </div>

        {/* Bottom section */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            {/* Recent fichas table */}
            <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white">
            <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3.5">
                <div>
                <p className="text-[13px] font-semibold text-gray-800">Fichas recientes</p>
                <p className="text-[11px] text-gray-400">Últimos registros ingresados</p>
                </div>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-[11px] font-medium text-gray-500">
                {recent.length} registros
                </span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                <thead>
                    <tr className="border-b border-gray-50">
                    <th className="py-2.5 pl-4 pr-3 text-left text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Tipo
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Ubicación
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Estado
                    </th>
                    <th className="py-2.5 pl-3 pr-4 text-right text-[11px] font-medium uppercase tracking-wider text-gray-400">
                        Fecha
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {recent.map((ficha) => (
                    <RecentRow key={ficha.id} ficha={ficha} />
                    ))}
                </tbody>
                </table>
            </div>
            </div>

            {/* Estado breakdown */}
            <div className="flex flex-col gap-4">
            {/* Estado summary */}
            <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-[13px] font-semibold text-gray-800">Estado de fichas</p>
                <p className="mb-4 text-[11px] text-gray-400">Distribución por condición</p>

                <div className="flex flex-col gap-3">
                {(["Bueno", "Regular", "Malo"] as const).map((estado) => {
                    const cfg = ESTADO_CONFIG[estado];
                    const Icon = cfg.icon;
                    const count = estadoCount(estado);
                    const pct = recent.length > 0 ? Math.round((count / recent.length) * 100) : 0;
                    const barColor =
                    estado === "Bueno"
                        ? "bg-emerald-400"
                        : estado === "Regular"
                        ? "bg-amber-400"
                        : "bg-red-400";

                    return (
                    <div key={estado} className="flex flex-col gap-1.5">
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Icon size={13} className={cfg.className.split(" ")[0]} strokeWidth={2} />
                            <span className="text-[12px] text-gray-600">{estado}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[12px] font-semibold text-gray-800">{count}</span>
                            <span className="text-[11px] text-gray-400">{pct}%</span>
                        </div>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-gray-100">
                        <div
                            className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
                            style={{ width: `${pct}%` }}
                        />
                        </div>
                    </div>
                    );
                })}
                </div>
            </div>

            {/* Tramo info */}
            <div className="rounded-xl border border-gray-100 bg-white p-4">
                <p className="text-[13px] font-semibold text-gray-800">Tramo vial</p>
                <p className="mb-3 text-[11px] text-gray-400">Cobertura del proyecto</p>

                <div className="flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5">
                    <MapPin size={13} className="shrink-0 text-gray-400" strokeWidth={2} />
                    <div>
                    <p className="text-[12px] font-medium text-gray-700">Vía Quevedo - Pto. Limón</p>
                    <p className="text-[11px] text-gray-400">Parroquia Puerto Limón</p>
                    </div>
                </div>
                <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5">
                    <MapPin size={13} className="shrink-0 text-gray-400" strokeWidth={2} />
                    <div>
                    <p className="text-[12px] font-medium text-gray-700">Santo Domingo de los Tsáchilas</p>
                    <p className="text-[11px] text-gray-400">Cantón Santo Domingo</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    );
}
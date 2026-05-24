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
    <div className={`rounded-xl border ${cfg.border} bg-white p-5`}>
      <div className="flex items-start justify-between">
        <div className={`rounded-lg ${cfg.bg} p-2.5`}>
          <Icon size={18} className={cfg.color} />
        </div>

        <span className="text-[11px] text-gray-400">
          {pct}% del total
        </span>
      </div>

      <div className="mt-4">
        <p className="text-[28px] font-bold">{count}</p>
        <p className="text-[13px] text-gray-500">{cfg.label}</p>
      </div>
    </div>
  );
}

function TotalCard({ total }: { total: number }) {
  return (
    <div className="rounded-xl bg-[#0F1623] p-5 text-white">
      <div className="flex items-start justify-between">
        <div className="rounded-lg bg-white/10 p-2.5">
          <ClipboardList size={18} className="text-amber-400" />
        </div>

        <div className="flex items-center gap-1">
          <TrendingUp size={12} className="text-amber-400" />
          <span className="text-[11px] text-amber-400">
            Activas
          </span>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[28px] font-bold">{total}</p>
        <p className="text-[13px] text-white/60">
          Total de fichas
        </p>
      </div>
    </div>
  );
}

function RecentRow({ ficha }: { ficha: RecentFicha }) {
  const tipo = TIPO_CONFIG[ficha.tipo];
  const estado = ESTADO_CONFIG[ficha.estado];

  const TipoIcon = tipo.icon;
  const EstadoIcon = estado.icon;

  return (
    <tr className="border-b border-gray-100">
      <td className="p-4">
        <div className="flex items-center gap-2">
          <TipoIcon size={14} className={tipo.color} />
          <span>{tipo.label}</span>
        </div>
      </td>

      <td>{ficha.ubicacion}</td>

      <td>
        <div className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${estado.className}`}>
          <EstadoIcon size={12} />
          <span>{estado.label}</span>
        </div>
      </td>

      <td>{ficha.fecha}</td>
    </tr>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<StatsData>(MOCK_STATS);

  const [recent] = useState<RecentFicha[]>(MOCK_RECENT);

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

        const g =
          gRes.status === "fulfilled"
            ? gRes.value.data?.length ?? 0
            : MOCK_STATS.guardavia;

        const a =
          aRes.status === "fulfilled"
            ? aRes.value.data?.length ?? 0
            : MOCK_STATS.alcantarilla;

        const s =
          sRes.status === "fulfilled"
            ? sRes.value.data?.length ?? 0
            : MOCK_STATS.senalizacion;

        setStats({
          guardavia: g,
          alcantarilla: a,
          senalizacion: s,
          total: g + a + s,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const estadoCount = (estado: RecentFicha["estado"]) =>
    recent.filter((f: RecentFicha) => f.estado === estado).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <TotalCard total={stats.total} />

        <StatCard
          tipo="guardavia"
          count={stats.guardavia}
          total={stats.total}
        />

        <StatCard
          tipo="alcantarilla"
          count={stats.alcantarilla}
          total={stats.total}
        />

        <StatCard
          tipo="senalizacion"
          count={stats.senalizacion}
          total={stats.total}
        />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white">
        <table className="w-full">
          <tbody>
            {recent.map((ficha) => (
              <RecentRow key={ficha.id} ficha={ficha} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

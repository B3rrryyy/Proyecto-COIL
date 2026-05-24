export default function Dashboard() {
    const [stats, setStats] = useState<StatsData>(MOCK_STATS);

    // ✅ Tipado correcto + uso de MOCK_RECENT
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

                // ✅ Aquí luego puedes reemplazar con datos reales
                setRecent(MOCK_RECENT);

            } catch (error) {
                console.error("Error obteniendo estadísticas:", error);
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

                    <span className="text-[12px] text-gray-500">
                        Sistema operativo
                    </span>
                </div>
            </div>

            {/* Stat cards */}
            <div
                className={`grid grid-cols-2 gap-4 lg:grid-cols-4 ${
                    loading ? "opacity-60" : ""
                } transition-opacity`}
            >
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

            {/* Bottom section */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                {/* Recent fichas table */}
                <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white">
                    <div className="flex items-center justify-between border-b border-gray-50 px-4 py-3.5">
                        <div>
                            <p className="text-[13px] font-semibold text-gray-800">
                                Fichas recientes
                            </p>

                            <p className="text-[11px] text-gray-400">
                                Últimos registros ingresados
                            </p>
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
                                    <RecentRow
                                        key={ficha.id}
                                        ficha={ficha}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Estado breakdown */}
                <div className="flex flex-col gap-4">
                    <div className="rounded-xl border border-gray-100 bg-white p-4">
                        <p className="text-[13px] font-semibold text-gray-800">
                            Estado de fichas
                        </p>

                        <p className="mb-4 text-[11px] text-gray-400">
                            Distribución por condición
                        </p>

                        <div className="flex flex-col gap-3">
                            {(["Bueno", "Regular", "Malo"] as const).map(
                                (estado) => {
                                    const cfg = ESTADO_CONFIG[estado];
                                    const Icon = cfg.icon;

                                    const count = estadoCount(estado);

                                    const pct =
                                        recent.length > 0
                                            ? Math.round(
                                                  (count / recent.length) * 100
                                              )
                                            : 0;

                                    const barColor =
                                        estado === "Bueno"
                                            ? "bg-emerald-400"
                                            : estado === "Regular"
                                            ? "bg-amber-400"
                                            : "bg-red-400";

                                    return (
                                        <div
                                            key={estado}
                                            className="flex flex-col gap-1.5"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Icon
                                                        size={13}
                                                        className={
                                                            cfg.className.split(
                                                                " "
                                                            )[0]
                                                        }
                                                        strokeWidth={2}
                                                    />

                                                    <span className="text-[12px] text-gray-600">
                                                        {estado}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <span className="text-[12px] font-semibold text-gray-800">
                                                        {count}
                                                    </span>

                                                    <span className="text-[11px] text-gray-400">
                                                        {pct}%
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="h-1.5 w-full rounded-full bg-gray-100">
                                                <div
                                                    className={`h-1.5 rounded-full transition-all duration-700 ${barColor}`}
                                                    style={{
                                                        width: `${pct}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    </div>

                    {/* Tramo info */}
                    <div className="rounded-xl border border-gray-100 bg-white p-4">
                        <p className="text-[13px] font-semibold text-gray-800">
                            Tramo vial
                        </p>

                        <p className="mb-3 text-[11px] text-gray-400">
                            Cobertura del proyecto
                        </p>

                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5">
                                <MapPin
                                    size={13}
                                    className="shrink-0 text-gray-400"
                                    strokeWidth={2}
                                />

                                <div>
                                    <p className="text-[12px] font-medium text-gray-700">
                                        Vía Quevedo - Pto. Limón
                                    </p>

                                    <p className="text-[11px] text-gray-400">
                                        Parroquia Puerto Limón
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2.5 rounded-lg bg-gray-50 px-3 py-2.5">
                                <MapPin
                                    size={13}
                                    className="shrink-0 text-gray-400"
                                    strokeWidth={2}
                                />

                                <div>
                                    <p className="text-[12px] font-medium text-gray-700">
                                        Santo Domingo de los Tsáchilas
                                    </p>

                                    <p className="text-[11px] text-gray-400">
                                        Cantón Santo Domingo
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

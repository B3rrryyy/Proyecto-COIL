import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "../components/layout/Layout";
import { useAuthStore } from "../store/auth.store";

// Lazy pages
const Login = lazy(() => import("../pages/Login/Login"));
const Register = lazy(() => import("../pages/Login/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const Guardavia = lazy(() => import("../pages/Guardavia/Guardavia"));
const Alcantarilla = lazy(() => import("../pages/Alcantarilla/Alcantarilla"));
const Senalizacion = lazy(() => import("../pages/Senalizacion/Senalizacion"));
const Historial = lazy(() => import("../pages/Historial/HistorialPage"));

function PageLoader() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-slate-700" />
            <span className="text-sm text-gray-400 tracking-wide">Cargando...</span>
        </div>
        </div>
    );
}

function PrivateRoute({ children }: { children: React.ReactNode }) {
    const token = useAuthStore((s) => s.token);
    return <>{children}</>; //token ? <>{children}</> : <Navigate to="/login" replace />
}

function PublicRoute({ children }: { children: React.ReactNode }) {
    const token = useAuthStore((s) => s.token);
    return token ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
        <Routes>

        <Route
            path="/"
            element={<Navigate to="/login" replace />}
        />

        <Route
            path="/login"
            element={
            <PublicRoute>
                <Login />
            </PublicRoute>
            }
        />

        <Route
            path="/register"
            element={
                <PublicRoute>
                <Register />
                </PublicRoute>
            }
        />

        <Route
            element={
            <PrivateRoute>
                <Layout />
            </PrivateRoute>
            }
        >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/guardavia" element={<Guardavia />} />
            <Route path="/alcantarilla" element={<Alcantarilla />} />
            <Route path="/senalizacion" element={<Senalizacion />} />
            <Route path="/historial" element={<Historial />} />
        </Route>

        <Route
            path="*"
            element={<Navigate to="/login" replace />}
        />

</Routes>
        </Suspense>
    );
}
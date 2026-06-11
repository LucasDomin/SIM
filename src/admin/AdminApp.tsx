import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ContentPage from "./pages/ContentPage";
import MediaPage from "./pages/MediaPage";
import SettingsPage from "./pages/SettingsPage";
import { go } from "../lib/adminRoute";

export default function AdminApp() {
  return <AdminRouter />;
}

function AdminRouter() {
  const { user, loading } = useAuth();
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (!loading && !user && path !== "/admin/login") go("/admin/login");
    if (!loading && user && (path === "/admin" || path === "/admin/login")) go("/admin/dashboard");
  }, [loading, user, path]);

  if (loading) return <div className="min-h-screen bg-noir-950 text-noir-100 grid place-items-center">Carregando...</div>;
  if (!user) return <LoginPage />;

  const page = path.includes("/content") ? <ContentPage /> : path.includes("/media") ? <MediaPage /> : path.includes("/settings") ? <SettingsPage /> : <DashboardPage />;
  return <AdminLayout>{page}</AdminLayout>;
}
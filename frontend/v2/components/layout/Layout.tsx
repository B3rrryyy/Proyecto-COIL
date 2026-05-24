import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useState } from "react";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F5F7] font-sans">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((p) => !p)} />
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Navbar />
        <main className="flex-1 overflow-y-auto px-8 py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
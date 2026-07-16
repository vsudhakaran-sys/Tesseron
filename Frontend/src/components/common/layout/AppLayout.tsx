import { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { AppSidebar } from "./AppSidebar";
import { AppHeader } from "./AppHeader";

export function AppLayout() {
  const token = localStorage.getItem("TESSERON_token");
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="fixed top-0 left-0 right-0 h-screen h-[100dvh] overflow-hidden flex w-full bg-transparent selection:bg-primary/10">
      <div className="mesh-gradient" />
      <AppSidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className="flex-1 flex flex-col relative z-10 transition-all duration-300">
        <AppHeader isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}






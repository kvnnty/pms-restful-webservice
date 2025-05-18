import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex items-start overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-screen flex flex-col bg-slate-50 p-5">
        <div className="flex-1 flex flex-col bg-white border border-slate-200 rounded-3xl overflow-hidden">
          <Navbar />
          <div className="flex-1 flex flex-col overflow-y-auto p-5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

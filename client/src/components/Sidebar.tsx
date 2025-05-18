"use client";

import { useAuth } from "@/store/features/auth/auth.selector";
import { NavLink } from "react-router-dom";

import { Car, Home, LayoutDashboard, Map, Ticket, User, Users } from "lucide-react";

// User navigation links
export const USER_NAVLINKS = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/vehicles", label: "My Vehicles", icon: Car },
  { href: "/my-parking-slot-bookings", label: "My Parking Slot Bookings", icon: Ticket },
  { href: "/profile", label: "Profile", icon: User },
];

// Admin navigation links
export const ADMIN_NAVLINKS = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/admin/parking-slots", label: "Parking Slots", icon: Map },
  { href: "/admin/parking-slot-requests", label: "Parking Slot Requests", icon: Ticket },
];

export default function Sidebar() {
  const { currentUser } = useAuth();
  const navLinks = currentUser?.role === "USER" ? USER_NAVLINKS : ADMIN_NAVLINKS;

  return (
    <div className="w-[280px] h-screen sticky top-0 bg-slate-50 py-6 pl-6">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold flex items-center gap-x-2 gap-1">
          <Car size={40} color="#3b82f6" /> PMS Portal
        </span>
      </div>

      <div className="mt-5">
        <span className="uppercase text-[15px] text-slate-400 font-medium">Menu</span>
        <div className="flex flex-col gap-1 mt-5">
          {navLinks.map(({ href, label, icon: Icon }) => {
            return (
              <NavLink
                key={href}
                to={href}
                className={({ isActive }) => {
                  return `flex items-center gap-3 p-3 rounded-lg transition-all ${isActive ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-200"}`;
                }}>
                <Icon size={18} />
                {label}
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}

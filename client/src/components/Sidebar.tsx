"use client";

import { useAuth } from "@/store/features/auth/auth.selector";
import { BusIcon, Car, Home, LayoutDashboard, ParkingCircle, ScrollText, Settings, Ticket, Users } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export const USER_NAVLINKS = [
  { href: "/dashboard/overview", label: "Dashboard", icon: Home },
  { href: "/dashboard/user/vehicles", label: "My Vehicles", icon: Car },
  { href: "/dashboard/user/parkings", label: "View Parkings", icon: BusIcon },
  { href: "/dashboard/user/requests", label: "My Booking Requests", icon: Ticket },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export const ADMIN_NAVLINKS = [
  { href: "/dashboard/overview", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/admin/users", label: "User Management", icon: Users },
  { href: "/dashboard/admin/vehicles", label: "Vehicles", icon: Car },
  { href: "/dashboard/admin/parkings", label: "Manage Parkings", icon: ParkingCircle },
  { href: "/dashboard/admin/parking-slot-booking-requests", label: "Slot Requests", icon: Ticket },
  { href: "/dashboard/admin/logs", label: "System Logs", icon: ScrollText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const { currentUser } = useAuth();
  const navLinks = currentUser?.role === "USER" ? USER_NAVLINKS : ADMIN_NAVLINKS;
  const location = useLocation();

  return (
    <div className="w-[280px] h-screen sticky top-0 bg-slate-50 py-6 pl-6 flex flex-col">
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold flex items-center gap-x-2 gap-1">
          <Car size={40} color="#3b82f6" /> PMS Portal
        </span>
      </div>

      <div className="mt-5 flex-1 flex flex-col justify-between">
        <div className="flex-1">
          <span className="uppercase text-[15px] text-slate-400 font-medium">Menu</span>
          <div className="flex flex-col gap-1 mt-5">
            {navLinks.map(({ href, label, icon: Icon }) => {
              return (
                <NavLink
                  key={href}
                  to={href}
                  className={({ isActive }) => {
                    return `flex items-center gap-3 p-3 rounded-lg transition-all ${
                      isActive && location.pathname === href ? "bg-blue-500 text-white" : "text-slate-600 hover:bg-slate-200"
                    }`;
                  }}>
                  <Icon size={18} />
                  {label}
                </NavLink>
              );
            })}
          </div>
        </div>
        <div>
          <Link to="dashboard/account" className={`flex items-center gap-3 p-3 rounded-md transition-all bg-gray-100 border`}>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="uppercase">
                {currentUser?.firstName[0]} {currentUser?.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold">
                {currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <p className="text-gray-400 text-sm">{currentUser?.email}</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

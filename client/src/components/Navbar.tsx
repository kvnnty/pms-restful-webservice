"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/store/features/auth/auth.selector";
import { ArrowLeft, BellIcon } from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <div className="flex items-center gap-3 justify-between p-3">
      <div className="flex gap-3">
        <button onClick={() => navigate(-1)} className="text-slate-500 p-2 rounded-full hover:bg-slate-50 transition-all">
          <ArrowLeft />
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button className="text-slate-500 p-2 rounded-full hover:bg-slate-50 transition-all">
          <BellIcon />
        </button>
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback className="uppercase">
                {currentUser?.firstName[0]}{currentUser?.lastName[0]}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-32">
              <h2 className="text-lg font-semibold">
                {currentUser?.firstName} {currentUser?.lastName}
              </h2>
              <p className="text-sm text-slate-400">{currentUser?.role}</p>
            </div>
          </div>
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
}

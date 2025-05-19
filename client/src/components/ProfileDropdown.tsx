"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { logout } from "@/store/features/auth/auth.slice";
import { ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Spinner from "./ui/spinner";

export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const [logoutPending, setLogoutPending] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogoutPending(true);
    setTimeout(() => {
      toast.success("Logged out!");
      localStorage.clear();
      dispatch(logout());
      navigate("/");
      setLogoutPending(false);
    }, 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border p-1 rounded-full mt-2 cursor-pointer">
          <ChevronDown size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] relative top-5 right-10">
        <button
          disabled={logoutPending}
          onClick={handleLogout}
          className="relative flex select-none items-center rounded-lg h-12 p-4 outline-none w-full gap-3 text-[#D9000B] hover:bg-[#D9000B]/10 cursor-pointer">
          <LogOut />
          Sign out
          {logoutPending && <Spinner color="#000" />}
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

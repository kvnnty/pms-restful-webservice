"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosClient from "@/config/axios.config";
import { ChevronDown, HomeIcon, LogOut, UserCheck } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Spinner from "./ui/spinner";
import { logout } from "@/store/features/auth/auth.slice";
import { Link, useNavigate } from "react-router-dom";

export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const [logoutPending, setLogoutPending] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogoutPending(true);
    await axiosClient
      .post("/auth/logout")
      .then(() => {
        toast.success("Logged out!");
        localStorage.clear();
        dispatch(logout());
        navigate("/");
      })
      .catch((error: any) => {
        toast.error(error.response.data.message || "Something went wrong logging you out, try again");
      })
      .finally(() => {
        setLogoutPending(false);
      });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="border p-1 rounded-full mt-2 cursor-pointer">
          <ChevronDown size={15} />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[300px] relative top-5 right-10">
        <DropdownMenuGroup>
          <Link to="#">
            <DropdownMenuItem className="flex gap-3 px-4">
              <UserCheck className="text-gray-600" />
              My profile
            </DropdownMenuItem>
          </Link>
          <Link to="/dashboard">
            <DropdownMenuItem className="flex gap-3 px-4">
              <HomeIcon className="text-gray-600" />
              Dashboard
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
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

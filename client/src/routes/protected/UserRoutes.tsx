import { useAuth } from "@/store/features/auth/auth.selector";
import { Navigate, Outlet } from "react-router-dom";

const UserRoutes = () => {
  const { currentUser } = useAuth();
  return currentUser?.role === "USER" ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default UserRoutes;

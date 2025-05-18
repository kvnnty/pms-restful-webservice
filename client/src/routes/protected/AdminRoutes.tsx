import { useAuth } from "@/store/features/auth/auth.selector";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const { currentUser } = useAuth();
  return currentUser?.role === "ADMIN" ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default AdminRoute;

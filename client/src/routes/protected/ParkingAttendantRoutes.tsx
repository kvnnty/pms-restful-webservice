import { useAuth } from "@/store/features/auth/auth.selector";
import { Navigate, Outlet } from "react-router-dom";

const ParkingAttendantRoutes = () => {
  const { currentUser } = useAuth();
  return currentUser?.role === "PARKING_ATTENDANT" ? <Outlet /> : <Navigate to="/auth/login" />;
};

export default ParkingAttendantRoutes;

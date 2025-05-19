import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

// Layouts
import AuthPagesLayout from "@/layouts/AuthPagesLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

// Public Pages
import NotFound from "@/pages/404/page";
import LandingPage from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";

// Dashboard Shared Pages
import AccountPage from "@/pages/dashboard/account/page";
import OverviewPage from "@/pages/dashboard/overview/page";
import SettingsPage from "@/pages/dashboard/settings/page";

// Admin Pages
import LogsPage from "@/pages/dashboard/admin/system-logs/page";
import AdminViewAllParkingSlotRequestsPage from "@/pages/dashboard/admin/parking-slot-booking-requests/page";
import AdminViewParkingDetailsPage from "@/pages/dashboard/admin/parkings/[id]/page";
import AdminParkingsPage from "@/pages/dashboard/admin/parkings/page";
import AdminViewAllUsersPage from "@/pages/dashboard/admin/users/page";
import AdminViewVehicleDetailsPage from "@/pages/dashboard/admin/vehicles/[id]/page";
import AdminViewAllVehiclesPage from "@/pages/dashboard/admin/vehicles/page";
import AdminRoutes from "./protected/AdminRoutes";

// User Pages
import UserViewParkingDetailsPage from "@/pages/dashboard/user/parkings/[id]/page";
import UserParkingsPage from "@/pages/dashboard/user/parkings/page";
import UserBookingRequestsPage from "@/pages/dashboard/user/booking-requests/page";
import UserVehicleDetailsPage from "@/pages/dashboard/user/vehicles/[id]/page";
import UserVehiclesPage from "@/pages/dashboard/user/vehicles/page";
import UserRoutes from "./protected/UserRoutes";

// Utils
import AdminViewUserDetailsPage from "@/pages/dashboard/admin/users/[id]/page";
import LoadingPage from "@/pages/loading/page";
import ProtectedRoute from "./protected/ProtectedRoutes";

function PageRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Public */}
          <Route index element={<LandingPage />} />
          <Route path="auth" element={<AuthPagesLayout />}>
            <Route index element={<Navigate to="login" replace />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<DashboardLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<OverviewPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="account" element={<AccountPage />} />

              {/* User Routes */}
              <Route path="user" element={<UserRoutes />}>
                <Route path="vehicles">
                  <Route index element={<UserVehiclesPage />} />
                  <Route path=":id" element={<UserVehicleDetailsPage />} />
                </Route>
                <Route path="booking-requests" element={<UserBookingRequestsPage />} />
                <Route path="parkings">
                  <Route index element={<UserParkingsPage />} />
                  <Route path=":id" element={<UserViewParkingDetailsPage />} />
                </Route>
              </Route>

              {/* Admin Routes */}
              <Route path="admin" element={<AdminRoutes />}>
                <Route path="users">
                  <Route index element={<AdminViewAllUsersPage />} />
                  <Route path=":id" element={<AdminViewUserDetailsPage />} />
                </Route>
                <Route path="parkings">
                  <Route index element={<AdminParkingsPage />} />
                  <Route path=":id" element={<AdminViewParkingDetailsPage />} />
                </Route>
                <Route path="vehicles">
                  <Route index element={<AdminViewAllVehiclesPage />} />
                  <Route path=":id" element={<AdminViewVehicleDetailsPage />} />
                </Route>
                <Route path="parking-slot-booking-requests" element={<AdminViewAllParkingSlotRequestsPage />} />
                <Route path="logs" element={<LogsPage />} />
              </Route>
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default PageRoutes;

import AuthPagesLayout from "@/layouts/AuthPagesLayout";
import DashboardLayout from "@/layouts/DashboardLayout";
import NotFound from "@/pages/404/page";
import LandingPage from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AccountPage from "@/pages/dashboard/account/page";
import OrderByIdPage from "@/pages/dashboard/parkings/[id]/page";
import OrdersPage from "@/pages/dashboard/parkings/page";
import OverviewPage from "@/pages/dashboard/overview/page";
import SettingsPage from "@/pages/dashboard/settings/page";
import ClientByIdPage from "@/pages/dashboard/vehicles/[id]/ClientByIdPage";
import VehiclesPage from "@/pages/dashboard/vehicles/page";
import LoadingPage from "@/pages/loading/page";
import { Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminRoute from "./protected/AdminRoutes";
import ProtectedRoute from "./protected/ProtectedRoutes";

function PageRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          <Route index Component={LandingPage} />

          <Route path="auth" Component={AuthPagesLayout}>
            <Route path="login" Component={Login} />
            <Route path="register" Component={Register} />
          </Route>

          <Route Component={ProtectedRoute}>
            <Route path="dashboard" Component={DashboardLayout}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" Component={OverviewPage} />
              <Route path="settings" Component={SettingsPage} />
              <Route path="account" Component={AccountPage} />

              <Route path="vehicles">
                <Route path="orders" Component={AdminRoute}>
                  <Route index Component={OrdersPage} />
                  <Route path=":id" Component={OrderByIdPage} />
                </Route>
              </Route>

              <Route path="">
                <Route index Component={VehiclesPage} />
                <Route path=":id" Component={ClientByIdPage} />
              </Route>

            </Route>
          </Route>

          {/* Catch-all */}
          <Route path="*" Component={NotFound} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default PageRoutes;

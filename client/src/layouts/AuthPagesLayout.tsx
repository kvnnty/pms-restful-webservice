import { useAuth } from "@/store/features/auth/auth.selector";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthPagesLayout() {
  const { isLoggedIn } = useAuth();
  if (isLoggedIn) return <Navigate to="/dashboard" />;
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-bg-primary flex flex-col justify-center relative overflow-hidden p-4">
      <Outlet />
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/30 to-pink-500/20 opacity-50 dark:opacity-30 blur-3xl animate-gradient-xy" />
        <div className="absolute -bottom-1/2 -left-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-purple-500/30 via-pink-500/30 to-blue-500/20 opacity-50 dark:opacity-30 blur-3xl animate-gradient-xy" />
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 dark:bg-blue-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute top-1/3 right-1/3 w-72 h-72 bg-purple-400/20 dark:bg-purple-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/2 w-72 h-72 bg-pink-400/20 dark:bg-pink-400/10 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-white/[0.02] bg-[length:30px_30px] opacity-100" />
      </div>
    </div>
  );
}

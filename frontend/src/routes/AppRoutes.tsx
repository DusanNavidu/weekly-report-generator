import { lazy, Suspense, ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { motion } from "framer-motion";

const Login = lazy(() => import("../pages/Login"));

const ManagerDashboard = () => <div className="p-10 text-text-main text-2xl">Manager Dashboard</div>;
const MemberReports = () => <div className="p-10 text-text-main text-2xl">Team Member Reports</div>;

type RequireAuthTypes = { children: ReactNode; roles?: string[] };

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background overflow-hidden relative">
        <div className="absolute w-125 h-125 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 border-t-4 border-b-4 border-primary rounded-full animate-spin"></div>
          <div className="absolute w-16 h-16 border-r-4 border-l-4 border-primary/60 rounded-full animate-spin-reverse opacity-70"></div>
          <div className="absolute bg-text-main w-4 h-4 rounded-full shadow-lg animate-ping"></div>
        </div>
        <div className="mt-10 text-center z-10">
          <h2 className="text-text-main text-2xl font-black italic tracking-[0.2em] uppercase animate-pulse">
            SISENCO <span className="text-primary">REPORTS</span>
          </h2>
          <div className="flex items-center justify-center gap-1 mt-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
              Authenticating Workspace
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-text-main">
        <h2 className="text-3xl font-bold mb-2 text-error">Access Denied</h2>
        <p className="text-text-muted">You do not have permission to view this page.</p>
      </div>
    );
  }

  return <>{children}</>;
};

export default function AppRoutes() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<div className="h-screen bg-background"></div>}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Manager Only Routes */}
          <Route path="/manager/dashboard" element={
            <RequireAuth roles={["MANAGER"]}>
              <ManagerDashboard />
            </RequireAuth>
          } />

          {/* Team Member Only Routes */}
          <Route path="/member/reports" element={
            <RequireAuth roles={["TEAM_MEMBER"]}>
              <MemberReports />
            </RequireAuth>
          } />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
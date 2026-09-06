import { lazy, Suspense, ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ManagerLayout from "../components/layout/ManagerLayout";
import MemberLayout from "../components/layout/MemberLayout";

// --- Lazy Loaded Components ---
const Login = lazy(() => import("../pages/Login"));

// Manager Pages
const ManagerDashboard = lazy(() => import("../pages/manager/Dashboard"));
const TeamMembers = lazy(() => import("../pages/manager/TeamMembers"));
const Projects = lazy(() => import("../pages/manager/Projects"));

// Team Member Pages
const MyReports = lazy(() => import("../pages/member/MyReports"));
const CreateReport = lazy(() => import("../pages/member/CreateReport"));

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
          
          {/* ============================== */}
          {/* MANAGER ROUTES                 */}
          {/* ============================== */}
          <Route 
            path="/manager" 
            element={
              <RequireAuth roles={["MANAGER"]}>
                <ManagerLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ManagerDashboard />} />
            <Route path="members" element={<TeamMembers />} />
            <Route path="projects" element={<Projects />} />
          </Route>

          {/* ============================== */}
          {/* TEAM MEMBER ROUTES             */}
          {/* ============================== */}
          <Route 
            path="/member" 
            element={
              <RequireAuth roles={["TEAM_MEMBER"]}>
                <MemberLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="reports" replace />} />
            <Route path="reports" element={<MyReports />} />
            <Route path="reports/new" element={<CreateReport />} />
            <Route path="reports/:id" element={<div className="p-10 text-white text-center">Edit/View Report Page Coming Soon</div>} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
import { lazy, Suspense, ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ManagerLayout from "../components/layout/ManagerLayout";
import MemberLayout from "../components/layout/MemberLayout";
import { motion } from "framer-motion";

// --- Lazy Loaded Components ---
const Login = lazy(() => import("../pages/Login"));

// Manager Pages
const ManagerDashboard = lazy(() => import("../pages/manager/Dashboard"));
const TeamMembers = lazy(() => import("../pages/manager/TeamMembers"));
const Projects = lazy(() => import("../pages/manager/Projects"));
const ManagerReports = lazy(() => import("../pages/manager/ManagerReports"));
const ReportReview = lazy(() => import("../pages/manager/ReportReview"));


// Team Member Pages
const MyReports = lazy(() => import("../pages/member/MyReports"));
const CreateReport = lazy(() => import("../pages/member/CreateReport"));
const ReportDetail = lazy(() => import("../pages/member/ReportDetail"));

type RequireAuthTypes = { children: ReactNode; roles?: string[] };

const RequireAuth = ({ children, roles }: RequireAuthTypes) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-text-main transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="clay-card w-28 h-28 flex items-center justify-center rounded-4xl shadow-xl"
        >
          <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-3xl shadow-inner">
            S
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex flex-col items-center"
        >
          <h2 className="text-2xl font-bold tracking-wide">
            Sisenco<span className="text-primary font-black">Reports</span>
          </h2>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
          </div>
          <p className="text-sm font-medium text-text-muted mt-2">Authenticating Workspace...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-text-main transition-colors duration-300">
        <div className="clay-card p-10 flex flex-col items-center text-center">
          <h2 className="text-4xl font-bold mb-4 text-error">403</h2>
          <h3 className="text-2xl font-bold mb-2">Access Denied</h3>
          <p className="text-text-muted font-medium">You do not have permission to view this workspace.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

const SuspenseLoader = () => (
  <div className="h-screen w-full bg-background transition-colors duration-300"></div>
);

export default function AppRoutes() {
  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Suspense fallback={<SuspenseLoader />}>
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
            <Route path="reports" element={<ManagerReports />} />
            <Route path="reports/:id" element={<ReportReview />} />
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
            <Route path="reports/:id" element={<ReportDetail />} />
          </Route>

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
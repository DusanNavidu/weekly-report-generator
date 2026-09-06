import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../hooks/useTheme";
import { LayoutDashboard, Users, FolderOpen, FileText, LogOut, Menu, X, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ManagerLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop Sidebar Toggle
  
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { name: "Dashboard", path: "/manager/dashboard", icon: LayoutDashboard },
    { name: "Team Members", path: "/manager/members", icon: Users },
    { name: "Projects", path: "/manager/projects", icon: FolderOpen },
    { name: "Reports", path: "/manager/reports", icon: FileText },
  ];

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleMenuToggle = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed(!isCollapsed); // Laptop/Desktop Toggle
    } else {
      setIsMobileOpen(true); // Mobile Slide Open
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden lg:p-4 lg:gap-4 transition-colors duration-300">
      
      {/* Mobile App Style Overlay Backdrop */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Claymorphism on Desktop, Full Height on Mobile) */}
      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed && window.innerWidth >= 1024 ? "5.5rem" : "16rem",
          x: isMobileOpen || window.innerWidth >= 1024 ? 0 : -300
        }}
        className={`
          fixed lg:relative z-50 h-full flex flex-col transition-all duration-300 ease-in-out
          bg-surface lg:clay-card border-r lg:border-none border-border rounded-r-3xl lg:rounded-3xl overflow-hidden
        `}
      >
        {/* Sidebar Header / Logo */}
        <div className="h-20 flex items-center justify-center px-4 relative shrink-0">
          <div className="w-10 h-10 clay-card flex items-center justify-center bg-primary/10 text-primary font-black text-xl shrink-0">
            S
          </div>
          
          {/* Text hides when collapsed */}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span 
                initial={{ opacity: 0, width: 0 }} 
                animate={{ opacity: 1, width: "auto" }} 
                exit={{ opacity: 0, width: 0 }}
                className="ml-3 text-xl font-bold text-text-main whitespace-nowrap overflow-hidden"
              >
                Sisenco<span className="text-primary">Reports</span>
              </motion.span>
            )}
          </AnimatePresence>

          <button onClick={() => setIsMobileOpen(false)} className="lg:hidden absolute right-4 text-text-muted p-2 bg-background rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-6 space-y-3 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                title={isCollapsed ? item.name : ""}
                className={`flex items-center rounded-2xl transition-all duration-200 ${
                  isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3 gap-3"
                } ${
                  isActive 
                    ? "clay-btn bg-primary text-white" 
                    : "text-text-muted hover:bg-background hover:text-text-main"
                }`}
              >
                <Icon size={22} className="shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Section */}
        <div className="p-4 border-t border-border shrink-0">
          <button
            onClick={logout}
            title={isCollapsed ? "Logout" : ""}
            className={`flex items-center w-full text-error rounded-2xl transition-all duration-200 hover:bg-error/10 ${
              isCollapsed ? "justify-center px-0 py-3" : "px-4 py-3 gap-3"
            }`}
          >
            <LogOut size={22} className="shrink-0" />
            {!isCollapsed && <span className="font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        
        {/* Top Header */}
        <header className="h-16 lg:h-20 bg-surface lg:clay-card border-b lg:border-none border-border flex items-center justify-between px-4 sm:px-6 lg:mb-4 lg:rounded-3xl shrink-0 transition-colors">
          <div className="flex items-center gap-4">
            <button
              onClick={handleMenuToggle}
              className="p-2 text-text-muted hover:text-text-main rounded-xl hover:bg-background transition-colors"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-text-main hidden sm:block">Manager Workspace</h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button onClick={toggleTheme} className="p-2.5 text-text-muted hover:text-primary rounded-full hover:bg-background transition-all">
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-border">
              <div className="w-9 h-9 clay-card bg-primary flex items-center justify-center text-white font-bold text-lg">
                {user?.email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-bold text-text-main leading-tight">System Admin</p>
                <p className="text-xs text-text-muted font-medium">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content (Outlet) */}
        <main className="flex-1 overflow-y-auto bg-background lg:bg-surface lg:clay-card lg:rounded-3xl p-4 sm:p-6 lg:p-8 transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
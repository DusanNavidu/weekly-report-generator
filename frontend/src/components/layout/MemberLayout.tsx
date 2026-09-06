import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FileText, PlusCircle, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme'; 
import { motion } from 'framer-motion';

export default function MemberLayout() {
  const { logout, user } = useAuth();
  const { isDark, toggleTheme } = useTheme(); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-text-main">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -250 }} 
        animate={{ x: 0 }} 
        className="w-64 bg-background/50 border-r border-border/50 shadow-2xl hidden md:flex flex-col justify-between z-20 backdrop-blur-md"
      >
        <div>
          {/* Brand Logo */}
          <div className="h-20 flex items-center px-8 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary font-black shadow-inner">
                S
              </div>
              <h2 className="font-bold text-lg tracking-wide">
                Sisenco<span className="text-primary font-black">Reports</span>
              </h2>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-2 mt-4">
            <NavLink 
              to="/member/reports" 
              end
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-text-muted hover:bg-background hover:text-text-main border border-transparent hover:border-border/50'
                }`
              }
            >
              <FileText size={20} />
              <span>My Reports</span>
            </NavLink>

            <NavLink 
              to="/member/reports/new" 
              className={({ isActive }) => 
                `flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-text-muted hover:bg-background hover:text-text-main border border-transparent hover:border-border/50'
                }`
              }
            >
              <PlusCircle size={20} />
              <span>Create Report</span>
            </NavLink>
          </nav>
        </div>

        {/* Theme Toggle, User Profile & Logout */}
        <div className="p-4 border-t border-border/50 flex flex-col gap-2">
          
          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} className="p-2.5 text-text-muted hover:text-primary rounded-full hover:bg-background transition-all">
              {isDark ? 
              <div className="flex items-center gap-2">
                <Sun size={20} />
                <span className="text-main">Light Mode</span>
              </div>
               : 
                <div className="flex items-center gap-2">
                    <Moon size={20} />
                    <span className="text-main">Dark Mode</span>
                </div>
              }
          </button>

          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-background/50 border border-border/50 shadow-inner">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold shrink-0">
              <User size={16} />
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate">Team Member</p>
              <p className="text-xs text-text-muted truncate">{user?.email}</p>
            </div>
          </div>
          
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-error hover:bg-error/10 transition-colors"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-6 md:p-10">
          <Outlet /> 
        </div>
      </main>
    </div>
  );
}
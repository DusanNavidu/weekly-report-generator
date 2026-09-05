import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import InputField from "../components/ui/InputField";
import Button from "../components/ui/Button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const userData = await login(email, password);
      if (userData.role === "MANAGER") {
        navigate("/manager/dashboard");
      } else {
        navigate("/member/reports");
      }
    } catch (err) {
      setError("Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background relative overflow-hidden transition-colors duration-500">
      
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[100px]"></div>

      {/* Theme Toggle Button */}
      <button
        onClick={toggleTheme}
        className="absolute top-6 right-6 z-50 p-2.5 rounded-full bg-surface border border-border text-text-muted hover:text-text-main shadow-sm transition-all"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full sm:max-w-md h-screen sm:h-auto bg-surface sm:bg-surface/80 backdrop-blur-xl sm:border border-border p-8 sm:rounded-3xl shadow-none sm:shadow-2xl flex flex-col justify-center relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <span className="text-primary font-black text-3xl">S</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-text-main mb-2 tracking-tight">
            Sisenco<span className="text-primary">Reports</span>
          </h1>
          <p className="text-sm text-text-muted font-medium">Welcome back, please sign in below</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <InputField
            id="email"
            label="Email Address"
            type="email"
            placeholder="admin@sisenco.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <InputField
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error}
            required
          />

          <div className="pt-4 pb-12 sm:pb-0">
            <Button type="submit" isLoading={isLoading} className="h-12 text-lg">
              Sign In
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
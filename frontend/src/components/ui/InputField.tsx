import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function InputField({ label, error, type = "text", id, ...props }: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full mb-4">
      {/* Label Component */}
      <label htmlFor={id} className="text-sm font-medium text-text-main">
        {label}
      </label>

      {/* Input Wrapper */}
      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`w-full px-4 py-2.5 rounded-lg border bg-surface text-text-main focus:outline-none focus:ring-2 focus:ring-primary transition-all ${
            error ? "border-error focus:ring-error" : "border-border"
          }`}
          {...props}
        />

        {/* Eye Toggle Component */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-main transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>

      {/* Error Message Component */}
      {error && <span className="text-xs font-medium text-error">{error}</span>}
    </div>
  );
}
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
      <label htmlFor={id} className="text-sm font-semibold text-text-main pl-1">
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={inputType}
          className={`clay-input w-full px-4 py-3 text-text-main ${error ? "border-error focus:ring-error" : ""}`}
          {...props}
        />

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

      {error && <span className="text-xs font-medium text-error pl-1">{error}</span>}
    </div>
  );
}
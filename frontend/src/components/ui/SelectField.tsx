import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Option {
  value: string;
  label: string;
}

interface SelectFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: Option[];
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export default function SelectField({
  label,
  value,
  onChange,
  options,
  disabled,
  required,
  placeholder = "Select an option..."
}: SelectFieldProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val: string) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
      <label className="text-sm font-bold text-text-main pl-1">
        {label} {required && <span className="text-error">*</span>}
      </label>

      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          relative w-full flex items-center justify-between px-4 py-3 text-left
          bg-surface border rounded-xl transition-all duration-200 outline-none
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:border-primary/60"}
          ${isOpen ? "border-primary shadow-[0_0_0_2px_rgba(99,102,241,0.2)]" : "border-border/50"}
        `}
      >
        <span className={`block truncate ${!selectedOption ? "text-text-muted font-medium" : "text-text-main font-bold"}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          size={18}
          className={`text-text-muted transition-transform duration-300 ${isOpen ? "rotate-180 text-primary" : ""}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute z-50 w-full mt-2 top-full bg-surface border border-border/80 rounded-xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-60 overflow-y-auto p-2 custom-scrollbar bg-surface/95 backdrop-blur-md flex flex-col gap-1">
              
              {options.length === 0 && (
                <div className="p-3 text-sm text-text-muted text-center italic">No options available</div>
              )}

              {options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleSelect(opt.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-all duration-200 outline-none
                      ${isSelected 
                        ? "bg-primary/15 text-primary font-bold shadow-sm" 
                        : "text-text-main hover:bg-background hover:text-primary font-medium"}
                    `}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check size={16} className="text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {required && (
        <input
          type="text"
          className="absolute opacity-0 w-0 h-0 bottom-0 left-1/2 pointer-events-none"
          value={value}
          onChange={() => {}}
          required={required}
          tabIndex={-1}
        />
      )}
    </div>
  );
}
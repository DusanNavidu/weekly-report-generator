interface ProgressMetricProps { 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  disabled?: boolean;
  required?: boolean;
}

export default function ProgressMetricField({ label, value, onChange, disabled, required }: ProgressMetricProps) {
  const [plan, actual] = value.includes("/") ? value.split("/").map(s => s.replace("%", "").trim()) : ["", ""];
  
  const handleUpdate = (p: string, a: string) => {
    onChange(`${p || "0"}% / ${a || "0"}%`);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-text-main pl-1">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input 
            type="number" min="0" max="100" 
            className="clay-input pl-4 pr-8 py-2.5 w-full text-center font-medium disabled:opacity-50 transition-all focus:border-primary" 
            placeholder="Plan" 
            value={plan} 
            onChange={(e) => handleUpdate(e.target.value, actual)} 
            disabled={disabled}
            required={required}
          />
          <span className="absolute right-3 top-3 text-xs text-text-muted font-black opacity-60">%</span>
        </div>
        <span className="text-text-muted font-black text-lg">/</span>
        <div className="relative flex-1">
          <input 
            type="number" min="0" max="100" 
            className="clay-input pl-4 pr-8 py-2.5 w-full text-center font-medium disabled:opacity-50 border-primary/30 focus:border-primary transition-all bg-primary/5" 
            placeholder="Actual" 
            value={actual} 
            onChange={(e) => handleUpdate(plan, e.target.value)} 
            disabled={disabled}
            required={required}
          />
          <span className="absolute right-3 top-3 text-xs text-primary font-black opacity-80">%</span>
        </div>
      </div>
    </div>
  );
}
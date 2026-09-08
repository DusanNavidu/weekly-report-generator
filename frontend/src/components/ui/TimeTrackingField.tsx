interface TimeTrackingProps { 
  label: string; 
  value: string; 
  onChange: (val: string) => void; 
  disabled?: boolean;
  required?: boolean;
}

export default function TimeTrackingField({ label, value, onChange, disabled, required }: TimeTrackingProps) {
  const [plan, spent] = value.includes("/") ? value.split("/").map(s => s.replace("h", "").trim()) : ["", ""];
  
  const handleUpdate = (p: string, s: string) => {
    onChange(`${p || "0"}h / ${s || "0"}h`);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-text-main pl-1">
        {label} {required && <span className="text-error">*</span>}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <input 
            type="number" min="0" 
            className="clay-input pl-4 pr-10 py-2.5 w-full text-center font-medium disabled:opacity-50 transition-all focus:border-primary" 
            placeholder="Plan" 
            value={plan} 
            onChange={(e) => handleUpdate(e.target.value, spent)} 
            disabled={disabled}
            required={required}
          />
          <span className="absolute right-3 top-3 text-xs text-text-muted font-black opacity-60">hrs</span>
        </div>
        <span className="text-text-muted font-black text-lg">/</span>
        <div className="relative flex-1">
          <input 
            type="number" min="0" 
            className="clay-input pl-4 pr-10 py-2.5 w-full text-center font-medium disabled:opacity-50 border-orange-500/30 focus:border-orange-500 transition-all bg-orange-500/5" 
            placeholder="Spent" 
            value={spent} 
            onChange={(e) => handleUpdate(plan, e.target.value)} 
            disabled={disabled}
            required={required}
          />
          <span className="absolute right-3 top-3 text-xs text-orange-500 font-black opacity-80">hrs</span>
        </div>
      </div>
    </div>
  );
}
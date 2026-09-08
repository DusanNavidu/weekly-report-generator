import { Calendar } from "lucide-react";

interface DatePickerProps { label: string; value: string; onChange: (val: string) => void; disabled?: boolean; required?: boolean; }

export default function DatePickerField({ label, value, onChange, disabled, required }: DatePickerProps) {
  return (
    <div className="flex flex-col gap-1.5 relative">
      <label className="text-sm font-semibold text-text-main pl-1">{label} {required && <span className="text-error">*</span>}</label>
      <div className="relative">
        <input type="date" className="clay-input px-4 py-3 w-full pr-10 disabled:opacity-50" value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} required={required} />
        <Calendar size={18} className="absolute right-3 top-3.5 text-text-muted pointer-events-none" />
      </div>
    </div>
  );
}
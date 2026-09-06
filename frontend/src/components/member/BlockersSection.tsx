import { Plus, Trash2, AlertCircle } from "lucide-react";
import { IssueRecord } from "../../service/report";

interface Props {
  blockers: IssueRecord[];
  isEditable: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string, isKey?: boolean) => void;
}

export default function BlockersSection({ blockers, isEditable, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-border/50 pb-2">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><AlertCircle size={20} className="text-warning" /> Blockers / Challenges</h2>
        {isEditable && <button type="button" onClick={onAdd} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={16} /> Add Blocker</button>}
      </div>
      {blockers.map((blocker, index) => (
        <div key={index} className="flex items-center gap-4">
          <input type="text" className="clay-input flex-1 px-4 py-3 disabled:opacity-50" value={blocker.description} onChange={(e) => onUpdate(index, e.target.value)} disabled={!isEditable} />
          <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
            <input type="radio" name="keyIssue" checked={blocker.isKeyIssue} onChange={() => onUpdate(index, blocker.description, true)} disabled={!isEditable} /> Key Issue
          </label>
          {isEditable && <button type="button" onClick={() => onRemove(index)} className="text-error p-2 hover:bg-error/10 rounded-lg"><Trash2 size={18} /></button>}
        </div>
      ))}
      {blockers.length === 0 && <p className="text-sm text-text-muted italic">No blockers recorded.</p>}
    </div>
  );
}
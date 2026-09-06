import { Plus, Trash2, Award } from "lucide-react";
import { AchievementRecord } from "../../service/report";

interface Props {
  achievements: AchievementRecord[];
  isEditable: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, value: string, isKey?: boolean) => void;
}

export default function AchievementsSection({ achievements, isEditable, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-border/50 pb-2">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><Award size={20} className="text-success" /> Achievements</h2>
        {isEditable && <button type="button" onClick={onAdd} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={16} /> Add Achievement</button>}
      </div>
      {achievements.map((ach, index) => (
        <div key={index} className="flex items-center gap-4">
          <input type="text" className="clay-input flex-1 px-4 py-3 disabled:opacity-50" value={ach.description} onChange={(e) => onUpdate(index, e.target.value)} disabled={!isEditable} />
          <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
            <input type="radio" name="keyAchievement" checked={ach.isKeyAchievement} onChange={() => onUpdate(index, ach.description, true)} disabled={!isEditable} /> Key Achievement
          </label>
          {isEditable && <button type="button" onClick={() => onRemove(index)} className="text-error p-2 hover:bg-error/10 rounded-lg"><Trash2 size={18} /></button>}
        </div>
      ))}
      {achievements.length === 0 && <p className="text-sm text-text-muted italic">No achievements recorded.</p>}
    </div>
  );
}
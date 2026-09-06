import { Plus, Trash2 } from "lucide-react";
import InputField from "../ui/InputField";
import { TaskRecord } from "../../service/report";

interface Props {
  tasks: TaskRecord[];
  isEditable: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof TaskRecord, value: string) => void;
}

export default function TasksSection({ tasks, isEditable, onAdd, onRemove, onUpdate }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-border/50 pb-2">
        <h2 className="text-xl font-bold text-text-main">Tasks Completed</h2>
        {isEditable && <button type="button" onClick={onAdd} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={16} /> Add Task</button>}
      </div>
      {tasks.map((task, index) => (
        <div key={index} className="p-4 bg-background/50 rounded-xl border border-border/50 shadow-inner relative group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isEditable && <button type="button" onClick={() => onRemove(index)} className="absolute -top-3 -right-3 p-1.5 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>}
          <InputField label="Task Name" value={task.taskName} onChange={(e) => onUpdate(index, 'taskName', e.target.value)} disabled={!isEditable} />
          <InputField label="Plan vs Actual %" value={task.plannedVsActualPercentage} onChange={(e) => onUpdate(index, 'plannedVsActualPercentage', e.target.value)} disabled={!isEditable} />
          <InputField label="Plan vs Spent Time" value={task.plannedVsSpentTime} onChange={(e) => onUpdate(index, 'plannedVsSpentTime', e.target.value)} disabled={!isEditable} />
          <InputField label="Output / Deliverable" value={task.output} onChange={(e) => onUpdate(index, 'output', e.target.value)} disabled={!isEditable} />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-main pl-1">Priority</label>
            <select className="clay-input px-4 py-3 disabled:opacity-50" value={task.priority} onChange={(e) => onUpdate(index, 'priority', e.target.value)} disabled={!isEditable}>
              <option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-main pl-1">Status</label>
            <select className="clay-input px-4 py-3 disabled:opacity-50" value={task.taskStatus} onChange={(e) => onUpdate(index, 'taskStatus', e.target.value)} disabled={!isEditable}>
              <option value="COMPLETED">Completed</option><option value="IN_PROGRESS">In Progress</option><option value="BLOCKED">Blocked</option>
            </select>
          </div>
        </div>
      ))}
      {tasks.length === 0 && <p className="text-sm text-text-muted italic">No tasks added.</p>}
    </div>
  );
}
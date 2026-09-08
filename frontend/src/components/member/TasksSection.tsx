import { Plus, Trash2, Target } from "lucide-react";
import InputField from "../ui/InputField";
import SelectField from "../ui/SelectField";
import ProgressMetricField from "../ui/ProgressMetricField";
import TimeTrackingField from "../ui/TimeTrackingField";
import { TaskRecord } from "../../service/report";

interface Props {
  tasks: TaskRecord[];
  isEditable: boolean;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onUpdate: (index: number, field: keyof TaskRecord, value: string) => void;
}

export default function TasksSection({ tasks, isEditable, onAdd, onRemove, onUpdate }: Props) {
  const priorityOptions = [ { value: "HIGH", label: "High" }, { value: "MEDIUM", label: "Medium" }, { value: "LOW", label: "Low" } ];
  const statusOptions = [ { value: "COMPLETED", label: "Completed" }, { value: "IN_PROGRESS", label: "In Progress" }, { value: "BLOCKED", label: "Blocked" } ];

  return (
    <div className="space-y-6">
      
      <div className="flex justify-between items-center border-b border-border/50 pb-3">
        <h2 className="text-xl font-bold text-text-main flex items-center gap-2">
           <Target className="text-primary" size={22} /> Tasks Completed
        </h2>
        {isEditable && (
          <button type="button" onClick={onAdd} className="clay-btn px-4 py-2 text-sm font-bold flex items-center gap-2">
            <Plus size={16} /> Add Task
          </button>
        )}
      </div>

      <div className="space-y-6">
        {tasks.map((task, index) => (
          <div key={index} className="p-6 bg-surface/40 rounded-2xl border border-border/60 shadow-sm relative group transition-all hover:border-border hover:shadow-md">
            
            {isEditable && (
              <button 
                type="button" 
                onClick={() => onRemove(index)} 
                className="absolute -top-3 -right-3 p-2 bg-error text-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 hover:bg-red-600"
                title="Remove Task"
              >
                <Trash2 size={16} />
              </button>
            )}
            
            <div className="absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center bg-primary text-white font-black text-sm rounded-xl shadow-md">
              {index + 1}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
              
              <div className="md:col-span-2">
                <InputField label="Task Name" value={task.taskName} onChange={(e) => onUpdate(index, 'taskName', e.target.value)} disabled={!isEditable} required={true} />
              </div>
              
              <ProgressMetricField label="Plan vs Actual (%)" value={task.plannedVsActualPercentage} onChange={(val) => onUpdate(index, 'plannedVsActualPercentage', val)} disabled={!isEditable} required={true} />
              <TimeTrackingField label="Plan vs Spent (Hours)" value={task.plannedVsSpentTime} onChange={(val) => onUpdate(index, 'plannedVsSpentTime', val)} disabled={!isEditable} required={true} />
              
              <SelectField label="Priority" value={task.priority} onChange={(val) => onUpdate(index, 'priority', val)} options={priorityOptions} disabled={!isEditable} required={true} />
              <SelectField label="Status" value={task.taskStatus} onChange={(val) => onUpdate(index, 'taskStatus', val)} options={statusOptions} disabled={!isEditable} required={true} />
              
              <div className="md:col-span-2">
                 <InputField label="Output / Deliverable" value={task.output} onChange={(e) => onUpdate(index, 'output', e.target.value)} disabled={!isEditable} required={true} />
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="p-8 text-center bg-background/50 rounded-2xl border border-dashed border-border/50 text-text-muted font-medium">
          No tasks added yet. Click "Add Task" to get started.
        </div>
      )}
    </div>
  );
}
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, Send, AlertCircle, Award } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchProjects } from "../../store/slices/projectSlice";
import { submitNewReport } from "../../store/slices/reportSlice";
import InputField from "../../components/ui/InputField";
import { ReportRequestDto, TaskRecord, IssueRecord, AchievementRecord } from "../../service/report";
import { useNavigate } from "react-router-dom";

export default function CreateReport() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects } = useAppSelector((state) => state.projects);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  // Form States
  const [projectId, setProjectId] = useState("");
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekEndDate, setWeekEndDate] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState<TaskRecord[]>([]);
  const [tasksPlannedForNextWeek, setTasksPlannedForNextWeek] = useState<string[]>([""]);
  const [blockers, setBlockers] = useState<IssueRecord[]>([]);
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [notes, setNotes] = useState("");

  // Dynamic Array Handlers
  const addTask = () => setTasksCompleted([...tasksCompleted, { taskName: "", priority: "MEDIUM", plannedVsActualPercentage: "", taskStatus: "IN_PROGRESS", plannedVsSpentTime: "", output: "" }]);
  const removeTask = (index: number) => setTasksCompleted(tasksCompleted.filter((_, i) => i !== index));
  const updateTask = (index: number, field: keyof TaskRecord, value: string) => {
    const updated = [...tasksCompleted];
    updated[index] = { ...updated[index], [field]: value };
    setTasksCompleted(updated);
  };

  const addBlocker = () => setBlockers([...blockers, { description: "", isKeyIssue: false }]);
  const updateBlocker = (index: number, value: string, isKey?: boolean) => {
    const updated = [...blockers];
    if (value !== undefined) updated[index].description = value;
    if (isKey !== undefined) {
      updated.forEach(b => b.isKeyIssue = false); // Only one key issue allowed
      updated[index].isKeyIssue = isKey;
    }
    setBlockers(updated);
  };

  const addAchievement = () => setAchievements([...achievements, { description: "", isKeyAchievement: false }]);
  const updateAchievement = (index: number, value: string, isKey?: boolean) => {
    const updated = [...achievements];
    if (value !== undefined) updated[index].description = value;
    if (isKey !== undefined) {
      updated.forEach(a => a.isKeyAchievement = false); // Only one key achievement allowed
      updated[index].isKeyAchievement = isKey;
    }
    setAchievements(updated);
  };

  const handleSave = async (isSubmit: boolean) => {
    if (!projectId || !weekStartDate || !weekEndDate) {
      alert("Please fill in the basic details (Project and Dates) before saving.");
      return;
    }

    setIsSubmitting(true);
    const reportData: ReportRequestDto = {
      projectId,
      weekStartDate,
      weekEndDate,
      tasksCompleted,
      tasksPlannedForNextWeek: tasksPlannedForNextWeek.filter(t => t.trim() !== ""),
      blockers,
      achievements,
      notes,
      isSubmit
    };

    try {
      await dispatch(submitNewReport(reportData)).unwrap();
      alert(isSubmit ? "Report Submitted Successfully!" : "Draft Saved!");
      navigate("/member/reports"); // Navigate to my reports list (We will create this next)
    } catch (error) {
      console.error("Failed to save report", error);
      alert("Error saving report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto pb-10">
      
      <div>
        <h1 className="text-3xl font-bold text-text-main text-clay">Create Weekly Report</h1>
        <p className="text-text-muted mt-2 font-medium">Document your progress, challenges, and achievements for the week.</p>
      </div>

      <div className="clay-card p-6 lg:p-8 space-y-8">
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-main pl-1">Project / Category</label>
            <select className="clay-input px-4 py-3 w-full" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
              <option value="">Select a Project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <InputField type="date" label="Week Start Date" value={weekStartDate} onChange={(e) => setWeekStartDate(e.target.value)} required />
          <InputField type="date" label="Week End Date" value={weekEndDate} onChange={(e) => setWeekEndDate(e.target.value)} required />
        </div>

        {/* Section 2: Tasks Completed */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <h2 className="text-xl font-bold text-text-main">Tasks Completed</h2>
            <button type="button" onClick={addTask} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={16}/> Add Task</button>
          </div>
          {tasksCompleted.map((task, index) => (
            <div key={index} className="p-4 bg-background/50 rounded-xl border border-border/50 shadow-inner relative group grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               <button type="button" onClick={() => removeTask(index)} className="absolute -top-3 -right-3 p-1.5 bg-error text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14}/></button>
               <InputField label="Task Name" value={task.taskName} onChange={(e) => updateTask(index, 'taskName', e.target.value)} />
               <InputField label="Plan vs Actual % (e.g. 100/80)" value={task.plannedVsActualPercentage} onChange={(e) => updateTask(index, 'plannedVsActualPercentage', e.target.value)} />
               <InputField label="Plan vs Spent Time (e.g. 10h/12h)" value={task.plannedVsSpentTime} onChange={(e) => updateTask(index, 'plannedVsSpentTime', e.target.value)} />
               <InputField label="Output / Deliverable" value={task.output} onChange={(e) => updateTask(index, 'output', e.target.value)} />
               <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-main pl-1">Priority</label>
                  <select className="clay-input px-4 py-3" value={task.priority} onChange={(e) => updateTask(index, 'priority', e.target.value)}>
                    <option value="HIGH">High</option><option value="MEDIUM">Medium</option><option value="LOW">Low</option>
                  </select>
               </div>
               <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-text-main pl-1">Status</label>
                  <select className="clay-input px-4 py-3" value={task.taskStatus} onChange={(e) => updateTask(index, 'taskStatus', e.target.value)}>
                    <option value="COMPLETED">Completed</option><option value="IN_PROGRESS">In Progress</option><option value="BLOCKED">Blocked</option>
                  </select>
               </div>
            </div>
          ))}
          {tasksCompleted.length === 0 && <p className="text-sm text-text-muted italic">No tasks added yet.</p>}
        </div>

        {/* Section 3: Blockers */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><AlertCircle size={20} className="text-warning"/> Blockers / Challenges</h2>
            <button type="button" onClick={addBlocker} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={16}/> Add Blocker</button>
          </div>
          {blockers.map((blocker, index) => (
            <div key={index} className="flex items-center gap-4">
              <input type="text" className="clay-input flex-1 px-4 py-3" placeholder="Describe the issue..." value={blocker.description} onChange={(e) => updateBlocker(index, e.target.value)} />
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input type="radio" name="keyIssue" checked={blocker.isKeyIssue} onChange={() => updateBlocker(index, blocker.description, true)} /> Key Issue
              </label>
              <button type="button" onClick={() => setBlockers(blockers.filter((_, i) => i !== index))} className="text-error p-2 hover:bg-error/10 rounded-lg"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>

        {/* Section 4: Achievements */}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-border/50 pb-2">
            <h2 className="text-xl font-bold text-text-main flex items-center gap-2"><Award size={20} className="text-success"/> Achievements</h2>
            <button type="button" onClick={addAchievement} className="text-primary text-sm font-bold flex items-center gap-1 hover:underline"><Plus size={16}/> Add Achievement</button>
          </div>
          {achievements.map((ach, index) => (
            <div key={index} className="flex items-center gap-4">
              <input type="text" className="clay-input flex-1 px-4 py-3" placeholder="Describe the achievement..." value={ach.description} onChange={(e) => updateAchievement(index, e.target.value)} />
              <label className="flex items-center gap-2 text-sm font-semibold cursor-pointer">
                <input type="radio" name="keyAchievement" checked={ach.isKeyAchievement} onChange={() => updateAchievement(index, ach.description, true)} /> Key Achievement
              </label>
              <button type="button" onClick={() => setAchievements(achievements.filter((_, i) => i !== index))} className="text-error p-2 hover:bg-error/10 rounded-lg"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-border/50 flex gap-4 justify-end">
          <button onClick={() => handleSave(false)} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold text-text-main bg-background hover:bg-border/50 transition-colors border border-border flex items-center gap-2 shadow-sm">
            <Save size={18} /> Save as Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={isSubmitting} className="clay-btn px-8 py-3 flex items-center gap-2 font-bold bg-primary text-white">
            <Send size={18} /> Submit for Review
          </button>
        </div>

      </div>
    </motion.div>
  );
}
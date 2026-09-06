import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchProjects } from "../../store/slices/projectSlice";
import { submitNewReport } from "../../store/slices/reportSlice";
import { TaskRecord, IssueRecord, AchievementRecord } from "../../service/report";
import InputField from "../../components/ui/InputField";
import PageHeader from "../../components/ui/PageHeader";
import TasksSection from "../../components/member/TasksSection";
import BlockersSection from "../../components/member/BlockersSection";
import AchievementsSection from "../../components/member/AchievementsSection";

export default function CreateReport() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { projects } = useAppSelector((state) => state.projects);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [projectId, setProjectId] = useState("");
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekEndDate, setWeekEndDate] = useState("");
  
  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [blockers, setBlockers] = useState<IssueRecord[]>([]);
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);

  useEffect(() => { dispatch(fetchProjects()); }, [dispatch]);

  const handleSave = async (isSubmit: boolean) => {
    if (!projectId || !weekStartDate || !weekEndDate) return alert("Please fill in basic details.");
    setIsSubmitting(true);
    try {
      await dispatch(submitNewReport({ projectId, weekStartDate, weekEndDate, tasksCompleted: tasks, tasksPlannedForNextWeek: [], blockers, achievements, notes: "", isSubmit })).unwrap();
      navigate("/member/reports");
    } finally { setIsSubmitting(false); }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto pb-10">
      <PageHeader title="Create Weekly Report" description="Document your progress, challenges, and achievements for the week." />
      
      <div className="clay-card p-6 lg:p-8 space-y-8">
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

        <TasksSection tasks={tasks} isEditable={true} onAdd={() => setTasks([...tasks, { taskName: "", priority: "MEDIUM", plannedVsActualPercentage: "", taskStatus: "IN_PROGRESS", plannedVsSpentTime: "", output: "" }])} onRemove={(i) => setTasks(tasks.filter((_, idx) => idx !== i))} onUpdate={(i, f, v) => { const u = [...tasks]; u[i] = { ...u[i], [f]: v }; setTasks(u); }} />
        <BlockersSection blockers={blockers} isEditable={true} onAdd={() => setBlockers([...blockers, { description: "", isKeyIssue: false }])} onRemove={(i) => setBlockers(blockers.filter((_, idx) => idx !== i))} onUpdate={(i, v, k) => { const u = [...blockers]; if(v !== undefined) u[i].description = v; if(k !== undefined) { u.forEach(b => b.isKeyIssue = false); u[i].isKeyIssue = k; } setBlockers(u); }} />
        <AchievementsSection achievements={achievements} isEditable={true} onAdd={() => setAchievements([...achievements, { description: "", isKeyAchievement: false }])} onRemove={(i) => setAchievements(achievements.filter((_, idx) => idx !== i))} onUpdate={(i, v, k) => { const u = [...achievements]; if(v !== undefined) u[i].description = v; if(k !== undefined) { u.forEach(a => a.isKeyAchievement = false); u[i].isKeyAchievement = k; } setAchievements(u); }} />

        <div className="pt-6 border-t border-border/50 flex gap-4 justify-end">
          <button onClick={() => handleSave(false)} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold text-text-main bg-background border border-border flex items-center gap-2"><Save size={18} /> Save as Draft</button>
          <button onClick={() => handleSave(true)} disabled={isSubmitting} className="clay-btn px-8 py-3 flex items-center gap-2 font-bold bg-primary text-white"><Send size={18} /> Submit for Review</button>
        </div>
      </div>
    </motion.div>
  );
}
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, Send, AlertCircle, Lock } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchProjects } from "../../store/slices/projectSlice";
import { editReport } from "../../store/slices/reportSlice";
import { getReportByIdAPI, Report, ReportRequestDto, TaskRecord, IssueRecord, AchievementRecord } from "../../service/report";

// UI Components
import InputField from "../../components/ui/InputField";
import PageHeader from "../../components/ui/PageHeader";

// Member Sections
import TasksSection from "../../components/member/TasksSection";
import BlockersSection from "../../components/member/BlockersSection";
import AchievementsSection from "../../components/member/AchievementsSection";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects } = useAppSelector((state) => state.projects);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [originalReport, setOriginalReport] = useState<Report | null>(null);

  // Form States
  const [projectId, setProjectId] = useState("");
  const [weekStartDate, setWeekStartDate] = useState("");
  const [weekEndDate, setWeekEndDate] = useState("");
  const [tasksCompleted, setTasksCompleted] = useState<TaskRecord[]>([]);
  const [tasksPlannedForNextWeek, setTasksPlannedForNextWeek] = useState<string[]>([]);
  const [blockers, setBlockers] = useState<IssueRecord[]>([]);
  const [achievements, setAchievements] = useState<AchievementRecord[]>([]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    dispatch(fetchProjects());
    if (id) loadReport(id);
  }, [dispatch, id]);

  const loadReport = async (reportId: string) => {
    try {
      const report = await getReportByIdAPI(reportId);
      setOriginalReport(report);
      setProjectId(report.projectId);
      setWeekStartDate(new Date(report.weekStartDate).toISOString().split('T')[0]);
      setWeekEndDate(new Date(report.weekEndDate).toISOString().split('T')[0]);
      setTasksCompleted(report.tasksCompleted || []);
      setTasksPlannedForNextWeek(report.tasksPlannedForNextWeek || []);
      setBlockers(report.blockers || []);
      setAchievements(report.achievements || []);
      setNotes(report.notes || "");
    } catch (error) {
      console.error("Failed to load report", error);
      alert("Failed to load report details.");
      navigate("/member/reports");
    } finally {
      setIsLoading(false);
    }
  };

  // Status Checks (Editable only if Draft or Needs Correction)
  const isEditable = originalReport?.status === "DRAFT" || originalReport?.status === "NEEDS_CORRECTION";

  // Dynamic Array Handlers
  const addTask = () => isEditable && setTasksCompleted([...tasksCompleted, { taskName: "", priority: "MEDIUM", plannedVsActualPercentage: "", taskStatus: "IN_PROGRESS", plannedVsSpentTime: "", output: "" }]);
  const removeTask = (index: number) => isEditable && setTasksCompleted(tasksCompleted.filter((_, i) => i !== index));
  const updateTask = (index: number, field: keyof TaskRecord, value: string) => {
    if (!isEditable) return;
    const updated = [...tasksCompleted];
    updated[index] = { ...updated[index], [field]: value };
    setTasksCompleted(updated);
  };

  const addBlocker = () => isEditable && setBlockers([...blockers, { description: "", isKeyIssue: false }]);
  const removeBlocker = (index: number) => isEditable && setBlockers(blockers.filter((_, i) => i !== index));
  const updateBlocker = (index: number, value: string, isKey?: boolean) => {
    if (!isEditable) return;
    const updated = [...blockers];
    if (value !== undefined) updated[index].description = value;
    if (isKey !== undefined) {
      updated.forEach(b => b.isKeyIssue = false);
      updated[index].isKeyIssue = isKey;
    }
    setBlockers(updated);
  };

  const addAchievement = () => isEditable && setAchievements([...achievements, { description: "", isKeyAchievement: false }]);
  const removeAchievement = (index: number) => isEditable && setAchievements(achievements.filter((_, i) => i !== index));
  const updateAchievement = (index: number, value: string, isKey?: boolean) => {
    if (!isEditable) return;
    const updated = [...achievements];
    if (value !== undefined) updated[index].description = value;
    if (isKey !== undefined) {
      updated.forEach(a => a.isKeyAchievement = false);
      updated[index].isKeyAchievement = isKey;
    }
    setAchievements(updated);
  };

  const handleUpdate = async (isSubmit: boolean) => {
    if (!id || !isEditable) return;
    setIsSubmitting(true);
    
    const reportData: ReportRequestDto = {
      projectId, weekStartDate, weekEndDate, tasksCompleted,
      tasksPlannedForNextWeek: tasksPlannedForNextWeek.filter(t => t.trim() !== ""),
      blockers, achievements, notes, isSubmit
    };

    try {
      await dispatch(editReport({ id, data: reportData })).unwrap();
      alert(isSubmit ? "Report Resubmitted Successfully!" : "Draft Updated!");
      navigate("/member/reports");
    } catch (error) {
      console.error("Failed to update report", error);
      alert("Error updating report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto pb-10">
      
      {/* Refactored PageHeader with Dynamic Children */}
      <PageHeader 
        backTo="/member/reports"
        title={
          <div className="flex items-center gap-3">
            {isEditable ? "Edit Weekly Report" : "View Weekly Report"}
            {!isEditable && <span className="bg-background border border-border/50 text-text-muted px-3 py-1 rounded-full text-sm flex items-center gap-1"><Lock size={14}/> Read Only</span>}
          </div>
        }
      >
        <div className="px-4 py-2 bg-background/50 border border-border/50 rounded-xl shadow-inner font-bold text-sm text-text-muted">
          Current Status: <span className="text-primary">{originalReport?.status.replace("_", " ")}</span>
        </div>
      </PageHeader>

      {/* Manager Feedback Banner */}
      {originalReport?.status === "NEEDS_CORRECTION" && originalReport.latestManagerComment && (
        <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-r-xl">
          <h3 className="font-bold text-warning flex items-center gap-2 mb-1"><AlertCircle size={18}/> Manager's Feedback for Correction</h3>
          <p className="text-warning text-sm font-medium">{originalReport.latestManagerComment}</p>
        </div>
      )}

      <div className="clay-card p-6 lg:p-8 space-y-8">
        
        {/* Section 1: Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-main pl-1">Project / Category</label>
            <select className="clay-input px-4 py-3 w-full disabled:opacity-50" value={projectId} onChange={(e) => setProjectId(e.target.value)} disabled={!isEditable}>
              <option value="">Select a Project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <InputField type="date" label="Week Start Date" value={weekStartDate} onChange={(e) => setWeekStartDate(e.target.value)} disabled={!isEditable} />
          <InputField type="date" label="Week End Date" value={weekEndDate} onChange={(e) => setWeekEndDate(e.target.value)} disabled={!isEditable} />
        </div>

        {/* Reusable Sections */}
        <TasksSection 
          tasks={tasksCompleted} 
          isEditable={isEditable} 
          onAdd={addTask} 
          onRemove={removeTask} 
          onUpdate={updateTask} 
        />

        <BlockersSection 
          blockers={blockers} 
          isEditable={isEditable} 
          onAdd={addBlocker} 
          onRemove={removeBlocker} 
          onUpdate={updateBlocker} 
        />

        <AchievementsSection 
          achievements={achievements} 
          isEditable={isEditable} 
          onAdd={addAchievement} 
          onRemove={removeAchievement} 
          onUpdate={updateAchievement} 
        />

        {/* Actions (Only visible if Editable) */}
        {isEditable && (
          <div className="pt-6 border-t border-border/50 flex gap-4 justify-end">
            <button onClick={() => handleUpdate(false)} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold text-text-main bg-background hover:bg-border/50 transition-colors border border-border flex items-center gap-2 shadow-sm">
              <Save size={18} /> Update Draft
            </button>
            <button onClick={() => handleUpdate(true)} disabled={isSubmitting} className="clay-btn px-8 py-3 flex items-center gap-2 font-bold bg-primary text-white">
              <Send size={18} /> Resubmit for Review
            </button>
          </div>
        )}

      </div>
    </motion.div>
  );
}
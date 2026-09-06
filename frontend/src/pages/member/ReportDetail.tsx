import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Save, Send, AlertCircle, Lock, Edit, Trash2, X, ArrowLeft, Info } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchProjects } from "../../store/slices/projectSlice";
import { editReport, deleteReport } from "../../store/slices/reportSlice";
import { getReportByIdAPI, Report, ReportRequestDto, TaskRecord, IssueRecord, AchievementRecord } from "../../service/report";
import { useAlert } from "../../hooks/useAlert";

import InputField from "../../components/ui/InputField";
import PageHeader from "../../components/ui/PageHeader";
import TasksSection from "../../components/member/TasksSection";
import BlockersSection from "../../components/member/BlockersSection";
import AchievementsSection from "../../components/member/AchievementsSection";

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const { projects } = useAppSelector((state) => state.projects);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Editing Mode States
  const [originalReport, setOriginalReport] = useState<Report | null>(null);
  const [isEditingMode, setIsEditingMode] = useState(false);

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
      alert.showError("Failed to load report", "Something went wrong. Please try again.");
      navigate("/member/reports");
    } finally {
      setIsLoading(false);
    }
  };

  // ================= RULES & LOGIC =================
  const currentStatus = originalReport?.status;
  
  // Rule 2: Editable ONLY if Draft or Needs Correction
  const isEditableStatus = currentStatus === "DRAFT" || currentStatus === "NEEDS_CORRECTION";
  
  // Rule 1: Fields are enabled ONLY if status is editable AND user clicked "Enable Editing"
  const isFieldsEnabled = isEditableStatus && isEditingMode;

  // Rule 3: Delete ONLY allowed when status is DRAFT
  const canDelete = currentStatus === "DRAFT";
  // ==================================================

  // Cancel Editing & Reset Data
  const handleCancelEdit = () => {
    setIsEditingMode(false);
    if (originalReport) {
      setProjectId(originalReport.projectId);
      setWeekStartDate(new Date(originalReport.weekStartDate).toISOString().split('T')[0]);
      setWeekEndDate(new Date(originalReport.weekEndDate).toISOString().split('T')[0]);
      setTasksCompleted(originalReport.tasksCompleted || []);
      setBlockers(originalReport.blockers || []);
      setAchievements(originalReport.achievements || []);
    }
  };

  // Dynamic Array Handlers
  const addTask = () => isFieldsEnabled && setTasksCompleted([...tasksCompleted, { taskName: "", priority: "MEDIUM", plannedVsActualPercentage: "", taskStatus: "IN_PROGRESS", plannedVsSpentTime: "", output: "" }]);
  const removeTask = (index: number) => isFieldsEnabled && setTasksCompleted(tasksCompleted.filter((_, i) => i !== index));
  const updateTask = (index: number, field: keyof TaskRecord, value: string) => {
    if (!isFieldsEnabled) return;
    const updated = [...tasksCompleted];
    updated[index] = { ...updated[index], [field]: value };
    setTasksCompleted(updated);
  };

  const addBlocker = () => isFieldsEnabled && setBlockers([...blockers, { description: "", isKeyIssue: false }]);
  const removeBlocker = (index: number) => isFieldsEnabled && setBlockers(blockers.filter((_, i) => i !== index));
  const updateBlocker = (index: number, value: string, isKey?: boolean) => {
    if (!isFieldsEnabled) return;
    const updated = [...blockers];
    if (value !== undefined) updated[index].description = value;
    if (isKey !== undefined) {
      updated.forEach(b => b.isKeyIssue = false);
      updated[index].isKeyIssue = isKey;
    }
    setBlockers(updated);
  };

  const addAchievement = () => isFieldsEnabled && setAchievements([...achievements, { description: "", isKeyAchievement: false }]);
  const removeAchievement = (index: number) => isFieldsEnabled && setAchievements(achievements.filter((_, i) => i !== index));
  const updateAchievement = (index: number, value: string, isKey?: boolean) => {
    if (!isFieldsEnabled) return;
    const updated = [...achievements];
    if (value !== undefined) updated[index].description = value;
    if (isKey !== undefined) {
      updated.forEach(a => a.isKeyAchievement = false);
      updated[index].isKeyAchievement = isKey;
    }
    setAchievements(updated);
  };

  const handleDelete = async () => {
    if (!id || !canDelete) return;
    const isConfirmed = await alert.confirmAction(
      "Delete Report?",
      "Are you sure you want to delete this report? This action cannot be undone.",
      "Yes, Delete"
    );
    if (isConfirmed) {
      try {
        await dispatch(deleteReport(id)).unwrap();
        alert.toast("Report deleted successfully!", "success");
        navigate("/member/reports");
      } catch (error) {
        alert.showError("Failed to delete", "Could not delete the report. Please try again.");
      }
    }
  };

  const handleUpdate = async (isSubmit: boolean) => {
    if (!id || !isFieldsEnabled) return;

    if (!projectId || !weekStartDate || !weekEndDate) {
      alert.showError("Missing Details", "Please select a Project and set the dates.");
      return;
    }

    setIsSubmitting(true);
    
    const formattedBlockers = blockers.map(b => ({
      description: b.description || "",
      isKeyIssue: !!b.isKeyIssue
    }));

    const formattedAchievements = achievements.map(a => ({
      description: a.description || "",
      isKeyAchievement: !!a.isKeyAchievement
    }));

    const reportData: ReportRequestDto = {
      projectId,
      weekStartDate: weekStartDate.split('T')[0],
      weekEndDate: weekEndDate.split('T')[0],
      tasksCompleted,
      tasksPlannedForNextWeek: tasksPlannedForNextWeek.filter(t => t.trim() !== ""),
      blockers: formattedBlockers,
      achievements: formattedAchievements,
      notes: notes || "",
      isSubmit
    };

    try {
      await dispatch(editReport({ id, data: reportData })).unwrap();
      
      if (isSubmit) {
        alert.toast("Report resubmitted for review!", "success");    
        navigate("/member/reports");
      } else {
        alert.toast("Draft updated successfully!", "success");
        setIsEditingMode(false); 
        loadReport(id); 
      }
    } catch (error: any) {
      console.error("Failed to update report", error);
      alert.showError("Failed to update", error.message || "Something went wrong.");  
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto pb-10">
      
      <PageHeader 
        title={
          <div className="flex items-center gap-3">
            {isEditableStatus ? "Weekly Report Details" : "View Weekly Report"}
            {!isFieldsEnabled && <span className="bg-background border border-border/50 text-text-muted px-3 py-1 rounded-full text-sm flex items-center gap-1"><Lock size={14}/> Read Only</span>}
          </div>
        }
      >
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/member/reports")} className="text-text-muted hover:text-text-main font-bold flex items-center gap-2 transition-colors">
            <ArrowLeft size={16}/> Back
          </button>
          <div className="px-4 py-2 bg-background/50 border border-border/50 rounded-xl shadow-inner font-bold text-sm text-text-muted">
            Current Status: <span className="text-primary">{currentStatus?.replace("_", " ")}</span>
          </div>
        </div>
      </PageHeader>

      {/* Rule 4: Display explicit reason if report is locked */}
      {!isEditableStatus && (
        <div className="bg-blue-500/10 border-l-4 border-blue-500 p-4 rounded-r-xl flex items-start gap-3">
          <Info size={24} className="text-blue-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-blue-500 text-lg">Report Locked</h3>
            <p className="text-blue-400 font-medium mt-1">
              {currentStatus === "SUBMITTED" 
                ? "This report is currently under review by the manager. You cannot edit or submit changes at this time." 
                : "This report has been approved by the manager and is permanently locked."}
            </p>
          </div>
        </div>
      )}

      {/* Manager Feedback Banner */}
      {currentStatus === "NEEDS_CORRECTION" && originalReport?.latestManagerComment && (
        <div className="bg-warning/10 border-l-4 border-warning p-4 rounded-r-xl">
          <h3 className="font-bold text-warning flex items-center gap-2 mb-1"><AlertCircle size={18}/> Manager's Feedback for Correction</h3>
          <p className="text-warning text-sm font-medium">{originalReport.latestManagerComment}</p>
        </div>
      )}

      <div className={`clay-card p-6 lg:p-8 space-y-8 transition-opacity duration-300 ${!isFieldsEnabled ? 'opacity-90' : ''}`}>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-text-main pl-1">Project / Category</label>
            <select className="clay-input px-4 py-3 w-full disabled:opacity-50 disabled:cursor-not-allowed" value={projectId} onChange={(e) => setProjectId(e.target.value)} disabled={!isFieldsEnabled}>
              <option value="">Select a Project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <InputField type="date" label="Week Start Date" value={weekStartDate} onChange={(e) => setWeekStartDate(e.target.value)} disabled={!isFieldsEnabled} />
          <InputField type="date" label="Week End Date" value={weekEndDate} onChange={(e) => setWeekEndDate(e.target.value)} disabled={!isFieldsEnabled} />
        </div>

        <TasksSection tasks={tasksCompleted} isEditable={isFieldsEnabled} onAdd={addTask} onRemove={removeTask} onUpdate={updateTask} />
        <BlockersSection blockers={blockers} isEditable={isFieldsEnabled} onAdd={addBlocker} onRemove={removeBlocker} onUpdate={updateBlocker} />
        <AchievementsSection achievements={achievements} isEditable={isFieldsEnabled} onAdd={addAchievement} onRemove={removeAchievement} onUpdate={updateAchievement} />

        {/* Action Area based on Rules */}
        <div className="pt-6 border-t border-border/50 flex flex-col sm:flex-row gap-4 items-center justify-between">
          
          {/* Rule 4: If not editable at all, show lock message instead of buttons */}
          {!isEditableStatus ? (
            <div className="w-full flex justify-center text-text-muted font-semibold items-center gap-2">
              <Lock size={16} /> Read Only View
            </div>
          ) : !isEditingMode ? (
            /* Rule 1: If editable but not in editing mode, show 'Enable Editing' and 'Delete' */
            <div className="w-full flex justify-between items-center">
               <div>
                 {canDelete && (
                   <button onClick={handleDelete} className="px-6 py-3 rounded-xl font-bold text-error hover:bg-error/10 transition-colors flex items-center gap-2">
                     <Trash2 size={18} /> Delete Report
                   </button>
                 )}
               </div>
               <button onClick={() => setIsEditingMode(true)} className="clay-btn px-8 py-3 flex items-center gap-2 font-bold bg-primary text-white">
                 <Edit size={18} /> Enable Editing
               </button>
            </div>
          ) : (
             /* Edit Mode is Active: Show Update and Submit buttons */
             <div className="w-full flex justify-end gap-3">
                <button onClick={handleCancelEdit} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold text-text-muted hover:bg-background border border-border transition-colors flex items-center gap-2">
                  <X size={18} /> Cancel
                </button>
                <button onClick={() => handleUpdate(false)} disabled={isSubmitting} className="px-6 py-3 rounded-xl font-bold text-text-main bg-background hover:bg-border/50 transition-colors border border-border flex items-center gap-2 shadow-sm">
                  <Save size={18} /> Update Draft
                </button>
                <button onClick={() => handleUpdate(true)} disabled={isSubmitting} className="clay-btn px-8 py-3 flex items-center gap-2 font-bold bg-primary text-white">
                  <Send size={18} /> Resubmit for Review
                </button>
             </div>
          )}

        </div>
      </div>
    </motion.div>
  );
}
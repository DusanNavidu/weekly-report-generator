import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getReportByIdAPI, Report } from "../../service/report";
import { submitReportReview } from "../../store/slices/reportSlice";
import { useAlert } from "../../hooks/useAlert";

import PageHeader from "../../components/ui/PageHeader";
import TasksSection from "../../components/member/TasksSection";
import BlockersSection from "../../components/member/BlockersSection";
import AchievementsSection from "../../components/member/AchievementsSection";

export default function ReportReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const { projects } = useAppSelector((state) => state.projects);

  const [report, setReport] = useState<Report | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      getReportByIdAPI(id).then(setReport).catch(() => {
        alert.showError("Error", "Failed to load report.");
        navigate("/manager/reports");
      });
    }
  }, [id, navigate, alert]);

  const handleReview = async (status: "APPROVED" | "NEEDS_CORRECTION") => {
    if (status === "NEEDS_CORRECTION" && !comment.trim()) {
      alert.showError("Comment Required", "Please provide feedback when requesting corrections.");
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(submitReportReview({ id: id!, data: { status, comment } })).unwrap();
      alert.toast(`Report has been ${status === 'APPROVED' ? 'Approved' : 'returned for corrections'}.`, "success");
      navigate("/manager/reports");
    } catch (error) {
      alert.showError("Review Failed", "Could not submit the review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!report) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto pb-10">
      <PageHeader title="Review Report">
        <button onClick={() => navigate("/manager/reports")} className="text-text-muted hover:text-text-main font-bold flex items-center gap-2 transition-colors">
          <ArrowLeft size={16}/> Back to Team Reports
        </button>
      </PageHeader>

      <div className="clay-card p-6 lg:p-8 space-y-8 opacity-95">
        {/* Read-Only Form Sections using your existing components */}
        <TasksSection tasks={report.tasksCompleted} isEditable={false} onAdd={()=>{}} onRemove={()=>{}} onUpdate={()=>{}} />
        <BlockersSection blockers={report.blockers} isEditable={false} onAdd={()=>{}} onRemove={()=>{}} onUpdate={()=>{}} />
        <AchievementsSection achievements={report.achievements} isEditable={false} onAdd={()=>{}} onRemove={()=>{}} onUpdate={()=>{}} />
      </div>

      {/* Manager Review Panel */}
      {report.status === "SUBMITTED" && (
        <div className="clay-card p-6 lg:p-8 border-l-4 border-primary">
          <h3 className="text-xl font-bold text-text-main mb-4">Manager Review</h3>
          <textarea
            className="clay-input w-full p-4 min-h-30 mb-6"
            placeholder="Add your feedback or correction notes here..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <div className="flex justify-end gap-4">
            <button 
              onClick={() => handleReview("NEEDS_CORRECTION")} 
              disabled={isSubmitting}
              className="px-6 py-3 rounded-xl font-bold text-warning bg-warning/10 hover:bg-warning/20 border border-warning/20 transition-colors flex items-center gap-2"
            >
              <AlertCircle size={18} /> Request Corrections
            </button>
            <button 
              onClick={() => handleReview("APPROVED")} 
              disabled={isSubmitting}
              className="clay-btn px-8 py-3 flex items-center gap-2 font-bold bg-success text-white shadow-lg shadow-success/30"
            >
              <CheckCircle size={18} /> Approve Report
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
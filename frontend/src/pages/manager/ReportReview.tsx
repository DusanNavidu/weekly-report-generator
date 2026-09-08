import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  CheckCircle, AlertCircle, ArrowLeft, History, X, 
  ChevronDown, ChevronUp, MessageSquare
} from "lucide-react"; 
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { getReportByIdAPI, Report } from "../../service/report";
import { submitReportReview } from "../../store/slices/reportSlice";
import { useAlert } from "../../hooks/useAlert";

import PageHeader from "../../components/ui/PageHeader";
import OfficialReportViewer from "../../components/manager/OfficialReportViewer";

export default function ReportReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const alert = useAlert();
  const { projects } = useAppSelector((state) => state.projects);

  const [report, setReport] = useState<Report | null>(null);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [expandedVersionIndex, setExpandedVersionIndex] = useState<number | null>(null);

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

  const parseCommentString = (rawString: string) => {
    try {
      if (!rawString.includes(" - ") || !rawString.includes(": ")) return { date: "Unknown Date", status: "INFO", text: rawString };
      const [datePart, rest] = rawString.split(" - ");
      const [status, ...textParts] = rest.split(": ");
      return { date: datePart, status: status.trim(), text: textParts.join(": ").trim() };
    } catch (e) {
      return { date: "", status: "", text: rawString };
    }
  };

  if (!report) return <div className="flex justify-center items-center h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  const projectName = projects.find(p => p.id === report.projectId)?.name;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-full mx-auto pb-10">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/manager/reports")} className="text-text-muted hover:text-text-main font-bold flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back to Team Reports
          </button>
          <PageHeader title="Official Report Viewer"></PageHeader>
        </div>

        <button 
           onClick={() => setShowHistoryModal(true)}
           className="clay-btn px-5 py-2.5 flex items-center gap-2 text-sm font-bold shadow-md"
         >
           <History size={18} /> View History
        </button>
      </div>

      {/* Clean, Read-Only Official Report Format */}
      <OfficialReportViewer data={report} projectName={projectName} />

      {report.status === "SUBMITTED" && (
        <div className="clay-card p-6 lg:p-8 border-l-4 border-primary mt-8">
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

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface border border-border w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
          >
            <div className="p-5 border-b border-border/50 flex justify-between items-center bg-background/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg"><History className="text-primary" size={20}/></div>
                Report Timeline & History
              </h2>
              <button onClick={() => setShowHistoryModal(false)} className="p-2 bg-background hover:bg-error/10 text-text-muted hover:text-error rounded-xl transition-colors">
                <X size={20}/>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-8 custom-scrollbar">
              
              <div>
                <h3 className="font-bold text-text-main mb-4 flex items-center gap-2 text-lg">
                  <MessageSquare size={18} className="text-blue-500" /> Manager Feedback History
                </h3>
                {/* @ts-ignore */}
                {!report?.commentHistory || report.commentHistory.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border/50 bg-background/30 text-center text-text-muted text-sm">
                    No review comments yet.
                  </div>
                ) : (
                  <div className="space-y-4 pl-2 border-l-2 border-border ml-2">
                    {/* @ts-ignore */}
                    {report.commentHistory.map((rawComment: string, idx: number) => {
                      const { date, status, text } = parseCommentString(rawComment);
                      const isApproved = status === "APPROVED";
                      return (
                        <div key={idx} className="relative pl-6">
                          <div className={`absolute -left-7.25 top-1 w-4 h-4 rounded-full border-4 border-surface ${isApproved ? "bg-green-500" : "bg-warning"}`}></div>
                          <div className="bg-background/50 p-4 rounded-xl border border-border/50">
                            <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
                              <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${isApproved ? "bg-green-500/10 text-green-500" : "bg-warning/10 text-warning"}`}>
                                {status.replace("_", " ")}
                              </span>
                              <span className="text-xs text-text-muted font-medium">{date}</span>
                            </div>
                            <p className="text-sm text-text-main mt-1">{text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <hr className="border-border/50" />

              <div>
                <h3 className="font-bold text-text-main mb-4 flex items-center gap-2 text-lg">
                  <History size={18} className="text-primary" /> Previous Versions
                </h3>
                {/* @ts-ignore */}
                {!report?.previousVersions || report.previousVersions.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-border/50 bg-background/30 text-center text-text-muted text-sm">
                    This is the first and only submission. No previous versions exist.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* @ts-ignore */}
                    {report.previousVersions.map((v: any, idx: number) => (
                      <div key={idx} className={`rounded-xl border transition-all duration-300 overflow-hidden ${expandedVersionIndex === idx ? "bg-background/80 border-primary/30 shadow-lg" : "bg-background/40 border-border/50"}`}>
                        
                        <div 
                          className="p-5 cursor-pointer flex justify-between gap-4 hover:bg-background/80 transition-colors"
                          onClick={() => setExpandedVersionIndex(expandedVersionIndex === idx ? null : idx)}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="font-bold text-lg text-primary">Version {v.version}</span>
                              <span className="px-2 py-0.5 bg-surface rounded text-xs font-bold text-text-muted uppercase border border-border/50">{v.status.replace("_", " ")}</span>
                            </div>
                            <p className="text-xs text-text-muted">Saved on: {new Date(v.savedAt).toLocaleString()}</p>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="p-1.5 rounded-full bg-surface text-text-muted transition-colors">
                              {expandedVersionIndex === idx ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </div>
                          </div>
                        </div>

                        {/* Shows Full Details inside History Modal using the new Component */}
                        {expandedVersionIndex === idx && (
                          <div className="p-5 pt-0 border-t border-border/50 animate-in slide-in-from-top-2">
                            <div className="mt-5">
                               <OfficialReportViewer data={v} isHistoryVersion={true} />
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
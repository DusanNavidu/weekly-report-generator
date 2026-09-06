import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, Clock, AlertCircle, CheckCircle, ArrowRight } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMyReports } from "../../store/slices/reportSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import Pagination from "../../components/ui/Pagination";
import { Link, useNavigate } from "react-router-dom";

export default function MyReports() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const { myReports, loading } = useAppSelector((state) => state.reports);
  const { projects } = useAppSelector((state) => state.projects);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchMyReports({ page, size: 5 }));
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, page, projects.length]);

  const getProjectName = (id: string) => {
    const project = projects.find(p => p.id === id);
    return project ? project.name : "Unknown Project";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-500/10 text-gray-400 rounded-full text-xs font-bold"><FileText size={14}/> Draft</span>;
      case "SUBMITTED":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold"><Clock size={14}/> Submitted</span>;
      case "NEEDS_CORRECTION":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-bold"><AlertCircle size={14}/> Needs Correction</span>;
      case "APPROVED":
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold"><CheckCircle size={14}/> Approved</span>;
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main text-clay">My Weekly Reports</h1>
          <p className="text-text-muted mt-2 font-medium">View your submission history and current statuses.</p>
        </div>
        
        <Link to="/member/reports/new" className="clay-btn px-6 py-3 flex items-center justify-center gap-2 font-semibold">
          <Plus size={20} />
          <span>New Report</span>
        </Link>
      </div>

      <div className="clay-card p-6 lg:p-8 flex flex-col min-h-100">
        {loading && !myReports ? (
          <div className="flex justify-center items-center flex-1">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : !myReports || myReports.content.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center flex-1 justify-center border border-border/50 bg-background/50 rounded-2xl">
            <FileText size={48} className="mb-4 text-text-muted opacity-30" />
            <h3 className="text-lg font-bold text-text-main">No reports found</h3>
            <p className="text-text-muted text-sm mt-1 mb-6">You haven't created any weekly reports yet.</p>
            <Link to="/member/reports/new" className="text-primary hover:underline font-bold flex items-center gap-2">
              Create your first report <ArrowRight size={16}/>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 flex-1">
              {myReports.content.map((report, index) => (
                <motion.div 
                  key={report.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-5 bg-background/50 rounded-2xl border border-border/50 shadow-inner flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:border-primary/50 transition-colors group"
                  onClick={() => navigate(`/member/reports/${report.id}`)}
                >
                  <div>
                    <h3 className="font-bold text-text-main text-lg group-hover:text-primary transition-colors">
                      {new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}
                    </h3>
                    <p className="text-sm font-medium text-text-muted mt-1">
                      Project: <span className="text-text-main/80">{getProjectName(report.projectId)}</span>
                    </p>
                    {report.status === 'NEEDS_CORRECTION' && report.latestManagerComment && (
                       <p className="text-sm text-warning mt-2 bg-warning/5 p-2 rounded-lg border border-warning/20">
                         <span className="font-bold">Manager Note:</span> {report.latestManagerComment}
                       </p>
                    )}
                  </div>
                  
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(report.status)}
                    <span className="text-xs font-bold text-text-muted/50">Version: {report.currentVersion}</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6">
              <Pagination 
                currentPage={myReports.currentPage} 
                totalPages={myReports.totalPages} 
                onPageChange={(p) => setPage(p)} 
              />
            </div>
          </>
        )}
      </div>

    </motion.div>
  );
}
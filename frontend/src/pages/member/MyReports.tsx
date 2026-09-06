import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Plus, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchMyReports } from "../../store/slices/reportSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import Pagination from "../../components/ui/Pagination";
import PageHeader from "../../components/ui/PageHeader";
import ReportCard from "../../components/member/ReportCard";

export default function MyReports() {
  const dispatch = useAppDispatch();
  const { myReports, loading } = useAppSelector((state) => state.reports);
  const { projects } = useAppSelector((state) => state.projects);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchMyReports({ page, size: 5 }));
    if (projects.length === 0) dispatch(fetchProjects());
  }, [dispatch, page, projects.length]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto">
      <PageHeader title="My Weekly Reports" description="View your submission history and current statuses.">
        <Link to="/member/reports/new" className="clay-btn px-6 py-3 flex items-center justify-center gap-2 font-semibold">
          <Plus size={20} /><span>New Report</span>
        </Link>
      </PageHeader>

      <div className="clay-card p-6 lg:p-8 flex flex-col min-h-100">
        {loading && !myReports ? (
          <div className="flex justify-center items-center flex-1"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : !myReports || myReports.content.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center flex-1 justify-center bg-background/50 rounded-2xl border border-border/50">
            <FileText size={48} className="mb-4 text-text-muted opacity-30" />
            <h3 className="text-lg font-bold text-text-main">No reports found</h3>
            <Link to="/member/reports/new" className="text-primary hover:underline font-bold flex items-center gap-2 mt-4">Create your first report <ArrowRight size={16}/></Link>
          </div>
        ) : (
          <>
            <div className="space-y-4 flex-1">
              {myReports.content.map((report, index) => (
                <ReportCard key={report.id} report={report} index={index} projects={projects} />
              ))}
            </div>
            <div className="mt-6"><Pagination currentPage={myReports.currentPage} totalPages={myReports.totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </div>
    </motion.div>
  );
}
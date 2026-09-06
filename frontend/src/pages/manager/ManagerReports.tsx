import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchAllReports } from "../../store/slices/reportSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import Pagination from "../../components/ui/Pagination";
import PageHeader from "../../components/ui/PageHeader";
import StatusBadge from "../../components/ui/StatusBadge";

export default function ManagerReports() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { allReports, loading } = useAppSelector((state) => state.reports as any);
  const { projects } = useAppSelector((state) => state.projects);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchAllReports({ page, size: 10 }));
  }, [dispatch, page]);

  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  const getProjectName = (id: string) => {
    return projects.find(p => p.id === id)?.name || "Unknown Project";
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      <PageHeader title="Team Reports Review" description="Review and approve weekly reports submitted by your team." />

      <div className="clay-card p-6 lg:p-8 min-h-100 flex flex-col">
        {loading && !allReports ? (
          <div className="flex justify-center items-center flex-1"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
        ) : !allReports || allReports.content.length === 0 ? (
          <div className="text-center py-16 flex flex-col items-center flex-1 justify-center bg-background/50 rounded-2xl border border-border/50">
            <FileText size={48} className="mb-4 text-text-muted opacity-30" />
            <h3 className="text-lg font-bold text-text-main">No reports found</h3>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/50 text-text-muted text-sm uppercase tracking-wider">
                    <th className="pb-3 font-semibold">Date Range</th>
                    <th className="pb-3 font-semibold">Project</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold">Version</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                  {allReports.content.filter((r: any) => r.status !== 'DRAFT').map((report: any) => (
                    <tr key={report.id} className="hover:bg-background/50 transition-colors group">
                      <td className="py-4 font-bold text-text-main">
                        {new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 text-text-muted font-medium">{getProjectName(report.projectId)}</td>
                      <td className="py-4"><StatusBadge status={report.status} /></td>
                      <td className="py-4 text-text-muted font-bold text-sm">v{report.currentVersion}</td>
                      <td className="py-4 text-right">
                        <button onClick={() => navigate(`/manager/reports/${report.id}`)} className="text-primary font-bold hover:underline flex items-center justify-end gap-1 ml-auto">
                          Review <ArrowRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6"><Pagination currentPage={allReports.currentPage} totalPages={allReports.totalPages} onPageChange={setPage} /></div>
          </>
        )}
      </div>
    </motion.div>
  );
}
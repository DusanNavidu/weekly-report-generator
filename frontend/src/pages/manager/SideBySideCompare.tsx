import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Columns, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchAllReports } from "../../store/slices/reportSlice";
import { fetchProjects } from "../../store/slices/projectSlice";
import { useNavigate } from "react-router-dom";

export default function SideBySideCompare() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { allReports, loading } = useAppSelector((state) => state.reports);
  const [compareType, setCompareType] = useState<"blockers" | "achievements">("blockers");

  useEffect(() => {
    dispatch(fetchAllReports({ page: 0, size: 50 }));
    dispatch(fetchProjects());
  }, [dispatch]);

  const activeReports = allReports?.content?.filter((r: any) => r.status !== 'DRAFT') || [];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-full mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 bg-surface border border-border rounded-xl hover:bg-background transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
              <Columns className="text-primary"/> Team Side-by-Side View
            </h1>
            <p className="text-text-muted text-sm mt-1">Compare team activity for the current reporting cycle.</p>
          </div>
        </div>

        {/* Toggle between Blockers and Achievements */}
        <div className="flex p-1 bg-border/30 rounded-xl">
          <button 
            onClick={() => setCompareType("blockers")}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${compareType === "blockers" ? "bg-surface text-orange-500 shadow-sm" : "text-text-muted hover:text-text-main"}`}
          >
            <AlertCircle size={16}/> Blockers
          </button>
          <button 
            onClick={() => setCompareType("achievements")}
            className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${compareType === "achievements" ? "bg-surface text-green-500 shadow-sm" : "text-text-muted hover:text-text-main"}`}
          >
            <CheckCircle size={16}/> Achievements
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : activeReports.length === 0 ? (
        <div className="text-center py-20 text-text-muted clay-card">No submitted reports found to compare.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeReports.map((report: any) => {
            const dataList = compareType === "blockers" ? report.blockers : report.achievements;
            const isEmpty = !dataList || dataList.length === 0;

            return (
              <div key={report.id} className="clay-card p-6 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                    U 
                  </div>
                  <div>
                    <p className="font-bold text-text-main text-sm">Report v{report.currentVersion}</p>
                    <p className="text-xs text-text-muted">{new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex-1">
                  {isEmpty ? (
                    <p className="text-sm text-text-muted italic text-center mt-4">
                      No {compareType} reported.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      {dataList.map((item: any, idx: number) => (
                        <li key={idx} className={`p-3 rounded-lg text-sm font-medium ${compareType === "blockers" ? "bg-orange-500/10 text-orange-700 dark:text-orange-300" : "bg-green-500/10 text-green-700 dark:text-green-300"}`}>
                          • {item.description}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
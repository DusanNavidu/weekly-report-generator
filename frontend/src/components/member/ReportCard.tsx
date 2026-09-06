import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import StatusBadge from "../ui/StatusBadge";
import { Report } from "../../service/report";
import { Project } from "../../store/slices/projectSlice";

interface ReportCardProps {
  report: Report;
  index: number;
  projects: Project[];
}

export default function ReportCard({ report, index, projects }: ReportCardProps) {
  const navigate = useNavigate();
  const projectName = projects.find(p => p.id === report.projectId)?.name || "Unknown Project";

  return (
    <motion.div
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
          Project: <span className="text-text-main/80">{projectName}</span>
        </p>
        {report.status === 'NEEDS_CORRECTION' && report.latestManagerComment && (
          <p className="text-sm text-warning mt-2 bg-warning/5 p-2 rounded-lg border border-warning/20">
            <span className="font-bold">Manager Note:</span> {report.latestManagerComment}
          </p>
        )}
      </div>
      <div className="flex flex-col items-end gap-2">
        <StatusBadge status={report.status} />
        <span className="text-xs font-bold text-text-muted/50">Version: {report.currentVersion}</span>
      </div>
    </motion.div>
  );
}
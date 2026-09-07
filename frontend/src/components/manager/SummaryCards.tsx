import { motion } from "framer-motion";
import { Users, FolderOpen, FileCheck2, Clock } from "lucide-react";
import { DashboardStatsDto } from "../../service/report";

interface SummaryCardsProps {
  stats: DashboardStatsDto | null;
}

export default function SummaryCards({ stats }: SummaryCardsProps) {
  const statCards = [
    { title: "Total Members", value: stats?.totalMembers || 0, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Projects", value: stats?.activeProjects || 0, icon: FolderOpen, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Total Reports", value: stats?.reportsThisWeek || 0, icon: FileCheck2, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Pending Reviews", value: stats?.pendingReviews || 0, icon: Clock, color: "text-warning", bg: "bg-warning/10" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="clay-card p-6 flex flex-col justify-center gap-4 hover:-translate-y-1 transition-transform duration-300"
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl shadow-inner ${stat.bg} ${stat.color}`}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text-muted">{stat.title}</p>
                <p className="text-3xl font-bold text-text-main mt-1 text-clay">{stat.value}</p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
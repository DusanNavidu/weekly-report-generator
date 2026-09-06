import { motion } from "framer-motion";
import { Users, FolderOpen, FileCheck2, Clock } from "lucide-react";

export default function ManagerDashboard() {
  const stats = [
    { title: "Total Members", value: "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Active Projects", value: "0", icon: FolderOpen, color: "text-indigo-500", bg: "bg-indigo-500/10" },
    { title: "Reports This Week", value: "0", icon: FileCheck2, color: "text-green-500", bg: "bg-green-500/10" },
    { title: "Pending Reviews", value: "0", icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold text-text-main text-clay">Dashboard Overview</h1>
        <p className="text-text-muted mt-2 font-medium">Welcome back! Here is what's happening this week.</p>
      </div>

      {/* Stats Cards with Claymorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="clay-card p-6 flex flex-col justify-center gap-4"
            >
              <div className="flex items-center gap-4">
                {/* Embedded inner shadow box for icons */}
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

      {/* Recent Activity with Claymorphism */}
      <div className="clay-card p-8 mt-8">
        <h2 className="text-xl font-bold text-text-main mb-6 text-clay">Recent Activity</h2>
        <div className="flex flex-col items-center justify-center py-16 text-text-muted bg-background/50 rounded-2xl border border-border/50 inset-shadow-sm">
          <FileCheck2 size={56} className="mb-4 opacity-20" />
          <p className="font-medium">No activity yet. Let's start by adding some Team Members and Projects!</p>
        </div>
      </div>
    </motion.div>
  );
}
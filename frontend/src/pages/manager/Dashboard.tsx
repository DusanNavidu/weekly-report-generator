import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDashboardStatsAPI, DashboardStatsDto } from "../../service/report";
import { useAlert } from "../../hooks/useAlert";

import PageHeader from "../../components/ui/PageHeader";
import SummaryCards from "../../components/manager/SummaryCards";
import StatusPieChart from "../../components/manager/StatusPieChart";
import WorkflowBarChart from "../../components/manager/WorkflowBarChart";

export default function ManagerDashboard() {
  const [stats, setStats] = useState<DashboardStatsDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const alert = useAlert();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getDashboardStatsAPI();
      setStats(data);
    } catch (error) {
      alert.showError("Error", "Could not load dashboard statistics.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const rawDist = stats?.reportStatusDistribution || {};
  const chartData = [
    { name: 'Draft', value: rawDist['DRAFT'] || 0, color: '#9ca3af' }, // Gray
    { name: 'Pending Review', value: rawDist['SUBMITTED'] || 0, color: '#3b82f6' }, // Blue
    { name: 'Needs Correction', value: rawDist['NEEDS_CORRECTION'] || 0, color: '#f59e0b' }, // Orange
    { name: 'Approved', value: rawDist['APPROVED'] || 0, color: '#10b981' } // Green
  ].filter(item => item.value > 0);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl mx-auto">
      
      <PageHeader 
        title="Dashboard Overview" 
        description="Welcome back! Here is a summary of your team's weekly reporting activity." 
      />

      {/* 1. Summary Metric Cards */}
      <SummaryCards stats={stats} />

      {/* 2. Visual Insights & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <StatusPieChart data={chartData} />
        <WorkflowBarChart data={chartData} />
      </div>

    </motion.div>
  );
}
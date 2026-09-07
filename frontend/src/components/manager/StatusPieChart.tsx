import { Activity } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function StatusPieChart({ data }: { data: ChartData[] }) {
  return (
    <div className="clay-card p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="text-primary" size={24} />
        <h2 className="text-xl font-bold text-text-main">Report Status Distribution</h2>
      </div>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-text-muted font-medium bg-background/50 rounded-xl border border-border/50">
          No report data available yet.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={110}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
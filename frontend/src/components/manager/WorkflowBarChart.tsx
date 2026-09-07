import { FileCheck2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

export default function WorkflowBarChart({ data }: { data: ChartData[] }) {
  return (
    <div className="clay-card p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-6">
        <FileCheck2 className="text-indigo-500" size={24} />
        <h2 className="text-xl font-bold text-text-main">Workflow Metrics</h2>
      </div>
      
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-text-muted font-medium bg-background/50 rounded-xl border border-border/50">
          No report data available yet.
        </div>
      ) : (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-muted)', fontSize: 12 }} allowDecimals={false} />
              <Tooltip 
                cursor={{ fill: 'var(--color-background)', opacity: 0.5 }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 6, 6]} barSize={40}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
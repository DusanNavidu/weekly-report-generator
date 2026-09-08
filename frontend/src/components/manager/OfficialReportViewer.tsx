import { Target, ShieldAlert, Award, Star, Calendar, Folder, AlignLeft, CheckCircle2 } from "lucide-react";

interface OfficialReportViewerProps {
  data: any;
  projectName?: string;
  isHistoryVersion?: boolean;
}

export default function OfficialReportViewer({ data, projectName, isHistoryVersion = false }: OfficialReportViewerProps) {
  const tasks = data?.tasksCompleted || [];
  const plannedTasks = data?.tasksPlannedForNextWeek || [];
  const blockers = data?.blockers || [];
  const achievements = data?.achievements || [];
  const notes = data?.notes;

  return (
    <div className={`space-y-8 ${isHistoryVersion ? "p-0" : "clay-card p-6 lg:p-8 bg-surface/50"}`}>
      
      {/* Report Header (Dates & Project) - Only for main report view */}
      {!isHistoryVersion && (
        <div className="flex flex-wrap gap-6 border-b border-border/50 pb-6">
          <div className="flex items-center gap-2">
            <Folder className="text-primary" size={20} />
            <div>
              <p className="text-xs text-text-muted font-bold uppercase">Project / Category</p>
              <p className="font-bold text-text-main">{projectName || data.projectId || "N/A"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 border-l border-border/50 pl-6">
            <Calendar className="text-primary" size={20} />
            <div>
              <p className="text-xs text-text-muted font-bold uppercase">Reporting Period</p>
              <p className="font-bold text-text-main">
                {new Date(data.weekStartDate).toLocaleDateString()} - {new Date(data.weekEndDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 1. Tasks Completed Table */}
      <section>
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
          <Target className="text-primary" size={20} /> Tasks Completed
        </h3>
        {tasks.length === 0 ? (
          <p className="text-sm text-text-muted italic bg-background/50 p-4 rounded-xl border border-dashed border-border/50">No tasks reported.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border/50">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-background border-b border-border/50 text-text-muted uppercase text-xs">
                <tr>
                  <th className="p-3 font-bold">Task Name</th>
                  <th className="p-3 font-bold">Priority</th>
                  <th className="p-3 font-bold">Status</th>
                  <th className="p-3 font-bold">Plan vs Actual %</th>
                  <th className="p-3 font-bold">Time (Plan/Spent)</th>
                  <th className="p-3 font-bold">Deliverable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30 bg-surface">
                {tasks.map((task: any, idx: number) => (
                  <tr key={idx} className="hover:bg-background/30 transition-colors">
                    <td className="p-3 font-bold text-text-main">{task.taskName}</td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-surface border border-border/50 rounded text-xs font-bold">
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 text-primary font-bold">
                      {task.taskStatus ? task.taskStatus.replace("_", " ") : "-"}
                    </td>
                    <td className="p-3">{task.plannedVsActualPercentage || "-"}</td>
                    <td className="p-3">{task.plannedVsSpentTime || "-"}</td>
                    {/* ----------------------------------------------------------- */}
                    <td className="p-3 text-text-muted truncate max-w-50" title={task.output}>
                      {task.output}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 2. Tasks Planned for Next Week */}
      {(!isHistoryVersion || plannedTasks.length > 0) && (
        <section>
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-primary" size={20} /> Planned for Next Week
          </h3>
          {plannedTasks.length === 0 ? (
            <p className="text-sm text-text-muted italic bg-background/50 p-4 rounded-xl border border-dashed border-border/50">No planned tasks reported.</p>
          ) : (
            <ul className="space-y-2 bg-surface p-4 rounded-xl border border-border/50">
              {plannedTasks.map((task: string, idx: number) => (
                <li key={idx} className="text-sm text-text-main flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span> {task}
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* 3. Blockers */}
      <section>
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
          <ShieldAlert className="text-orange-500" size={20} /> Blockers / Challenges
        </h3>
        {blockers.length === 0 ? (
          <p className="text-sm text-text-muted italic bg-background/50 p-4 rounded-xl border border-dashed border-border/50">No blockers reported.</p>
        ) : (
          <div className="grid gap-3">
            {blockers.map((blocker: any, idx: number) => {
              const isKey = blocker.isKeyIssue || blocker.keyIssue;
              return (
                <div key={idx} className={`p-4 rounded-xl border ${isKey ? "bg-orange-500/10 border-orange-500/30" : "bg-surface border-border/50"}`}>
                  <div className="flex justify-between items-start gap-4">
                    <p className={`text-sm ${isKey ? "text-orange-700 dark:text-orange-300 font-medium" : "text-text-main"}`}>
                      {blocker.description}
                    </p>
                    {isKey && (
                      <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow-sm">
                        <Star size={12} className="fill-white" /> Key Issue
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Achievements */}
      <section>
        <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
          <Award className="text-green-500" size={20} /> Achievements / Highlights
        </h3>
        {achievements.length === 0 ? (
          <p className="text-sm text-text-muted italic bg-background/50 p-4 rounded-xl border border-dashed border-border/50">No achievements reported.</p>
        ) : (
          <div className="grid gap-3">
            {achievements.map((achievement: any, idx: number) => {
              const isKey = achievement.isKeyAchievement || achievement.keyAchievement;
              return (
                <div key={idx} className={`p-4 rounded-xl border ${isKey ? "bg-green-500/10 border-green-500/30" : "bg-surface border-border/50"}`}>
                  <div className="flex justify-between items-start gap-4">
                    <p className={`text-sm ${isKey ? "text-green-700 dark:text-green-300 font-medium" : "text-text-main"}`}>
                      {achievement.description}
                    </p>
                    {isKey && (
                      <span className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                        <Star size={12} className="fill-white" /> Key Achievement
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 5. Notes (If available) */}
      {notes && (
        <section>
          <h3 className="text-lg font-bold text-text-main flex items-center gap-2 mb-4">
            <AlignLeft className="text-primary" size={20} /> Additional Notes
          </h3>
          <div className="p-4 bg-background/50 rounded-xl border border-border/50 text-sm text-text-muted whitespace-pre-wrap">
            {notes}
          </div>
        </section>
      )}

    </div>
  );
}
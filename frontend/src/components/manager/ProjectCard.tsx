import { motion } from "framer-motion";
import { FolderKanban, Calendar, Edit2, Trash2 } from "lucide-react";
import { Project } from "../../store/slices/projectSlice";

interface ProjectCardProps {
  project: Project;
  index: number;
  onEdit: (project: Project) => void;
  onDelete: (id: string, name: string) => void;
}

export default function ProjectCard({ project, index, onEdit, onDelete }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      className="bg-background/50 p-6 rounded-2xl border border-border/50 shadow-inner flex flex-col h-full relative group"
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(project)}
          className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-colors"
          title="Edit Project"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(project.id, project.name)}
          className="p-2 bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-colors"
          title="Delete Project"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-3 pr-20">
        <div className="p-2.5 bg-primary/10 text-primary rounded-xl clay-card">
          <FolderKanban size={20} />
        </div>
        <h3 className="font-bold text-lg text-text-main truncate text-clay">{project.name}</h3>
      </div>
      
      <p className="text-sm text-text-muted font-medium mb-6 flex-1">
        {project.description}
      </p>
      
      <div className="flex items-center gap-2 text-xs font-bold text-text-muted/70 pt-4 border-t border-border/50">
        <Calendar size={14} />
        <span>Created: {new Date(project.createdAt).toLocaleDateString()}</span>
      </div>
    </motion.div>
  );
}
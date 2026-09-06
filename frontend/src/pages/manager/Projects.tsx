import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, FolderKanban, Calendar } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchProjects } from "../../store/slices/projectSlice";
import Modal from "../../components/ui/Modal";
import AddProjectForm from "../../components/manager/AddProjectForm";

export default function Projects() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main text-clay">Work Projects</h1>
          <p className="text-text-muted mt-2 font-medium">Manage categories for weekly reporting.</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="clay-btn px-6 py-3 flex items-center justify-center gap-2 font-semibold"
        >
          <FolderPlus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className="clay-card p-6 lg:p-8 min-h-[400px]">
        {loading && projects.length === 0 ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 text-text-muted font-medium bg-background/50 rounded-2xl border border-border/50 inset-shadow-sm flex flex-col items-center">
             <FolderKanban size={48} className="mb-4 opacity-20" />
             No projects found. Create one to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div 
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-background/50 p-6 rounded-2xl border border-border/50 shadow-inner flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-3">
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
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <AddProjectForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>

    </motion.div>
  );
}
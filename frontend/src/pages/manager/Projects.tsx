import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FolderPlus, FolderKanban, Calendar, Edit2, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { fetchProjects, deleteProject, Project } from "../../store/slices/projectSlice";
import Modal from "../../components/ui/Modal";
import AddProjectForm from "../../components/manager/AddProjectForm";
import EditProjectForm from "../../components/manager/EditProjectForm";
import ProjectCard from "../../components/manager/ProjectCard";

export default function Projects() {
  const dispatch = useAppDispatch();
  const { projects, loading } = useAppSelector((state) => state.projects);
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove project "${name}"?`)) {
      dispatch(deleteProject(id));
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-main text-clay">Work Projects</h1>
          <p className="text-text-muted mt-2 font-medium">Manage categories for weekly reporting.</p>
        </div>
        
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="clay-btn px-6 py-3 flex items-center justify-center gap-2 font-semibold"
        >
          <FolderPlus size={20} />
          <span>New Project</span>
        </button>
      </div>

      <div className="clay-card p-6 lg:p-8 min-h-100">
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
              <ProjectCard 
                key={project.id}
                project={project}
                index={index}
                onEdit={setEditingProject}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add Project Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Create New Project">
        <AddProjectForm onSuccess={() => setIsAddModalOpen(false)} />
      </Modal>

      {/* Edit Project Modal */}
      <Modal isOpen={!!editingProject} onClose={() => setEditingProject(null)} title="Edit Project">
        {editingProject && (
          <EditProjectForm 
            project={editingProject} 
            onSuccess={() => setEditingProject(null)} 
            onCancel={() => setEditingProject(null)} 
          />
        )}
      </Modal>

    </motion.div>
  );
}
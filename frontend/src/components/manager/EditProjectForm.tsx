import { useState } from "react";
import { Edit2 } from "lucide-react";
import InputField from "../ui/InputField";
import { useAppDispatch } from "../../hooks/hooks";
import { updateProject, Project } from "../../store/slices/projectSlice";
import { useAlert } from "../../hooks/useAlert";

interface EditProjectFormProps {
  project: Project;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditProjectForm({ project, onSuccess, onCancel }: EditProjectFormProps) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [isUpdating, setIsUpdating] = useState(false);
  const alert = useAlert();
  
  const dispatch = useAppDispatch();

  const handleUpdateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await dispatch(updateProject({ id: project.id, data: { name, description } })).unwrap();
      onSuccess();
      alert.toast("Project updated successfully!", "success");
    } catch (err) {
      alert.showError("Failed to update project", "Something went wrong. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <form onSubmit={handleUpdateProject} className="space-y-4">
      <InputField 
        label="Project Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
      <div className="flex flex-col gap-1.5 w-full mb-4">
        <label className="text-sm font-semibold text-text-main pl-1">Description</label>
        <textarea
          className="clay-input w-full px-4 py-3 text-text-main resize-none h-24"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="pt-4 flex gap-3">
        <button 
          type="button" 
          onClick={onCancel}
          className="w-1/2 py-3 rounded-xl font-semibold text-text-muted hover:bg-background transition-colors border border-border"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={isUpdating} 
          className="clay-btn w-1/2 py-3 flex justify-center items-center font-semibold gap-2"
        >
          {isUpdating ? "Updating..." : <><Edit2 size={18} /> Save Changes</>}
        </button>
      </div>
    </form>
  );
}
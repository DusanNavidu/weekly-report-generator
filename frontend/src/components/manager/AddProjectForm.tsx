import { useState } from "react";
import { FolderPlus } from "lucide-react";
import InputField from "../ui/InputField";
import { useAppDispatch } from "../../hooks/hooks";
import { createProject } from "../../store/slices/projectSlice";

interface AddProjectFormProps {
  onSuccess: () => void;
}

export default function AddProjectForm({ onSuccess }: AddProjectFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  
  const dispatch = useAppDispatch();

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    
    try {
      await dispatch(createProject({ name, description })).unwrap();
      setName("");
      setDescription("");
      onSuccess();
    } catch (err) {
      console.error("Failed to add project", err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleAddProject} className="space-y-4">
      <InputField 
        label="Project Name" 
        placeholder="e.g. Client A / Internal Tooling" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        required 
      />
      <div className="flex flex-col gap-1.5 w-full mb-4">
        <label className="text-sm font-semibold text-text-main pl-1">Description</label>
        <textarea
          className="clay-input w-full px-4 py-3 text-text-main resize-none h-24"
          placeholder="Brief description about the project..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      
      <div className="pt-4">
        <button type="submit" disabled={isAdding} className="clay-btn w-full py-3 flex justify-center items-center font-semibold gap-2">
          {isAdding ? "Adding..." : <><FolderPlus size={18} /> Create Project</>}
        </button>
      </div>
    </form>
  );
}
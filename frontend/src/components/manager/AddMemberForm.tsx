import { useState } from "react";
import { UserPlus } from "lucide-react";
import InputField from "../ui/InputField";
import { addTeamMember } from "../../service/manager";
import { useAlert } from "../../hooks/useAlert";

interface AddMemberFormProps {
  onSuccess: () => void;
}

export default function AddMemberForm({ onSuccess }: AddMemberFormProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState("");
  const alert = useAlert();

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    setError("");
    
    try {
      await addTeamMember({ fullName, email, password, role: "TEAM_MEMBER" });
      setFullName("");
      setEmail("");
      setPassword("");
      onSuccess();
      alert.toast("Member added successfully!", "success");
    } catch (err) {
      alert.showError("Failed to add member", "Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form onSubmit={handleAddMember} className="space-y-4">
      {error && <div className="p-3 bg-error/10 text-error rounded-xl text-sm font-medium">{error}</div>}
      
      <InputField label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
      <InputField label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <InputField label="Temporary Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      
      <div className="pt-4">
        <button type="submit" disabled={isAdding} className="clay-btn w-full py-3 flex justify-center items-center font-semibold gap-2">
          {isAdding ? "Adding..." : <><UserPlus size={18} /> Create Account</>}
        </button>
      </div>
    </form>
  );
}
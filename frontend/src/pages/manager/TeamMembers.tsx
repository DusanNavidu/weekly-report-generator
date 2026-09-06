import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus } from "lucide-react";
import { getTeamMembers, UserDTO, PaginatedResponse } from "../../service/manager";
import Modal from "../../components/ui/Modal";
import AddMemberForm from "../../components/manager/AddMemberForm";
import TeamTable from "../../components/manager/TeamTable";
import { removeTeamMember } from "../../service/manager";
import { useAlert } from "../../hooks/useAlert";

export default function TeamMembers() {
    
    const alert = useAlert();
    const [data, setData] = useState<PaginatedResponse<UserDTO>>({
        content: [], currentPage: 0, totalPages: 0, totalElements: 0
    });
    const [page, setPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchMembers = async (currentPage: number) => {
        try {
            const result = await getTeamMembers(currentPage, 5);
            setData(result);
        } catch (error) {
            console.error("Failed to fetch members", error);
        }
    };

    useEffect(() => {
        fetchMembers(page);
    }, [page]);

    const handleSuccess = () => {
        setIsModalOpen(false); // Close Modal
        setPage(0); // Go to first page
        fetchMembers(0); // Refresh data
        alert.toast("Member added successfully!", "success");
    };

    const handleRemoveMember = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the team?`)) {
      try {
        await removeTeamMember(id);
        alert.toast("Member removed successfully!", "success");
        fetchMembers(page);
      } catch (error) {
        alert.showError("Failed to remove member", "Something went wrong. Please try again.");
      }
    }
  };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main text-clay">Team Members</h1>
                    <p className="text-text-muted mt-2 font-medium">Manage your internal team access and accounts.</p>
                </div>

                {/* Add Member Button triggers Modal */}
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="clay-btn px-6 py-3 flex items-center justify-center gap-2 font-semibold"
                >
                    <UserPlus size={20} />
                    <span>Add Member</span>
                </button>
            </div>

            {/* Main Table Component */}
            <TeamTable data={data} page={page} setPage={setPage} onRemove={handleRemoveMember} />

            {/* Popup Modal for Adding Member */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Member">
                <AddMemberForm onSuccess={handleSuccess} />
            </Modal>

        </motion.div>
    );
}
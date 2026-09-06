import { motion } from "framer-motion";
import { Mail, ShieldAlert } from "lucide-react";
import Pagination from "../ui/Pagination";
import { UserDTO, PaginatedResponse } from "../../service/manager";

interface TeamTableProps {
  data: PaginatedResponse<UserDTO>;
  page: number;
  setPage: (page: number) => void;
}

export default function TeamTable({ data, page, setPage }: TeamTableProps) {
  return (
    <div className="clay-card p-6 lg:p-8 flex flex-col h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-text-main text-clay">Current Roster</h2>
        <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-bold shadow-inner">
          Total: {data.totalElements}
        </span>
      </div>
      
      <div className="space-y-4 flex-1">
        {data.content.length === 0 ? (
          <div className="text-center py-10 text-text-muted font-medium bg-background/50 rounded-2xl border border-border/50 inset-shadow-sm">
            No team members added yet.
          </div>
        ) : (
          data.content.map((member, index) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: index * 0.1 }}
              key={member.id} 
              className="flex items-center justify-between p-4 bg-background/50 rounded-2xl border border-border/50 shadow-inner"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 clay-card flex items-center justify-center text-primary font-bold text-lg shrink-0">
                  {member.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold text-text-main">{member.fullName}</p>
                  <div className="flex items-center gap-1.5 text-sm text-text-muted mt-0.5 font-medium">
                    <Mail size={14} /> {member.email}
                  </div>
                </div>
              </div>
              <div className="hidden sm:flex px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold items-center gap-1">
                <ShieldAlert size={12} /> {member.role.replace("_", " ")}
              </div>
            </motion.div>
          ))
        )}
      </div>

      <Pagination 
        currentPage={data.currentPage} 
        totalPages={data.totalPages} 
        onPageChange={(p) => setPage(p)} 
      />
    </div>
  );
}
import { FileText, Clock, AlertCircle, CheckCircle } from "lucide-react";

export default function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "DRAFT":
      return <span className="flex items-center gap-1.5 px-3 py-1 bg-gray-500/10 text-gray-400 rounded-full text-xs font-bold w-fit"><FileText size={14} /> Draft</span>;
    case "SUBMITTED":
      return <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-500 rounded-full text-xs font-bold w-fit"><Clock size={14} /> Submitted</span>;
    case "NEEDS_CORRECTION":
      return <span className="flex items-center gap-1.5 px-3 py-1 bg-warning/10 text-warning rounded-full text-xs font-bold w-fit"><AlertCircle size={14} /> Needs Correction</span>;
    case "APPROVED":
      return <span className="flex items-center gap-1.5 px-3 py-1 bg-success/10 text-success rounded-full text-xs font-bold w-fit"><CheckCircle size={14} /> Approved</span>;
    default:
      return null;
  }
}
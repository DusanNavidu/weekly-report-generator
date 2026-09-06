import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageHeaderProps {
  title: string | ReactNode;
  description?: string;
  backTo?: string;
  children?: ReactNode;
}

export default function PageHeader({ title, description, backTo, children }: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        {backTo && (
          <button onClick={() => navigate(backTo)} className="text-primary font-bold flex items-center gap-2 mb-2 hover:underline">
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <h1 className="text-3xl font-bold text-text-main text-clay flex items-center gap-3">{title}</h1>
        {description && <p className="text-text-muted mt-2 font-medium">{description}</p>}
      </div>
      {children && <div className="flex items-center gap-3">{children}</div>}
    </div>
  );
}
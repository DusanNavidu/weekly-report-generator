import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, CheckCircle, AlertCircle, Clock, User } from "lucide-react";
import { getTeamMemberProfileAPI } from "../../service/report";
import { useAlert } from "../../hooks/useAlert";
import StatusBadge from "../../components/ui/StatusBadge";

export default function TeamMemberProfile() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const alert = useAlert();
  
  const member = location.state?.member;

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) loadProfile();
  }, [id]);

  const loadProfile = async () => {
    try {
      const data = await getTeamMemberProfileAPI(id!);
      setProfileData(data);
    } catch (error) {
      alert.showError("Error", "Failed to load member profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!member) {
    return <div className="p-8 text-center">User data not found. Please go back to Team Members list.</div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-6xl mx-auto">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 bg-surface border border-border rounded-xl hover:bg-background transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
            <User className="text-primary"/> {member.fullName}'s Profile
          </h1>
          <p className="text-text-muted text-sm">{member.email} • {member.role.replace("_", " ")}</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="clay-card p-5 flex flex-col items-center text-center">
              <FileText className="text-blue-500 mb-2" size={24} />
              <p className="text-2xl font-bold">{profileData?.totalReports}</p>
              <p className="text-xs text-text-muted font-medium uppercase">Total Reports</p>
            </div>
            <div className="clay-card p-5 flex flex-col items-center text-center">
              <CheckCircle className="text-green-500 mb-2" size={24} />
              <p className="text-2xl font-bold">{profileData?.approved}</p>
              <p className="text-xs text-text-muted font-medium uppercase">Approved</p>
            </div>
            <div className="clay-card p-5 flex flex-col items-center text-center">
              <AlertCircle className="text-orange-500 mb-2" size={24} />
              <p className="text-2xl font-bold">{profileData?.needsCorrection}</p>
              <p className="text-xs text-text-muted font-medium uppercase">Needs Correction</p>
            </div>
            <div className="clay-card p-5 flex flex-col items-center text-center">
              <Clock className="text-warning mb-2" size={24} />
              <p className="text-2xl font-bold">{profileData?.pendingReview}</p>
              <p className="text-xs text-text-muted font-medium uppercase">Pending Review</p>
            </div>
          </div>

          {/* Report History Table */}
          <div className="clay-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary"/> Report History
            </h2>
            
            {profileData?.reports?.length === 0 ? (
              <p className="text-center py-10 text-text-muted">No reports submitted by this user yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/50 text-text-muted text-sm uppercase">
                      <th className="pb-3 font-semibold pl-2">Date Range</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Version</th>
                      <th className="pb-3 font-semibold text-right pr-2">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {profileData?.reports?.map((report: any) => (
                      <tr key={report.id} className="hover:bg-background/50 transition-colors">
                        <td className="py-4 font-bold text-text-main pl-2">
                          {new Date(report.weekStartDate).toLocaleDateString()} - {new Date(report.weekEndDate).toLocaleDateString()}
                        </td>
                        <td className="py-4"><StatusBadge status={report.status} /></td>
                        <td className="py-4 text-text-muted font-bold text-sm">v{report.currentVersion}</td>
                        <td className="py-4 text-right pr-2">
                          <button onClick={() => navigate(`/manager/reports/${report.id}`)} className="text-primary font-bold hover:underline">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
}
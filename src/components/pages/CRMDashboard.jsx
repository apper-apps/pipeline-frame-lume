import React, { useEffect, useState } from "react";
import { leadService } from "@/services/api/leadService";
import { useAuth } from "@/contexts/AuthContext";
import ApperIcon from "@/components/ApperIcon";
import FollowUpDashboard from "@/components/pages/FollowUpDashboard";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import LogoutButton from "@/components/molecules/LogoutButton";
const CRMDashboard = () => {
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFollowUpDashboard, setShowFollowUpDashboard] = useState(false);
  const [pipelineStats, setPipelineStats] = useState({});

const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load leads data to calculate pipeline stats
      const leads = await leadService.getAll();
      
      // Calculate pipeline statistics
      const stats = leads.reduce((acc, lead) => {
        const column = lead.column || 'Unknown';
        acc[column] = (acc[column] || 0) + 1;
        return acc;
      }, {});
      
      setPipelineStats(stats);
      
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
    
    // Listen for storage changes to update stats
    const handleStorageChange = () => {
      loadStats();
    };
    
    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom events when leads are modified
    window.addEventListener("leadsUpdated", handleStorageChange);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("leadsUpdated", handleStorageChange);
    };
  }, []);
  if (loading) return <Loading />;
if (error) return <Error error={error} onRetry={loadStats} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-full mx-auto">
<div className="flex items-center justify-between mb-8">
          <Header />
          <div className="flex items-center gap-3">
            <Button
              variant={showFollowUpDashboard ? "secondary" : "primary"}
              onClick={() => setShowFollowUpDashboard(false)}
>
              <ApperIcon name="LayoutGrid" size={16} className="mr-2" />
              Pipeline
            </Button>
            <Button
              variant={showFollowUpDashboard ? "primary" : "secondary"}
              onClick={() => setShowFollowUpDashboard(true)}
            >
              <ApperIcon name="Clock" size={16} className="mr-2" />
              Follow-ups
            </Button>
            <LogoutButton />
          </div>
        </div>
        
        {/* Pipeline Stats */}
        {!showFollowUpDashboard && Object.keys(pipelineStats).length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {Object.entries(pipelineStats).map(([column, count]) => {
              const getColumnConfig = (columnName) => {
                const configs = {
                  'Cold Lead': { icon: 'Snowflake', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
                  'Hot Lead': { icon: 'Flame', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' },
                  'Estimate Sent': { icon: 'FileText', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
                  'Closed': { icon: 'CheckCircle', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' }
                };
                return configs[columnName] || { icon: 'Circle', color: 'text-gray-600', bgColor: 'bg-gray-100', borderColor: 'border-gray-200' };
              };

              const config = getColumnConfig(column);

              return (
                <div key={column} className={`bg-white rounded-xl p-4 border ${config.borderColor} shadow-sm`}>
                  <div className="flex items-center">
                    <div className={`${config.bgColor} rounded-lg p-2 mr-3`}>
                      <ApperIcon name={config.icon} size={20} className={config.color} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{column}</p>
                      <p className={`text-2xl font-bold ${config.color}`}>{count}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {showFollowUpDashboard ? (
          <FollowUpDashboard />
        ) : (
          <KanbanBoard />
        )}
      </div>
    </div>
  );
};

export default CRMDashboard;
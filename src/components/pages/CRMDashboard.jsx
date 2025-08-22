import React, { useEffect, useState } from "react";
import { leadService } from "@/services/api/leadService";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import FollowUpDashboard from "@/components/pages/FollowUpDashboard";
import Header from "@/components/organisms/Header";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const CRMDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFollowUpDashboard, setShowFollowUpDashboard] = useState(false);
const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load leads data to ensure KanbanBoard has access to current stats
      await leadService.getAll();
      
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
          </div>
        </div>
        
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
import React, { useEffect, useState } from "react";
import { leadService } from "@/services/api/leadService";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";

const CRMDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load leads data to ensure KanbanBoard has access to current stats
      await leadService.getLeads();
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
<Header />
        <KanbanBoard />
      </div>
    </div>
  );
};

export default CRMDashboard;
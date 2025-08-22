import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leadService } from "@/services/api/leadService";

const CRMDashboard = () => {
  const [dashboardStats, setDashboardStats] = useState({
    totalLeads: 0,
    totalValue: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const loadStats = async () => {
    try {
      setError("");
      const leads = await leadService.getAll();
      
      const totalLeads = leads.length;
      const totalValue = leads.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);
      
      setDashboardStats({
        totalLeads,
        totalValue
      });
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error error={error} onRetry={loadStats} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header 
          totalLeads={dashboardStats.totalLeads}
          totalValue={dashboardStats.totalValue}
        />
        <KanbanBoard />
      </div>
    </div>
  );
};

export default CRMDashboard;
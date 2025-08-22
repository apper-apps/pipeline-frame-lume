import React, { useEffect, useState } from "react";
import { leadService } from "@/services/api/leadService";
import { useAuth } from "@/contexts/AuthContext";
import ApperIcon from "@/components/ApperIcon";
import FollowUpDashboard from "@/components/pages/FollowUpDashboard";
import KanbanBoard from "@/components/organisms/KanbanBoard";
import Header from "@/components/organisms/Header";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import LogoutButton from "@/components/molecules/LogoutButton";
import Button from "@/components/atoms/Button";
const CRMDashboard = () => {
const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFollowUpDashboard, setShowFollowUpDashboard] = useState(false);
  const [showTableView, setShowTableView] = useState(false);
  const [pipelineStats, setPipelineStats] = useState({});
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterColumn, setFilterColumn] = useState("");
  const [sortField, setSortField] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");

const loadStats = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Load leads data to calculate pipeline stats
      const leadsData = await leadService.getAll();
      setLeads(leadsData);
      
      // Calculate pipeline statistics
      const stats = leadsData.reduce((acc, lead) => {
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

  const handleStorageChange = () => {
    loadStats();
  };

useEffect(() => {
    loadStats();
    
    // Listen for storage changes to refresh data
    window.addEventListener('leadsUpdated', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('leadsUpdated', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filter and sort leads for table view
  const getFilteredAndSortedLeads = () => {
    let filteredLeads = leads.filter(lead => !lead.archived);
    
    // Search filter
    if (searchTerm) {
      filteredLeads = filteredLeads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm)
      );
    }
    
    // Column filter
    if (filterColumn) {
      filteredLeads = filteredLeads.filter(lead => lead.column === filterColumn);
    }
    
    // Sort
    filteredLeads.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (sortField === 'date') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      } else if (sortField === 'estimatedValue') {
        aValue = parseFloat(aValue) || 0;
        bValue = parseFloat(bValue) || 0;
      } else if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filteredLeads;
  };

  const LeadsTableView = () => {
    const filteredLeads = getFilteredAndSortedLeads();
    const columns = ['New Lead', 'Qualified', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
    
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(amount);
    };

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    };

    const getColumnColor = (column) => {
      const colors = {
        'New Lead': 'bg-blue-100 text-blue-800',
        'Qualified': 'bg-green-100 text-green-800',
        'Proposal': 'bg-yellow-100 text-yellow-800',
        'Negotiation': 'bg-orange-100 text-orange-800',
        'Closed Won': 'bg-emerald-100 text-emerald-800',
        'Closed Lost': 'bg-red-100 text-red-800'
      };
      return colors[column] || 'bg-gray-100 text-gray-800';
    };

    const handleSort = (field) => {
      if (sortField === field) {
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      } else {
        setSortField(field);
        setSortDirection('asc');
      }
    };

    const SortIcon = ({ field }) => {
      if (sortField !== field) {
        return <ApperIcon name="ArrowUpDown" size={14} className="text-gray-400" />;
      }
      return sortDirection === 'asc' ? 
        <ApperIcon name="ArrowUp" size={14} className="text-primary" /> :
        <ApperIcon name="ArrowDown" size={14} className="text-primary" />;
    };

    return (
      <div className="space-y-6">
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="relative flex-1 max-w-md">
              <ApperIcon name="Search" size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search leads..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>
            <select
              value={filterColumn}
              onChange={(e) => setFilterColumn(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="">All Columns</option>
              {columns.map(column => (
                <option key={column} value={column}>{column}</option>
              ))}
            </select>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredLeads.length} of {leads.filter(l => !l.archived).length} leads
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      <SortIcon field="name" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                    Contact Info
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('column')}
                  >
                    <div className="flex items-center gap-2">
                      Stage
                      <SortIcon field="column" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('estimatedValue')}
                  >
                    <div className="flex items-center gap-2">
                      Value
                      <SortIcon field="estimatedValue" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-4 text-left text-sm font-medium text-gray-900 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('date')}
                  >
                    <div className="flex items-center gap-2">
                      Date
                      <SortIcon field="date" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.Id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="Mail" size={14} className="mr-2 text-gray-400" />
                          {lead.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <ApperIcon name="Phone" size={14} className="mr-2 text-gray-400" />
                          {lead.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getColumnColor(lead.column)}`}>
                        {lead.column}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-green-600">
                        {formatCurrency(lead.estimatedValue)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(lead.date)}
                    </td>
                    <td className="px-6 py-4">
<div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            const event = new (window.CustomEvent || Event)('editLead', { 
                              detail: lead,
                              bubbles: true
                            });
                            window.dispatchEvent(event);
                          }}
                          className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                          title="Edit lead"
                        >
                          <ApperIcon name="Edit2" size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const event = new (window.CustomEvent || Event)('followUpLead', { 
                              detail: lead,
                              bubbles: true
                            });
                            window.dispatchEvent(event);
                          }}
                          className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                          title="Follow up"
                        >
                          <ApperIcon name="Clock" size={16} />
                        </button>
                        <button
                          onClick={() => {
                            const event = new (window.CustomEvent || Event)('duplicateLead', { 
                              detail: lead,
                              bubbles: true
                            });
                            window.dispatchEvent(event);
                          }}
                          className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                          title="Duplicate lead"
                        >
                          <ApperIcon name="Copy" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredLeads.length === 0 && (
              <div className="text-center py-12">
                <ApperIcon name="Search" size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 font-medium">No leads found</p>
                <p className="text-gray-400 text-sm">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

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
                  'New Lead': { icon: 'Users', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
                  'Qualified': { icon: 'UserCheck', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
                  'Proposal': { icon: 'FileText', color: 'text-yellow-600', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-200' },
                  'Negotiation': { icon: 'Handshake', color: 'text-orange-600', bgColor: 'bg-orange-100', borderColor: 'border-orange-200' },
                  'Closed Won': { icon: 'Trophy', color: 'text-emerald-600', bgColor: 'bg-emerald-100', borderColor: 'border-emerald-200' },
                  'Closed Lost': { icon: 'XCircle', color: 'text-red-600', bgColor: 'bg-red-100', borderColor: 'border-red-200' }
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
        ) : showTableView ? (
          <LeadsTableView />
        ) : (
          <KanbanBoard />
        )}
      </div>
    </div>
  );
};

export default CRMDashboard;
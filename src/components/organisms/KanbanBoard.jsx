import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { leadService } from "@/services/api/leadService";
import { columnService } from "@/services/api/columnService";
import { reminderService } from "@/services/api/reminderService";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import AddLeadButton from "@/components/molecules/AddLeadButton";
import FloatingActionButton from "@/components/molecules/FloatingActionButton";
import LeadModal from "@/components/organisms/LeadModal";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import FollowUpModal from "@/components/organisms/FollowUpModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
const KanbanBoard = () => {
const [leads, setLeads] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [followUpLead, setFollowUpLead] = useState(null);
  const {
    draggedItem,
    dragOverColumn,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop
  } = useDragAndDrop();

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [leadsData, columnsData] = await Promise.all([
        leadService.getAll(),
        columnService.getAll()
      ]);
      
      setLeads(leadsData);
      setColumns(columnsData.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const handleEditLead = (lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleSaveLead = async (leadData) => {
    try {
      if (editingLead) {
        const updatedLead = await leadService.update(editingLead.Id, leadData);
        setLeads(prev => prev.map(lead => 
          lead.Id === editingLead.Id ? updatedLead : lead
        ));
        toast.success("Lead updated successfully!");
      } else {
        const newLead = await leadService.create(leadData);
        setLeads(prev => [...prev, newLead]);
        toast.success("Lead added successfully!");
      }
    } catch (err) {
      toast.error("Failed to save lead. Please try again.");
      console.error("Error saving lead:", err);
    }
  };

  const handleDropLead = async (lead, newColumn) => {
    if (lead.column === newColumn) return;

    try {
      const updatedLead = await leadService.updateColumn(lead.Id, newColumn);
      setLeads(prev => prev.map(l => 
        l.Id === lead.Id ? updatedLead : l
      ));
      
      toast.success(`Lead moved to ${newColumn}!`);
    } catch (err) {
      toast.error("Failed to move lead. Please try again.");
      console.error("Error moving lead:", err);
    }
  };

const onDrop = (e, columnTitle) => {
    handleDrop(e, columnTitle, handleDropLead);
  };

  const handleArchiveLead = async (lead) => {
    try {
      await leadService.archive(lead.Id);
      await loadData();
      toast.success(`${lead.name} has been archived`);
    } catch (error) {
      toast.error('Failed to archive lead');
    }
  };

  const handleDeleteLead = async (lead) => {
    try {
      await leadService.delete(lead.Id);
      await loadData();
      toast.success(`${lead.name} has been deleted`);
    } catch (error) {
      toast.error('Failed to delete lead');
    }
  };

const handleDuplicateLead = async (lead) => {
    try {
      const duplicatedLead = await leadService.duplicate(lead.Id);
      await loadData();
      toast.success(`${lead.name} has been duplicated`);
    } catch (error) {
      toast.error('Failed to duplicate lead');
      console.error('Error duplicating lead:', error);
    }
  };
const handleFollowUpLead = (lead) => {
    setFollowUpLead(lead);
    setIsFollowUpModalOpen(true);
  };

const handleSaveFollowUp = async (reminderData) => {
    try {
      await reminderService.create(reminderData);
      const reminderDate = new Date(reminderData.reminderDateTime);
      const formattedDate = format(reminderDate, 'MMM dd, yyyy');
      const formattedTime = format(reminderDate, 'hh:mm a');
      
      toast.success(
        `Follow-up reminder set for ${reminderData.leadName} on ${formattedDate} at ${formattedTime}`, 
        {
          position: "top-right"
        }
      );
      setIsFollowUpModalOpen(false);
      setFollowUpLead(null);
    } catch (error) {
      console.error("Error saving follow-up reminder:", error);
      toast.error("Failed to set follow-up reminder", {
        position: "top-right"
      });
    }
  };



  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <AddLeadButton onClick={handleAddLead} />
        
      </div>
{/* Kanban Board */}
      <div className="w-full overflow-x-auto">
        <div className="flex gap-6 pb-4 min-w-max">
          {columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-80">
              <KanbanColumn
                column={column}
                leads={leads}
                onEditLead={handleEditLead}
                onArchiveLead={handleArchiveLead}
                onDeleteLead={handleDeleteLead}
                onDuplicateLead={handleDuplicateLead}
                onFollowUpLead={handleFollowUpLead}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDrop={onDrop}
                draggedItem={draggedItem}
                isDragOver={dragOverColumn === column.title}
              />
            </div>
          ))}
        </div>
      </div>
      <FloatingActionButton onClick={handleAddLead} />

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        lead={editingLead}
        columns={columns}
      />
{/* Follow Up Modal */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setFollowUpLead(null);
        }}
        onSave={handleSaveFollowUp}
        lead={followUpLead}
      />
    </div>
  );
};

export default KanbanBoard;
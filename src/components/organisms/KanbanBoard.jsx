import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import KanbanColumn from "@/components/organisms/KanbanColumn";
import LeadModal from "@/components/organisms/LeadModal";
import FloatingActionButton from "@/components/molecules/FloatingActionButton";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leadService } from "@/services/api/leadService";
import { columnService } from "@/services/api/columnService";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";

const KanbanBoard = () => {
  const [leads, setLeads] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

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
    }
  };
  if (loading) return <Loading />;
  if (error) return <Error error={error} onRetry={loadData} />;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
{columns.map((column) => (
          <KanbanColumn
            key={column.Id}
            column={column}
            leads={leads}
            onEditLead={handleEditLead}
            onArchiveLead={handleArchiveLead}
            onDeleteLead={handleDeleteLead}
            onDuplicateLead={handleDuplicateLead}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={onDrop}
            draggedItem={draggedItem}
            isDragOver={dragOverColumn === column.title}
          />
        ))}
      </div>

      <FloatingActionButton onClick={handleAddLead} />

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        lead={editingLead}
        columns={columns}
      />
    </>
  );
};

export default KanbanBoard;
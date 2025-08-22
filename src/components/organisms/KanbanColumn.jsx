import React from "react";
import ColumnHeader from "@/components/molecules/ColumnHeader";
import LeadCard from "@/components/molecules/LeadCard";
import Empty from "@/components/ui/Empty";
import { cn } from "@/utils/cn";

const KanbanColumn = ({
  column,
  leads,
  onEditLead,
  onArchiveLead,
  onDeleteLead,
  onDuplicateLead,
  onFollowUpLead,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
  draggedItem,
  isDragOver = false,
  className
}) => {
  const columnLeads = leads.filter(lead => lead.column === column.title);

  return (
    <div
className={cn(
        "bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 shadow-lg shadow-slate-200/50 transition-all duration-300 min-h-[600px] hover:shadow-xl hover:shadow-slate-200/60",
        isDragOver && "drag-over border-2 border-primary bg-gradient-to-br from-blue-50/90 to-indigo-50/90 transform scale-[1.02]",
        className
      )}
      onDragOver={onDragOver}
      onDragEnter={(e) => onDragEnter(e, column.title)}
      onDragLeave={onDragLeave}
      onDrop={(e) => onDrop(e, column.title)}
    >
      <ColumnHeader 
        title={column.title}
        count={columnLeads.length}
        color={column.color}
      />

<div className="space-y-4">
{columnLeads.length > 0 ? (
          columnLeads.map((lead) => (
            <LeadCard
              key={lead.Id || lead.id || `lead-${Math.random()}`}
              lead={lead}
              onEdit={() => onEditLead(lead)}
              onArchive={onArchiveLead}
              onDelete={onDeleteLead}
              onDuplicate={onDuplicateLead}
              onFollowUp={onFollowUpLead}
              onDragStart={(e) => onDragStart(e, lead)}
              onDragEnd={onDragEnd}
              isDragging={draggedItem?.Id === lead.Id || draggedItem?.id === lead.id}
            />
          ))
        ) : (
          <div className="flex items-center justify-center h-40">
            <div className="text-center p-6">
              <div className="text-gray-300 mb-3">
                <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-base text-gray-500 font-medium mb-1">No leads yet</p>
              <p className="text-sm text-gray-400">Drop leads here or add new ones</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
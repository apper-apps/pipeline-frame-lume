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
        "bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-200/60 shadow-md transition-all duration-300 min-h-[500px] hover:shadow-lg",
        isDragOver && "drag-over border-2 border-primary bg-gradient-to-br from-blue-50/90 to-indigo-50/90 transform scale-[1.01]",
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
<div className="space-y-2">
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
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center p-4">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <div className="text-gray-300">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.5v15m7.5-7.5h-15" />
                  </svg>
                </div>
              </div>
              <h3 className="text-base font-semibold text-gray-700 mb-2">No leads in {column.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">
                Start by adding new leads or drag existing ones here.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
                <span>Drag & Drop Ready</span>
                <div className="w-1.5 h-1.5 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
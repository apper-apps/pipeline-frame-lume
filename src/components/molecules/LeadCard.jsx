import React, { useState } from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const LeadCard = ({ 
lead, 
  onEdit,
  onArchive,
  onDelete,
  onDuplicate,
  onFollowUp,
  onDragStart,
  onDragEnd,
  isDragging = false,
  className 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch {
      return dateString;
    }
  };

const handleDropdownClick = (e) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };
const handleActionClick = (action, e) => {
    e.stopPropagation();
    setShowDropdown(false);
    
    if (action === 'delete') {
      setShowDeleteConfirm(true);
    } else if (action === 'archive') {
      setShowArchiveConfirm(true);
    } else if (action === 'duplicate') {
      onDuplicate(lead);
    } else if (action === 'followup') {
      onFollowUp(lead);
    }
  };

  const handleConfirmDelete = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
    onDelete(lead);
  };

  const handleConfirmArchive = (e) => {
    e.stopPropagation();
    setShowArchiveConfirm(false);
    onArchive(lead);
  };

  const handleCancelConfirm = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(false);
    setShowArchiveConfirm(false);
  };

return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onEdit}
      className={cn(
        "bg-white rounded-xl border border-gray-200/80 cursor-grab active:cursor-grabbing transition-all duration-300 hover:shadow-lg hover:shadow-gray-200/50 hover:scale-[1.02] hover:border-primary/40 group relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/50 before:to-transparent before:pointer-events-none",
        isDragging && "opacity-50 rotate-2 scale-105 shadow-xl shadow-primary/20 z-50 border-primary/60",
        className
      )}
    >
      {/* Status Indicator Bar */}
      <div className="h-1 bg-gradient-to-r from-primary/60 to-accent/40 group-hover:from-primary group-hover:to-accent transition-all duration-300"></div>
      
      {/* Card Content */}
      <div className="p-5">
        {/* Quick Actions Dropdown */}
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={handleDropdownClick}
            className="opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-gray-100/80 backdrop-blur-sm"
          >
            <ApperIcon name="MoreVertical" size={16} className="text-gray-500" />
          </button>
          
          {showDropdown && (
            <div className="absolute top-10 right-0 bg-white border border-gray-200 rounded-xl shadow-xl py-2 min-w-[160px] z-20 backdrop-blur-sm">
              <button
                onClick={(e) => handleActionClick('followup', e)}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-blue-50 flex items-center gap-3 text-blue-600 transition-colors"
              >
                <ApperIcon name="Clock" size={16} />
                Schedule Follow Up
              </button>
              <button
                onClick={(e) => handleActionClick('duplicate', e)}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-gray-50 flex items-center gap-3 text-gray-700 transition-colors"
              >
                <ApperIcon name="Copy" size={16} />
                Duplicate Lead
              </button>
              <div className="h-px bg-gray-200 my-1 mx-2"></div>
              <button
                onClick={(e) => handleActionClick('archive', e)}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-amber-50 flex items-center gap-3 text-amber-600 transition-colors"
              >
                <ApperIcon name="Archive" size={16} />
                Archive Lead
              </button>
              <button
                onClick={(e) => handleActionClick('delete', e)}
                className="w-full px-4 py-2.5 text-left text-sm hover:bg-red-50 flex items-center gap-3 text-red-600 transition-colors"
              >
                <ApperIcon name="Trash2" size={16} />
                Delete Lead
              </button>
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-red-200 rounded-xl p-6 z-30 shadow-xl">
            <div className="text-center">
              <div className="mb-4 bg-red-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <ApperIcon name="AlertTriangle" size={28} className="text-red-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">Delete Lead</h4>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Are you sure you want to permanently delete "{lead.name}"? This action cannot be undone and all data will be lost.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Delete Lead
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Archive Confirmation Dialog */}
        {showArchiveConfirm && (
          <div className="absolute inset-0 bg-white/95 backdrop-blur-sm border border-amber-200 rounded-xl p-6 z-30 shadow-xl">
            <div className="text-center">
              <div className="mb-4 bg-amber-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto">
                <ApperIcon name="Archive" size={28} className="text-amber-500" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-3 text-lg">Archive Lead</h4>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Archive "{lead.name}"? The lead will be moved to archived leads and can be restored later if needed.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleCancelConfirm}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmArchive}
                  className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-medium transition-colors"
                >
                  Archive Lead
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Overlay to close dropdown when clicking outside */}
        {showDropdown && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(false);
            }}
          />
        )}

        {/* Lead Header */}
        <div className="mb-4">
          <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors duration-300 pr-10 text-xl leading-tight mb-2">
            {lead.name}
          </h3>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Active Lead</span>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="space-y-3 mb-5">
          <div className="bg-gray-50/80 rounded-lg p-3 hover:bg-gray-100/80 transition-colors">
            <div className="flex items-center text-sm text-gray-700 mb-1">
              <div className="bg-blue-100 p-1.5 rounded-md mr-3">
                <ApperIcon name="Mail" size={14} className="text-blue-600" />
              </div>
              <span className="truncate font-medium">{lead.email}</span>
            </div>
          </div>
          <div className="bg-gray-50/80 rounded-lg p-3 hover:bg-gray-100/80 transition-colors">
            <div className="flex items-center text-sm text-gray-700">
              <div className="bg-green-100 p-1.5 rounded-md mr-3">
                <ApperIcon name="Phone" size={14} className="text-green-600" />
              </div>
              <span className="font-medium">{lead.phone}</span>
            </div>
          </div>
        </div>

        {/* Value and Date Section */}
        <div className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Deal Value</div>
              <div className="text-2xl font-bold bg-gradient-to-r from-accent to-amber-600 bg-clip-text text-transparent">
                {formatCurrency(lead.estimatedValue)}
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Date Added</div>
              <div className="text-sm font-semibold text-gray-700">
                {formatDate(lead.date)}
              </div>
            </div>
          </div>
        </div>

        {/* Activity Indicator */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary/20 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
            </div>
            <span className="text-xs text-gray-500 font-medium">Ready to move</span>
          </div>
          
          {/* Drag Handle */}
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-gray-100 rounded-md p-2">
            <ApperIcon name="GripVertical" size={16} className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
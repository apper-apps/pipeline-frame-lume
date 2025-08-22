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
        "bg-white rounded-lg border border-gray-200 cursor-grab active:cursor-grabbing hover:border-gray-300 relative",
        isDragging && "opacity-50 z-50",
        className
      )}
    >
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white border border-red-200 rounded-lg p-4 z-30 shadow-lg">
          <div className="text-center">
            <ApperIcon name="AlertTriangle" size={20} className="text-red-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Delete Lead</h4>
            <p className="text-sm text-gray-600 mb-4">
              Delete "{lead.name}"? This cannot be undone.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleCancelConfirm}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Confirmation Dialog */}
      {showArchiveConfirm && (
        <div className="absolute inset-0 bg-white border border-amber-200 rounded-lg p-4 z-30 shadow-lg">
          <div className="text-center">
            <ApperIcon name="Archive" size={20} className="text-amber-500 mx-auto mb-2" />
            <h4 className="font-medium text-gray-900 mb-2">Archive Lead</h4>
            <p className="text-sm text-gray-600 mb-4">
              Archive "{lead.name}"? Can be restored later.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleCancelConfirm}
                className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-3 py-1 text-sm bg-amber-600 text-white rounded hover:bg-amber-700"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown overlay */}
      {showDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={(e) => {
            e.stopPropagation();
            setShowDropdown(false);
          }}
        />
      )}

{/* Main Content */}
      <div className="p-4">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg mb-1 break-words leading-tight">{lead.name}</h3>
          </div>
          
          {/* Quick Actions */}
          <div className="flex items-center gap-1 ml-3 flex-shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onFollowUp(lead);
              }}
              className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
              title="Follow up"
            >
              <ApperIcon name="Clock" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(lead);
              }}
              className="p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-md transition-colors"
              title="Duplicate"
            >
              <ApperIcon name="Copy" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowArchiveConfirm(true);
              }}
              className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-md transition-colors"
              title="Archive"
            >
              <ApperIcon name="Archive" size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="Delete"
            >
              <ApperIcon name="Trash2" size={14} />
            </button>
            <div className="w-px h-4 bg-gray-200 mx-1"></div>
            <div className="p-1.5 text-gray-400 cursor-grab">
              <ApperIcon name="GripVertical" size={14} />
            </div>
          </div>
        </div>

        {/* Content Frame */}
        <div className="border border-gray-200 rounded-lg p-3 bg-gradient-to-br from-gray-50/80 to-white">
          {/* Contact Information */}
          <div className="space-y-2.5 mb-3 text-sm">
            <div className="flex items-center gap-2.5 text-gray-600">
              <ApperIcon name="Mail" size={14} className="text-gray-400 flex-shrink-0" />
              <span className="break-words truncate">{lead.email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-600">
              <ApperIcon name="Phone" size={14} className="text-gray-400 flex-shrink-0" />
              <span className="break-words">{lead.phone}</span>
            </div>
          </div>
          
          {/* Value and Date */}
          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-150">
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Value:</span>
              <span className="font-semibold text-green-600">
                {formatCurrency(lead.estimatedValue)}
              </span>
            </div>
            <div className="text-gray-500 font-medium">
              {formatDate(lead.date)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadCard;
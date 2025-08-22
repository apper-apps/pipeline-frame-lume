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
        "bg-white rounded-lg p-4 border border-gray-200 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/30 group relative",
        isDragging && "opacity-50 rotate-2 scale-105 shadow-lg z-50",
        className
      )}
    >
      {/* Quick Actions Dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={handleDropdownClick}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-gray-100"
        >
          <ApperIcon name="MoreVertical" size={16} />
        </button>
        
        {showDropdown && (
          <div className="absolute top-8 right-0 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[120px] z-20">
            <button
              onClick={(e) => handleActionClick('duplicate', e)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
            >
              <ApperIcon name="Copy" size={14} />
              Duplicate
            </button>
            <button
              onClick={(e) => handleActionClick('archive', e)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-amber-600"
            >
              <ApperIcon name="Archive" size={14} />
              Archive
            </button>
            <button
              onClick={(e) => handleActionClick('delete', e)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
            >
              <ApperIcon name="Trash2" size={14} />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="absolute inset-0 bg-white border border-red-200 rounded-lg p-4 z-30 shadow-lg">
          <div className="text-center">
            <div className="mb-3">
              <ApperIcon name="AlertTriangle" size={24} className="text-red-500 mx-auto" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Delete Lead</h4>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete "{lead.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleCancelConfirm}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1.5 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
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
            <div className="mb-3">
              <ApperIcon name="Archive" size={24} className="text-amber-500 mx-auto" />
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Archive Lead</h4>
            <p className="text-sm text-gray-600 mb-4">
              Archive "{lead.name}"? You can restore it later from archived leads.
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={handleCancelConfirm}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmArchive}
                className="px-3 py-1.5 text-sm bg-amber-600 text-white rounded-md hover:bg-amber-700"
              >
                Archive
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
      {/* Lead Name */}
<h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200 pr-8">
        {lead.name}
      </h3>
      
      {/* Contact Info */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Mail" size={14} className="mr-2 text-gray-400" />
          <span className="truncate">{lead.email}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <ApperIcon name="Phone" size={14} className="mr-2 text-gray-400" />
          <span>{lead.phone}</span>
        </div>
      </div>

      {/* Value and Date */}
      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">
          {formatDate(lead.date)}
        </span>
        <span className="font-bold text-accent bg-gradient-to-r from-accent/10 to-amber-100 px-2 py-1 rounded-md text-sm">
          {formatCurrency(lead.estimatedValue)}
        </span>
      </div>

      {/* Drag Handle */}
      <div className="flex justify-center mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <ApperIcon name="GripVertical" size={16} className="text-gray-400" />
      </div>
    </div>
  );
};

export default LeadCard;
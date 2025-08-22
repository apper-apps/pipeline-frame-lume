import React from "react";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const LeadCard = ({ 
  lead, 
  onEdit,
  onDragStart,
  onDragEnd,
  isDragging = false,
  className 
}) => {
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

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onClick={onEdit}
      className={cn(
        "bg-white rounded-lg p-4 border border-gray-200 cursor-grab active:cursor-grabbing transition-all duration-200 hover:shadow-md hover:scale-[1.02] hover:border-primary/30 group",
        isDragging && "opacity-50 rotate-2 scale-105 shadow-lg z-50",
        className
      )}
    >
      {/* Lead Name */}
      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
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
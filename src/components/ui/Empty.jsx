import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ title = "No data available", description = "Get started by adding your first item", onAction, actionLabel = "Add Item" }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full w-24 h-24 mb-6 flex items-center justify-center">
        <ApperIcon name="Database" size={40} className="text-blue-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-3 font-display">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center max-w-sm mb-8 leading-relaxed">
        {description}
      </p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          <ApperIcon name="Plus" size={18} className="mr-2" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default Empty;
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ error = "Something went wrong", onRetry }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <div className="text-center max-w-md mx-auto">
        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-full w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <ApperIcon name="AlertTriangle" size={40} className="text-red-500" />
        </div>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-4 font-display">
          Oops! Something went wrong
        </h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          {error}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <ApperIcon name="RefreshCw" size={18} className="mr-2" />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default Error;
import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Header = ({ totalValue = 0 }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        <div className="bg-gradient-to-br from-primary to-blue-600 rounded-xl p-3 mr-4">
          <ApperIcon name="Users" size={28} className="text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-gray-900 font-display bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Pipeline Pro
          </h1>
          <p className="text-gray-600 font-medium">
            Manage your sales leads with visual pipeline tracking
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg p-2 mr-3">
              <ApperIcon name="DollarSign" size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pipeline Value</p>
              <p className="text-2xl font-bold text-accent">{formatCurrency(totalValue)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-lg p-2 mr-3">
              <ApperIcon name="TrendingUp" size={20} className="text-green-600" />
            </div>
            <div>
<p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">85%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-slate-200/50">
          <div className="flex items-center">
            <div className="bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg p-2 mr-3">
              <ApperIcon name="Target" size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
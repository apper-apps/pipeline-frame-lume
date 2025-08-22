import React from "react";
import Badge from "@/components/atoms/Badge";
import { cn } from "@/utils/cn";

const ColumnHeader = ({ title, count, color, className }) => {
  const getColorClasses = (colorHex) => {
    const colorMap = {
      "#64748b": "border-slate-500",
      "#f59e0b": "border-amber-500", 
      "#3b82f6": "border-blue-500",
      "#10b981": "border-emerald-500"
    };
    return colorMap[colorHex] || "border-gray-500";
  };

  return (
    <div className={cn("mb-4", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 font-display">
          {title}
        </h2>
        <Badge variant="primary" className="font-semibold">
          {count}
        </Badge>
      </div>
      <div className={cn("h-1 w-full rounded-full mt-2", getColorClasses(color))} 
           style={{ backgroundColor: color }} />
    </div>
  );
};

export default ColumnHeader;
import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FloatingActionButton = ({ onClick, className, ...props }) => {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        "fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-40",
        className
      )}
      {...props}
    >
      <ApperIcon name="Plus" size={24} />
    </Button>
  );
};

export default FloatingActionButton;
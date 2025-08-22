import React from "react";
import Label from "@/components/atoms/Label";
import Input from "@/components/atoms/Input";
import { cn } from "@/utils/cn";

const FormField = ({ 
  label, 
  error, 
  className,
  required = false,
  ...inputProps 
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={inputProps.id}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        {...inputProps}
        className={cn(
          inputProps.className,
          error && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
        )}
      />
      {error && (
        <p className="text-sm text-red-600 font-medium">{error}</p>
      )}
    </div>
  );
};

export default FormField;
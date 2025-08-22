import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const LeadModal = ({ isOpen, onClose, onSave, lead = null, columns = [] }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    estimatedValue: "",
    date: "",
    column: "Cold Lead"
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        estimatedValue: lead.estimatedValue?.toString() || "",
        date: lead.date || "",
        column: lead.column || "Cold Lead"
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        estimatedValue: "",
        date: new Date().toISOString().split("T")[0],
        column: "Cold Lead"
      });
    }
    setErrors({});
  }, [lead, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }
    
    if (!formData.estimatedValue) {
      newErrors.estimatedValue = "Estimated value is required";
    } else if (isNaN(formData.estimatedValue) || parseFloat(formData.estimatedValue) <= 0) {
      newErrors.estimatedValue = "Must be a positive number";
    }
    
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const leadData = {
        ...formData,
        estimatedValue: parseFloat(formData.estimatedValue)
      };
      
      await onSave(leadData);
      onClose();
    } catch (error) {
      console.error("Error saving lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold font-display">
                  {lead ? "Edit Lead" : "Add New Lead"}
                </h2>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              <p className="text-blue-100 mt-1 text-sm">
                {lead ? "Update lead information" : "Fill in the details below"}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormField
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                placeholder="Enter full name"
              />

              <FormField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                error={errors.email}
                required
                placeholder="Enter email address"
              />

              <FormField
                label="Phone"
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                error={errors.phone}
                required
                placeholder="Enter phone number"
              />

              <FormField
                label="Estimated Value"
                id="estimatedValue"
                name="estimatedValue"
                type="number"
                min="0"
                step="0.01"
                value={formData.estimatedValue}
                onChange={handleInputChange}
                error={errors.estimatedValue}
                required
                placeholder="Enter estimated value"
              />

              <FormField
                label="Date"
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                error={errors.date}
                required
              />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Stage <span className="text-red-500">*</span>
                </label>
                <select
                  name="column"
                  value={formData.column}
                  onChange={handleInputChange}
                  className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                >
                  <option value="Cold Lead">Cold Lead</option>
                  <option value="Hot Lead">Hot Lead</option>
                  <option value="Estimate Sent">Estimate Sent</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? (
                    <>
                      <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ApperIcon name="Save" size={16} className="mr-2" />
                      {lead ? "Update" : "Add"} Lead
                    </>
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadModal;
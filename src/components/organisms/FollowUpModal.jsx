import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FollowUpModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  lead = null, 
  reminder = null 
}) => {
  const [formData, setFormData] = useState({
    type: "call",
    title: "",
    notes: "",
    reminderDate: "",
    reminderTime: "",
    priority: "medium"
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (reminder) {
      const reminderDateTime = new Date(reminder.reminderDateTime);
      setFormData({
        type: reminder.type || "call",
        title: reminder.title || "",
        notes: reminder.notes || "",
        reminderDate: format(reminderDateTime, 'yyyy-MM-dd'),
        reminderTime: format(reminderDateTime, 'HH:mm'),
        priority: reminder.priority || "medium"
      });
    } else {
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      setFormData({
        type: "call",
        title: lead ? `Follow up with ${lead.name}` : "",
        notes: "",
        reminderDate: format(tomorrow, 'yyyy-MM-dd'),
        reminderTime: "09:00",
        priority: "medium"
      });
    }
    setErrors({});
  }, [reminder, lead, isOpen]);

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
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.reminderDate) {
      newErrors.reminderDate = "Date is required";
    } else {
      const selectedDate = new Date(formData.reminderDate + 'T' + formData.reminderTime);
      const now = new Date();
      if (selectedDate < now) {
        newErrors.reminderDate = "Reminder must be in the future";
      }
    }
    
    if (!formData.reminderTime) {
      newErrors.reminderTime = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const reminderDateTime = new Date(formData.reminderDate + 'T' + formData.reminderTime);
      
      const reminderData = {
        ...formData,
        leadId: lead?.Id,
        leadName: lead?.name,
        reminderDateTime: reminderDateTime.toISOString()
      };
      
      await onSave(reminderData);
      onClose();
    } catch (error) {
      console.error("Error saving follow-up reminder:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const reminderTypes = [
    { value: "call", label: "Phone Call", icon: "Phone" },
    { value: "email", label: "Send Email", icon: "Mail" },
    { value: "meeting", label: "Schedule Meeting", icon: "Calendar" },
    { value: "task", label: "General Task", icon: "CheckSquare" }
  ];

  const priorityLevels = [
    { value: "low", label: "Low", color: "text-green-600" },
    { value: "medium", label: "Medium", color: "text-yellow-600" },
    { value: "high", label: "High", color: "text-red-600" }
  ];

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
className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ApperIcon name="Clock" size={24} />
                  <h2 className="text-xl font-bold font-display">
                    {reminder ? "Edit Follow-up" : "Set Follow-up Reminder"}
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  <ApperIcon name="X" size={20} />
                </button>
              </div>
              {lead && (
<p className="text-blue-100 mt-1 text-sm">
                  For: <span className="font-semibold">{lead.name}</span>
                </p>
              )}
            </div>

            {/* Form */}
<form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700">
                  Reminder Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {reminderTypes.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                      className={cn(
                        "flex items-center gap-2 p-3 rounded-xl border-2 transition-all duration-200 hover:shadow-sm",
                        formData.type === type.value
                          ? "border-primary bg-primary/10 text-primary shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <ApperIcon name={type.icon} size={16} />
                      <span className="text-sm font-medium">{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <FormField
                label="Title"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
                required
                placeholder="Enter reminder title"
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  label="Date"
                  id="reminderDate"
                  name="reminderDate"
                  type="date"
                  value={formData.reminderDate}
                  onChange={handleInputChange}
                  error={errors.reminderDate}
                  required
                />
                
                <FormField
                  label="Time"
                  id="reminderTime"
                  name="reminderTime"
                  type="time"
                  value={formData.reminderTime}
                  onChange={handleInputChange}
                  error={errors.reminderTime}
                  required
                />

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200"
                  >
                    {priorityLevels.map((level) => (
                      <option key={level.value} value={level.value}>
                        {level.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Add any additional notes..."
                  rows={4}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-900 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                />
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
                      <ApperIcon name="Clock" size={16} className="mr-2" />
                      {reminder ? "Update" : "Set"} Reminder
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

export default FollowUpModal;
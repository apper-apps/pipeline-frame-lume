import React, { useState, useEffect } from "react";
import { format, isToday, isTomorrow, isThisWeek, isPast, startOfDay, parseISO } from "date-fns";
import { toast } from "react-toastify";
import { reminderService } from "@/services/api/reminderService";
import { leadService } from "@/services/api/leadService";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import FollowUpModal from "@/components/organisms/FollowUpModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { cn } from "@/utils/cn";

const FollowUpDashboard = () => {
  const [reminders, setReminders] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [editingLead, setEditingLead] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [remindersData, leadsData] = await Promise.all([
        reminderService.getAll(),
        leadService.getAll()
      ]);
      
      setReminders(remindersData);
      setLeads(leadsData);
    } catch (err) {
      console.error("Failed to load follow-up data:", err);
      setError(err.message || "Failed to load follow-up data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCompleteReminder = async (reminder) => {
    try {
      await reminderService.markCompleted(reminder.Id);
      toast.success("Follow-up marked as completed", {
        position: "top-right"
      });
      loadData();
    } catch (error) {
      console.error("Error completing reminder:", error);
      toast.error("Failed to complete follow-up", {
        position: "top-right"
      });
    }
  };

  const handleEditReminder = (reminder) => {
    const lead = leads.find(l => l.Id === reminder.leadId);
    setEditingReminder(reminder);
    setEditingLead(lead);
    setIsFollowUpModalOpen(true);
  };

  const handleSaveFollowUp = async (reminderData) => {
    try {
      if (editingReminder) {
        await reminderService.update(editingReminder.Id, reminderData);
        toast.success("Follow-up reminder updated", {
          position: "top-right"
        });
      } else {
        await reminderService.create(reminderData);
        toast.success(`Follow-up reminder set for ${reminderData.leadName}`, {
          position: "top-right"
        });
      }
      
      setIsFollowUpModalOpen(false);
      setEditingReminder(null);
      setEditingLead(null);
      loadData();
    } catch (error) {
      console.error("Error saving follow-up reminder:", error);
      toast.error("Failed to save follow-up reminder", {
        position: "top-right"
      });
    }
  };

  const handleDeleteReminder = async (reminder) => {
    if (window.confirm(`Are you sure you want to delete this follow-up reminder for ${reminder.leadName}?`)) {
      try {
        await reminderService.delete(reminder.Id);
        toast.success("Follow-up reminder deleted", {
          position: "top-right"
        });
        loadData();
      } catch (error) {
        console.error("Error deleting reminder:", error);
        toast.error("Failed to delete follow-up reminder", {
          position: "top-right"
        });
      }
    }
  };

  const categorizeReminders = (reminders) => {
    const now = new Date();
    const categories = {
      overdue: [],
      today: [],
      tomorrow: [],
      thisWeek: [],
      later: [],
      completed: []
    };

    reminders.forEach(reminder => {
      if (reminder.completed) {
        categories.completed.push(reminder);
        return;
      }

      const reminderDate = parseISO(reminder.reminderDateTime);
      
      if (isPast(reminderDate) && !isToday(reminderDate)) {
        categories.overdue.push(reminder);
      } else if (isToday(reminderDate)) {
        categories.today.push(reminder);
      } else if (isTomorrow(reminderDate)) {
        categories.tomorrow.push(reminder);
      } else if (isThisWeek(reminderDate)) {
        categories.thisWeek.push(reminder);
      } else {
        categories.later.push(reminder);
      }
    });

    return categories;
  };

  const getReminderTypeIcon = (type) => {
    const icons = {
      call: "Phone",
      email: "Mail", 
      meeting: "Calendar",
      task: "CheckSquare"
    };
    return icons[type] || "Clock";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: "text-red-600 bg-red-50 border-red-200",
      medium: "text-yellow-600 bg-yellow-50 border-yellow-200", 
      low: "text-green-600 bg-green-50 border-green-200"
    };
    return colors[priority] || colors.medium;
  };

  const ReminderCard = ({ reminder, category }) => (
    <div className={cn(
      "bg-white rounded-lg p-4 border-l-4 shadow-sm hover:shadow-md transition-all duration-200",
      category === 'overdue' && "border-l-red-500 bg-red-50/50",
      category === 'today' && "border-l-blue-500 bg-blue-50/50",
      category === 'completed' && "border-l-green-500 bg-green-50/50 opacity-75"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <ApperIcon name={getReminderTypeIcon(reminder.type)} size={16} />
            <h3 className="font-semibold text-gray-900">{reminder.title}</h3>
            <span className={cn(
              "px-2 py-1 rounded-full text-xs font-medium border",
              getPriorityColor(reminder.priority)
            )}>
              {reminder.priority}
            </span>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            Lead: <span className="font-medium">{reminder.leadName}</span>
          </p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <ApperIcon name="Calendar" size={14} />
              {format(parseISO(reminder.reminderDateTime), 'MMM dd, yyyy')}
            </div>
            <div className="flex items-center gap-1">
              <ApperIcon name="Clock" size={14} />
              {format(parseISO(reminder.reminderDateTime), 'hh:mm a')}
            </div>
          </div>
          
          {reminder.notes && (
            <p className="text-sm text-gray-600 bg-gray-50 rounded p-2">
              {reminder.notes}
            </p>
          )}
        </div>
        
        <div className="flex items-center gap-1 ml-4">
          {!reminder.completed && (
            <>
              <button
                onClick={() => handleEditReminder(reminder)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                title="Edit reminder"
              >
                <ApperIcon name="Edit2" size={16} />
              </button>
              <button
                onClick={() => handleCompleteReminder(reminder)}
                className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                title="Mark as completed"
              >
                <ApperIcon name="Check" size={16} />
              </button>
            </>
          )}
          <button
            onClick={() => handleDeleteReminder(reminder)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
            title="Delete reminder"
          >
            <ApperIcon name="Trash2" size={16} />
          </button>
        </div>
      </div>
    </div>
  );

  const ReminderSection = ({ title, reminders, category, icon, emptyMessage }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <ApperIcon name={icon} size={20} className="text-gray-600" />
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
          {reminders.length}
        </span>
      </div>
      
      {reminders.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <ApperIcon name="Calendar" size={48} className="mx-auto mb-3 opacity-50" />
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reminders.map(reminder => (
            <ReminderCard key={reminder.Id} reminder={reminder} category={category} />
          ))}
        </div>
      )}
    </div>
  );

  if (loading) return <Loading />;
  if (error) return <Error error={error} onRetry={loadData} />;

  const categorized = categorizeReminders(reminders);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-3">
            <ApperIcon name="Clock" size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              Follow-up Dashboard
            </h1>
            <p className="text-gray-600">Manage all your follow-up reminders</p>
          </div>
        </div>
        
        <Button
          onClick={() => {
            setEditingReminder(null);
            setEditingLead(null);
            setIsFollowUpModalOpen(true);
          }}
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Follow-up
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-red-200 shadow-sm">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-lg p-2 mr-3">
              <ApperIcon name="AlertTriangle" size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Overdue</p>
              <p className="text-2xl font-bold text-red-600">{categorized.overdue.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-blue-200 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-2 mr-3">
              <ApperIcon name="Calendar" size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Today</p>
              <p className="text-2xl font-bold text-blue-600">{categorized.today.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-yellow-200 shadow-sm">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-lg p-2 mr-3">
              <ApperIcon name="Clock" size={20} className="text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Upcoming</p>
              <p className="text-2xl font-bold text-yellow-600">
                {categorized.tomorrow.length + categorized.thisWeek.length + categorized.later.length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-4 border border-green-200 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-lg p-2 mr-3">
              <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{categorized.completed.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Follow-up Sections */}
      <div className="space-y-8">
        <ReminderSection
          title="Overdue"
          reminders={categorized.overdue}
          category="overdue"
          icon="AlertTriangle"
          emptyMessage="No overdue follow-ups. Great job staying on top of things!"
        />
        
        <ReminderSection
          title="Today"
          reminders={categorized.today}
          category="today"
          icon="Calendar"
          emptyMessage="No follow-ups scheduled for today."
        />
        
        <ReminderSection
          title="Tomorrow"
          reminders={categorized.tomorrow}
          category="tomorrow"
          icon="ArrowRight"
          emptyMessage="No follow-ups scheduled for tomorrow."
        />
        
        <ReminderSection
          title="This Week"
          reminders={categorized.thisWeek}
          category="thisWeek"
          icon="CalendarDays"
          emptyMessage="No follow-ups scheduled for this week."
        />
        
        <ReminderSection
          title="Later"
          reminders={categorized.later}
          category="later"
          icon="Calendar"
          emptyMessage="No follow-ups scheduled for later dates."
        />
        
        <ReminderSection
          title="Completed"
          reminders={categorized.completed}
          category="completed"
          icon="CheckCircle"
          emptyMessage="No completed follow-ups yet."
        />
      </div>

      {/* Follow-up Modal */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        onClose={() => {
          setIsFollowUpModalOpen(false);
          setEditingReminder(null);
          setEditingLead(null);
        }}
        onSave={handleSaveFollowUp}
        lead={editingLead}
        reminder={editingReminder}
      />
    </div>
  );
};

export default FollowUpDashboard;
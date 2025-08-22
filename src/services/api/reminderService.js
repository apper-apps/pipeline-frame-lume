// Local storage key
const STORAGE_KEY = "pipeline_pro_reminders";

// Helper function to get reminders from localStorage
const getStoredReminders = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading reminders from localStorage:", error);
  }
  return [];
};

// Helper function to save reminders to localStorage
const saveRemindersToStorage = (reminders) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error("Error saving reminders to localStorage:", error);
  }
};

export const reminderService = {
  // Get all reminders
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return getStoredReminders();
  },

  // Get reminders by lead ID
  async getByLeadId(leadId) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const reminders = getStoredReminders();
    return reminders.filter(reminder => reminder.leadId === parseInt(leadId));
  },

  // Get reminder by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const reminders = getStoredReminders();
    const reminder = reminders.find(reminder => reminder.Id === parseInt(id));
    if (!reminder) {
      throw new Error("Reminder not found");
    }
    return { ...reminder };
  },

  // Create new reminder
  async create(reminderData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const reminders = getStoredReminders();
    
    // Find highest ID and add 1
    const maxId = Math.max(...reminders.map(reminder => reminder.Id), 0);
    const newReminder = {
      Id: maxId + 1,
      ...reminderData,
      leadId: parseInt(reminderData.leadId),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedReminders = [...reminders, newReminder];
    saveRemindersToStorage(updatedReminders);
    return { ...newReminder };
  },

  // Update reminder
  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const reminders = getStoredReminders();
    const reminderIndex = reminders.findIndex(reminder => reminder.Id === parseInt(id));
    
    if (reminderIndex === -1) {
      throw new Error("Reminder not found");
    }
    
    reminders[reminderIndex] = {
      ...reminders[reminderIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    saveRemindersToStorage(reminders);
    return { ...reminders[reminderIndex] };
  },

  // Delete reminder
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const reminders = getStoredReminders();
    const reminderIndex = reminders.findIndex(reminder => reminder.Id === parseInt(id));
    
    if (reminderIndex === -1) {
      throw new Error("Reminder not found");
    }
    
    const updatedReminders = reminders.filter(reminder => reminder.Id !== parseInt(id));
    saveRemindersToStorage(updatedReminders);
    return true;
  },

  // Mark reminder as completed
  async markCompleted(id) {
    return this.update(id, { completed: true, completedAt: new Date().toISOString() });
  },

  // Get upcoming reminders (due within next 7 days)
  async getUpcoming() {
    await new Promise(resolve => setTimeout(resolve, 150));
    const reminders = getStoredReminders();
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    return reminders.filter(reminder => {
      if (reminder.completed) return false;
      const reminderDate = new Date(reminder.reminderDateTime);
      return reminderDate >= now && reminderDate <= sevenDaysFromNow;
    });
  },

  // Get overdue reminders
  async getOverdue() {
    await new Promise(resolve => setTimeout(resolve, 150));
    const reminders = getStoredReminders();
    const now = new Date();
    
    return reminders.filter(reminder => {
      if (reminder.completed) return false;
      const reminderDate = new Date(reminder.reminderDateTime);
      return reminderDate < now;
    });
  },

  // Clear all reminders
  async clearAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing reminders:", error);
      throw new Error("Failed to clear reminders");
    }
  }
};
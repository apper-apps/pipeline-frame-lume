import leadsData from "@/services/mockData/leads.json";

// Local storage key
const STORAGE_KEY = "pipeline_pro_leads";

// Helper function to get leads from localStorage or fall back to mock data
const getStoredLeads = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }
  return [...leadsData];
};

// Helper function to save leads to localStorage
const saveLeadsToStorage = (leads) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
};

export const leadService = {
  // Get all leads
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return getStoredLeads();
  },

  // Get lead by ID
  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const leads = getStoredLeads();
    const lead = leads.find(lead => lead.Id === parseInt(id));
    if (!lead) {
      throw new Error("Lead not found");
    }
    return { ...lead };
  },

  // Create new lead
  async create(leadData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const leads = getStoredLeads();
    
    // Find highest ID and add 1
    const maxId = Math.max(...leads.map(lead => lead.Id), 0);
    const newLead = {
      Id: maxId + 1,
      ...leadData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    const updatedLeads = [...leads, newLead];
    saveLeadsToStorage(updatedLeads);
    return { ...newLead };
  },

  // Update lead
  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 350));
    const leads = getStoredLeads();
    const leadIndex = leads.findIndex(lead => lead.Id === parseInt(id));
    
    if (leadIndex === -1) {
      throw new Error("Lead not found");
    }
    
    leads[leadIndex] = {
      ...leads[leadIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    saveLeadsToStorage(leads);
    return { ...leads[leadIndex] };
  },

  // Delete lead
  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const leads = getStoredLeads();
    const leadIndex = leads.findIndex(lead => lead.Id === parseInt(id));
    
    if (leadIndex === -1) {
      throw new Error("Lead not found");
    }
    
    const updatedLeads = leads.filter(lead => lead.Id !== parseInt(id));
    saveLeadsToStorage(updatedLeads);
    return true;
  },

  // Update lead column (for drag and drop)
  async updateColumn(id, newColumn) {
    return this.update(id, { column: newColumn });
  }
};
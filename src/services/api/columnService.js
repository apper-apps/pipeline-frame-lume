import columnsData from "@/services/mockData/columns.json";

export const columnService = {
  // Get all columns
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...columnsData];
  },

  // Get column by title
  async getByTitle(title) {
    await new Promise(resolve => setTimeout(resolve, 150));
    const column = columnsData.find(col => col.title === title);
    if (!column) {
      throw new Error("Column not found");
    }
    return { ...column };
  }
};
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const workspaceService = {
  // Get all workspaces
  getAllWorkspaces: async () => {
    try {
      const response = await axios.get(`${API_URL}/workspaces`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a single workspace
  getWorkspace: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/workspaces/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new workspace
  createWorkspace: async (workspaceData) => {
    try {
      const response = await axios.post(`${API_URL}/workspaces`, workspaceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a workspace
  updateWorkspace: async (id, workspaceData) => {
    try {
      const response = await axios.put(`${API_URL}/workspaces/${id}`, workspaceData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a workspace
  deleteWorkspace: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/workspaces/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Add a template to a workspace
  addTemplate: async (workspaceId, templateId) => {
    try {
      const response = await axios.post(`${API_URL}/workspaces/${workspaceId}/templates`, {
        templateId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Remove a template from a workspace
  removeTemplate: async (workspaceId, templateId) => {
    try {
      const response = await axios.delete(`${API_URL}/workspaces/${workspaceId}/templates/${templateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 
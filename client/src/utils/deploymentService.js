import { axiosInstance } from './authService';

export const deploymentService = {
  // Deploy a template
  deployTemplate: async (templateId) => {
    try {
      const response = await axiosInstance.post(`/deployments/${templateId}/deploy`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all deployments
  getDeployments: async () => {
    try {
      const response = await axiosInstance.get('/deployments');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get a specific deployment
  getDeployment: async (id) => {
    try {
      const response = await axiosInstance.get(`/deployments/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

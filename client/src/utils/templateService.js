import { axiosInstance } from './authService';

export const templateService = {
  // Get all templates
  getAllTemplates: async () => {
    try {
      console.log('Fetching templates...');
      const response = await axiosInstance.get('/templates');
      console.log('Template API Response:', response);
      console.log('Template Data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching templates:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  // Get a single template
  getTemplate: async (id) => {
    try {
      const response = await axiosInstance.get(`/templates/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create a new template
  createTemplate: async (templateData) => {
    try {
      const response = await axiosInstance.post('/templates', templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update a template
  updateTemplate: async (id, templateData) => {
    try {
      const response = await axiosInstance.put(`/templates/${id}`, templateData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete a template
  deleteTemplate: async (id) => {
    try {
      const response = await axiosInstance.delete(`/templates/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's templates
  getUserTemplates: async () => {
    try {
      const response = await axiosInstance.get('/templates/user/templates');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get public templates
  getPublicTemplates: async () => {
    try {
      const response = await axiosInstance.get('/templates/public/templates');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Submit template data
  submitTemplateData: async (templateData) => {
    try {
      console.log('Submitting template data:', templateData);
      const response = await axiosInstance.post('/template-data', templateData);
      return response.data;
    } catch (error) {
      console.error('Error submitting template data:', error);
      throw error;
    }
  },

  // Get template submissions
  getTemplateSubmissions: async (templateId) => {
    try {
      const response = await axiosInstance.get(`/template-data/template/${templateId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get submission by ID
  getSubmission: async (submissionId) => {
    try {
      const response = await axiosInstance.get(`/template-data/${submissionId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 
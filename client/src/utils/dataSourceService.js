import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const dataSourceService = {
  getAllDataSources: async () => {
    const response = await axios.get(`${API_URL}/data-sources`);
    return response.data;
  },

  createDataSource: async (dataSource) => {
    const response = await axios.post(`${API_URL}/data-sources`, dataSource);
    return response.data;
  },

  updateDataSource: async (id, dataSource) => {
    const response = await axios.put(`${API_URL}/data-sources/${id}`, dataSource);
    return response.data;
  },

  deleteDataSource: async (id) => {
    const response = await axios.delete(`${API_URL}/data-sources/${id}`);
    return response.data;
  },

  testConnection: async (dataSource) => {
    const response = await axios.post(`${API_URL}/data-sources/test`, dataSource);
    return response.data;
  },

  executeQuery: async (dataSourceId, query) => {
    const response = await axios.post(`${API_URL}/data-sources/${dataSourceId}/execute`, { query });
    return response.data;
  }
}; 
import { axiosInstance } from './authService';

export const dataSourceService = {
  getAllDataSources: async () => {
    const response = await axiosInstance.get('/data-sources');
    return response.data;
  },

  createDataSource: async (dataSource) => {
    const response = await axiosInstance.post('/data-sources', dataSource);
    return response.data;
  },

  updateDataSource: async (id, dataSource) => {
    const response = await axiosInstance.put(`/data-sources/${id}`, dataSource);
    return response.data;
  },

  deleteDataSource: async (id) => {
    const response = await axiosInstance.delete(`/data-sources/${id}`);
    return response.data;
  },

  testConnection: async (dataSource) => {
    const response = await axiosInstance.post('/data-sources/test', dataSource);
    return response.data;
  },

  executeQuery: async (dataSourceId, query) => {
    const response = await axiosInstance.post(`/data-sources/${dataSourceId}/execute`, { query });
    return response.data;
  }
}; 
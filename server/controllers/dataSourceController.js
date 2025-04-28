const DataSource = require('../models/DataSource');
const axios = require('axios');

exports.getAllDataSources = async (req, res) => {
  try {
    const dataSources = await DataSource.find();
    res.json(dataSources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createDataSource = async (req, res) => {
  try {
    const dataSource = new DataSource(req.body);
    const savedDataSource = await dataSource.save();
    res.status(201).json(savedDataSource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateDataSource = async (req, res) => {
  try {
    const dataSource = await DataSource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!dataSource) {
      return res.status(404).json({ message: 'Data source not found' });
    }
    res.json(dataSource);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteDataSource = async (req, res) => {
  try {
    const dataSource = await DataSource.findByIdAndDelete(req.params.id);
    if (!dataSource) {
      return res.status(404).json({ message: 'Data source not found' });
    }
    res.json({ message: 'Data source deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.testConnection = async (req, res) => {
  try {
    const { type, config } = req.body;
    
    switch (type) {
      case 'rest':
        const response = await axios({
          method: config.method || 'GET',
          url: config.url,
          headers: config.headers,
          data: config.body,
          params: config.queryParams
        });
        res.json({ success: true, data: response.data });
        break;
        
      case 'graphql':
        // Implement GraphQL connection test
        res.json({ success: true, message: 'GraphQL connection test not implemented yet' });
        break;
        
      case 'database':
        // Implement database connection test
        res.json({ success: true, message: 'Database connection test not implemented yet' });
        break;
        
      default:
        res.status(400).json({ message: 'Unsupported data source type' });
    }
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

exports.executeQuery = async (req, res) => {
  try {
    const dataSource = await DataSource.findById(req.params.id);
    if (!dataSource) {
      return res.status(404).json({ message: 'Data source not found' });
    }

    const { query } = req.body;
    
    switch (dataSource.type) {
      case 'rest':
        const response = await axios({
          method: dataSource.config.method || 'GET',
          url: dataSource.config.url,
          headers: dataSource.config.headers,
          data: dataSource.config.body,
          params: dataSource.config.queryParams
        });
        res.json({ success: true, data: response.data });
        break;
        
      case 'graphql':
        // Implement GraphQL query execution
        res.json({ success: true, message: 'GraphQL query execution not implemented yet' });
        break;
        
      case 'database':
        // Implement database query execution
        res.json({ success: true, message: 'Database query execution not implemented yet' });
        break;
        
      default:
        res.status(400).json({ message: 'Unsupported data source type' });
    }
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
}; 
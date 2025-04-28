import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Alert,
  CircularProgress
} from '@mui/material';
import { dataSourceService } from '../utils/dataSourceService';

const DataSourceManager = ({ onDataSourceSelect }) => {
  const [dataSources, setDataSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDataSource, setNewDataSource] = useState({
    name: '',
    type: 'rest',
    config: {
      url: '',
      method: 'GET',
      headers: {},
      body: '',
      queryParams: {}
    }
  });

  useEffect(() => {
    fetchDataSources();
  }, []);

  const fetchDataSources = async () => {
    try {
      setLoading(true);
      const sources = await dataSourceService.getAllDataSources();
      setDataSources(sources);
      setError(null);
    } catch (err) {
      setError('Failed to load data sources');
      console.error('Error fetching data sources:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDataSource = async () => {
    try {
      const source = await dataSourceService.createDataSource(newDataSource);
      setDataSources([...dataSources, source]);
      setOpenDialog(false);
      setNewDataSource({
        name: '',
        type: 'rest',
        config: {
          url: '',
          method: 'GET',
          headers: {},
          body: '',
          queryParams: {}
        }
      });
    } catch (err) {
      setError('Failed to create data source');
      console.error('Error creating data source:', err);
    }
  };

  const handleTestConnection = async (source) => {
    try {
      const result = await dataSourceService.testConnection(source);
      alert('Connection successful!');
    } catch (err) {
      alert('Connection failed: ' + err.message);
    }
  };

  const handleDeleteDataSource = async (id) => {
    try {
      await dataSourceService.deleteDataSource(id);
      setDataSources(dataSources.filter(ds => ds._id !== id));
    } catch (err) {
      setError('Failed to delete data source');
      console.error('Error deleting data source:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Data Sources</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Add Data Source
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2}>
        {dataSources.map((source) => (
          <Grid item xs={12} sm={6} md={4} key={source._id}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6">{source.name}</Typography>
              <Typography color="textSecondary" gutterBottom>
                Type: {source.type}
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => onDataSourceSelect(source)}
                  sx={{ mr: 1 }}
                >
                  Use
                </Button>
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleTestConnection(source)}
                  sx={{ mr: 1 }}
                >
                  Test
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteDataSource(source._id)}
                >
                  Delete
                </Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add New Data Source</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Name"
                value={newDataSource.name}
                onChange={(e) => setNewDataSource({ ...newDataSource, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Type</InputLabel>
                <Select
                  value={newDataSource.type}
                  onChange={(e) => setNewDataSource({ ...newDataSource, type: e.target.value })}
                >
                  <MenuItem value="rest">REST API</MenuItem>
                  <MenuItem value="graphql">GraphQL</MenuItem>
                  <MenuItem value="database">Database</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {newDataSource.type === 'rest' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="URL"
                    value={newDataSource.config.url}
                    onChange={(e) => setNewDataSource({
                      ...newDataSource,
                      config: { ...newDataSource.config, url: e.target.value }
                    })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Method</InputLabel>
                    <Select
                      value={newDataSource.config.method}
                      onChange={(e) => setNewDataSource({
                        ...newDataSource,
                        config: { ...newDataSource.config, method: e.target.value }
                      })}
                    >
                      <MenuItem value="GET">GET</MenuItem>
                      <MenuItem value="POST">POST</MenuItem>
                      <MenuItem value="PUT">PUT</MenuItem>
                      <MenuItem value="DELETE">DELETE</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateDataSource} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DataSourceManager; 
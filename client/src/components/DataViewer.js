import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Grid
} from '@mui/material';
import { dataSourceService } from '../utils/dataSourceService';

const DataViewer = ({ dataSource }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (dataSource) {
      fetchData();
    }
  }, [dataSource]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const result = await dataSourceService.executeQuery(dataSource._id, query);
      setData(result.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data: ' + err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (event) => {
    setQuery(event.target.value);
  };

  const handleExecuteQuery = () => {
    fetchData();
  };

  if (!dataSource) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="textSecondary">
          Please select a data source to view data
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        {dataSource.name} - Data Viewer
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Query"
            value={query}
            onChange={handleQueryChange}
            placeholder="Enter your query here..."
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExecuteQuery}
          >
            Execute Query
          </Button>
        </Grid>
      </Grid>

      {data.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {Object.keys(data[0]).map((key) => (
                  <TableCell key={key}>{key}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index}>
                  {Object.values(row).map((value, i) => (
                    <TableCell key={i}>
                      {typeof value === 'object' ? JSON.stringify(value) : value}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography color="textSecondary">
          No data to display. Execute a query to see results.
        </Typography>
      )}
    </Box>
  );
};

export default DataViewer; 
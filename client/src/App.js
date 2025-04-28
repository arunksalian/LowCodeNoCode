import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { authService } from './utils/authService';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ComponentLibrary from './components/ComponentLibrary';
import Canvas from './components/Canvas';
import PropertyEditor from './components/PropertyEditor';
import SaveTemplateButton from './components/SaveTemplateButton';
import TemplateViewer from './components/TemplateViewer';
import TemplateList from './components/TemplateList';
import SubmissionsList from './components/SubmissionsList';
import Login from './components/Login';
import { templateService } from './utils/templateService';
import DataSourceManager from './components/DataSourceManager';
import DataViewer from './components/DataViewer';

// Private Route component
const PrivateRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function App() {
  const [selectedComponent, setSelectedComponent] = React.useState(null);
  const [components, setComponents] = React.useState([]);
  const [savedTemplates, setSavedTemplates] = React.useState([]);
  const [selectedTemplate, setSelectedTemplate] = React.useState(null);
  const [selectedDataSource, setSelectedDataSource] = useState(null);

  React.useEffect(() => {
    console.log('Initial template fetch');
    fetchTemplates();
  }, []);

  React.useEffect(() => {
    console.log('Current saved templates:', savedTemplates);
  }, [savedTemplates]);

  const fetchTemplates = async () => {
    try {
      const templates = await templateService.getAllTemplates();
      setSavedTemplates(Array.isArray(templates) ? templates : []);
      console.log('Fetched templates:', templates);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setSavedTemplates([]);
    }
  };

  const handleDrop = (item, position) => {
    const newComponent = {
      id: Date.now(),
      type: item.type,
      properties: { ...item.defaultProperties } || {},
      position
    };
    
    setComponents(prevComponents => [...prevComponents, newComponent]);
  };

  const handleComponentUpdate = (updatedProps) => {
    setComponents(prevComponents => 
      prevComponents.map(comp => 
        comp.id === selectedComponent?.id 
          ? { ...comp, properties: updatedProps }
          : comp
      )
    );
  };

  const handleSaveTemplate = async (template) => {
    try {
      console.log('Saving template:', template);
      
      const savedTemplate = await templateService.createTemplate(template);
      console.log('Template saved successfully:', savedTemplate);
      
      await fetchTemplates();
      
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Error saving template: ' + (error.response?.data?.message || error.message));
    }
  };

  const loadTemplate = (template) => {
    setComponents(template.components);
    setSelectedTemplate(template);
  };

  const BuilderView = () => (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <SaveTemplateButton components={components} onSave={handleSaveTemplate} />
      </Box>
      <Grid container spacing={2} sx={{ flex: 1, p: 2 }}>
        <Grid item xs={2}>
          <ComponentLibrary />
          <Box sx={{ mt: 2 }}>
            <h3>Saved Templates</h3>
            {savedTemplates && savedTemplates.length > 0 ? savedTemplates.map(template => (
              <Box 
                key={template._id} 
                sx={{ 
                  p: 1, 
                  mb: 1, 
                  border: '1px solid #ccc',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#f5f5f5'
                  }
                }}
                onClick={() => loadTemplate(template)}
              >
                {template.name}
              </Box>
            )) : (
              <Box sx={{ p: 1, color: 'text.secondary' }}>
                No templates available
              </Box>
            )}
          </Box>
        </Grid>
        <Grid item xs={7}>
          <Canvas
            components={components}
            onDrop={handleDrop}
            onSelectComponent={setSelectedComponent}
          />
        </Grid>
        <Grid item xs={3}>
          <PropertyEditor
            component={selectedComponent}
            onUpdate={handleComponentUpdate}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const DataIntegrationView = () => (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2} sx={{ flex: 1, p: 2 }}>
        <Grid item xs={4}>
          <DataSourceManager onDataSourceSelect={setSelectedDataSource} />
        </Grid>
        <Grid item xs={8}>
          <DataViewer dataSource={selectedDataSource} />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <Router>
      <DndProvider backend={HTML5Backend}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Button component={Link} to="/" variant="contained" sx={{ mr: 2 }}>
                Builder
              </Button>
              <Button component={Link} to="/data" variant="contained" sx={{ mr: 2 }}>
                Data Integration
              </Button>
              <Button component={Link} to="/view" variant="contained">
                View Template
              </Button>
            </Box>
            {authService.isAuthenticated() ? (
              <Box>
                <Typography component="span" sx={{ mr: 2 }}>
                  {authService.getCurrentUser()?.email}
                </Typography>
                <Button variant="outlined" color="error" onClick={authService.logout}>
                  Logout
                </Button>
              </Box>
            ) : (
              <Button component={Link} to="/login" variant="contained" color="secondary">
                Login
              </Button>
            )}
          </Box>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <BuilderView />
                </PrivateRoute>
              }
            />
            <Route
              path="/data"
              element={
                <PrivateRoute>
                  <DataIntegrationView />
                </PrivateRoute>
              }
            />
            <Route
              path="/view/:id"
              element={
                <PrivateRoute>
                  <TemplateViewer />
                </PrivateRoute>
              }
            />
            <Route
              path="/view"
              element={
                <PrivateRoute>
                  <TemplateList templates={Array.isArray(savedTemplates) ? savedTemplates : []} />
                </PrivateRoute>
              }
            />
            <Route
              path="/submissions/:templateId"
              element={
                <PrivateRoute>
                  <SubmissionsList />
                </PrivateRoute>
              }
            />
          </Routes>
        </ThemeProvider>
      </DndProvider>
    </Router>
  );
}

export default App;

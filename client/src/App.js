import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import ComponentLibrary from './components/ComponentLibrary';
import Canvas from './components/Canvas';
import PropertyEditor from './components/PropertyEditor';
import SaveTemplateButton from './components/SaveTemplateButton';
import axios from 'axios';

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

  // Fetch saved templates when component mounts
  React.useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await axios.get('/api/templates');
      setSavedTemplates(response.data);
      console.log('Fetched templates:', response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleDrop = (item, position) => {
    const newComponent = {
      id: Date.now(),
      type: item.type,
      properties: { ...item.defaultProperties } || {},
      position
    };
    
    // Update components state by adding the new component
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
      
      // For development, we're not using authentication
      const response = await axios.post('/api/templates', template);
      console.log('Template saved successfully:', response.data);
      
      // Refresh templates after saving
      await fetchTemplates();
      
      // You might want to show a success message to the user
      alert('Template saved successfully!');
    } catch (error) {
      console.error('Error saving template:', error.response?.data || error.message);
      // You might want to show an error message to the user
      alert('Error saving template: ' + (error.response?.data?.message || error.message));
    }
  };

  const loadTemplate = (template) => {
    setComponents(template.components);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <SaveTemplateButton components={components} onSave={handleSaveTemplate} />
          </Box>
          <Grid container spacing={2} sx={{ flex: 1, p: 2 }}>
            <Grid item xs={2}>
              <ComponentLibrary />
              <Box sx={{ mt: 2 }}>
                <h3>Saved Templates</h3>
                {savedTemplates.map(template => (
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
                ))}
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
      </ThemeProvider>
    </DndProvider>
  );
}

export default App;

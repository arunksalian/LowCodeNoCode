import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, CircularProgress, Alert, Button } from '@mui/material';
import RenderComponent from './RenderComponent';
import { templateService } from '../utils/templateService';
import { deploymentService } from '../utils/deploymentService';
import { useParams, useNavigate } from 'react-router-dom';

const TemplateViewer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [template, setTemplate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [deploying, setDeploying] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState(null);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        setLoading(true);
        console.log('Fetching template with ID:', id);
        const data = await templateService.getTemplate(id);
        console.log('Received template data:', data);
        setTemplate(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching template:', err);
        setError(
          err.response?.data?.message ||
          'Failed to load template. Please try again later.'
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      console.log('Fetching template with ID:', id);
      fetchTemplate();
    } else {
      console.log('No template ID in URL');
      setTemplate(null);
      setError('No template selected');
      navigate('/view');
    }
  }, [id, navigate]);



  const handleDeploy = async () => {
    try {
      setDeploying(true);
      setError(null);
      const deployment = await deploymentService.deployTemplate(id);
      setDeploymentUrl(deployment.url);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to deploy template');
    } finally {
      setDeploying(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <CircularProgress />;
    }

    if (error) {
      return <Alert severity="error">{error}</Alert>;
    }

    if (!template) {
      return <Alert severity="info">No template found</Alert>;
    }

    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5">{template.name}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDeploy}
            disabled={deploying}
          >
            {deploying ? 'Deploying...' : 'Deploy Template'}
          </Button>
        </Box>
        {deploymentUrl && (
          <Alert severity="success">
            Template deployed! Visit: <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">{deploymentUrl}</a>
          </Alert>
        )}
        <Paper sx={{ p: 3, position: 'relative', minHeight: '400px' }}>
          {template.components?.map((component) => (
            <RenderComponent
              key={component.id}
              component={component}
              onUpdate={() => {}}
              isEditing={false}
            />
          ))}
        </Paper>
      </>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 4 }}>
      {renderContent()}
    </Box>
  );

  const handleInputChange = (componentId, value) => {
    setFormData(prev => ({
      ...prev,
      [componentId]: { value, isValid: true }
    }));
  };

  const handleSubmit = async () => {
    try {
      const templateData = {
        templateId: id,
        name: `${template.name} - Submission ${new Date().toLocaleString()}`,
        data: Object.entries(formData).map(([componentId, data]) => ({
          componentId,
          ...data
        }))
      };

      const response = await templateService.submitTemplateData(templateData);
      console.log('Template data saved:', response);
      alert('Data saved successfully!');
      navigate('/submissions');
    } catch (error) {
      console.error('Error saving template data:', error);
      alert('Error saving data: ' + error.message);
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <div>
            <Typography variant="h4" gutterBottom>{template.name}</Typography>
            {template.description && (
              <Typography variant="body1" color="textSecondary">
                {template.description}
              </Typography>
            )}
          </div>
          <Button
            variant="contained"
            color={isEditing ? 'success' : 'primary'}
            onClick={() => isEditing ? handleSubmit() : setIsEditing(true)}
          >
            {isEditing ? 'Submit' : 'Fill Template'}
          </Button>
        </Box>
      </Paper>

      <Box sx={{ 
        position: 'relative',
        minHeight: '500px',
        border: '1px dashed #ccc',
        p: 2,
        backgroundColor: '#fafafa'
      }}>
        {template.components.map((component) => (
          <Box
            key={component.id}
            sx={{
              position: 'absolute',
              left: component.position.x,
              top: component.position.y,
              zIndex: 1
            }}
          >
            <RenderComponent
              type={component.type}
              properties={{
                ...component.properties,
                value: formData[component.id]?.value,
                disabled: !isEditing,
                onChange: (value) => handleInputChange(component.id, value)
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default TemplateViewer; 
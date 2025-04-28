import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import RenderComponent from './RenderComponent';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
  backgroundColor: '#f5f5f5',
  position: 'relative',
  minHeight: '80vh',
  overflow: 'auto',
}));

const ComponentWrapper = styled('div')(({ theme }) => ({
  position: 'absolute',
  cursor: 'pointer',
  padding: theme.spacing(1),
  '&:hover': {
    outline: `2px solid ${theme.palette.primary.main}`,
  },
}));

function Canvas() {
  const [components, setComponents] = useState([]);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleDrop = (item, position) => {
    const newComponent = {
      id: `${item.type}_${Date.now()}`,
      type: item.type,
      position,
      properties: { ...item.defaultProperties },
    };
    setComponents(prevComponents => {
      const updatedComponents = [...prevComponents, newComponent];
      saveTemplate(updatedComponents);
      return updatedComponents;
    });
  };

  const saveTemplate = async (updatedComponents) => {
    try {
      setIsSaving(true);
      setError(null);
      const response = await fetch('http://localhost:5000/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          name: 'My Template',
          description: 'Auto-saved template',
          components: updatedComponents,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to save template');
      }
    } catch (err) {
      console.error('Error saving template:', err);
      setError('Failed to save template');
    } finally {
      setIsSaving(false);
    }
  };

  const [, drop] = useDrop(() => ({
    accept: 'COMPONENT',
    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      const canvasRect = document.getElementById('canvas').getBoundingClientRect();
      const position = {
        x: offset.x - canvasRect.left,
        y: offset.y - canvasRect.top,
      };
      handleDrop(item, position);
    },
  }), []);

  return (
    <StyledPaper 
      id="canvas"
      ref={drop}
    >
      {components.map((component) => (
        <ComponentWrapper
          key={component.id}
          style={{
            left: component.position.x,
            top: component.position.y,
          }}
          onClick={() => setSelectedComponent(component)}
        >
          <RenderComponent component={component} />
        </ComponentWrapper>
      ))}
      {error && (
        <div style={{ color: 'red', position: 'absolute', bottom: 10, right: 10 }}>
          {error}
        </div>
      )}
      {isSaving && (
        <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
          Saving...
        </div>
      )}
    </StyledPaper>
  );
}

export default Canvas;

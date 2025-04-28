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

function Canvas({ components, onDrop, onSelectComponent }) {
  const [validationState, setValidationState] = useState({});
  const [formContext, setFormContext] = useState({});

  // Make components available globally for the property editor
  window.lowCodeComponents = components;

  const handleComponentChange = (componentId, value) => {
    setFormContext(prev => ({
      ...prev,
      [componentId]: value
    }));
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
      onDrop(item, position);
    },
  }));

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
          onClick={() => onSelectComponent(component)}
        >
          <RenderComponent 
            {...component} 
            formContext={formContext}
            onValidationChange={(isValid) => {
              setValidationState(prev => ({
                ...prev,
                [component.id]: isValid
              }));
            }}
            onChange={(value) => handleComponentChange(component.id, value)}
          />
        </ComponentWrapper>
      ))}
    </StyledPaper>
  );
}

export default Canvas;

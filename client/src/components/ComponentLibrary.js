import React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useDrag } from 'react-dnd';

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  padding: theme.spacing(2),
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  border: '1px solid #ccc',
  marginBottom: theme.spacing(1),
  cursor: 'move',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const DraggableComponent = ({ type, label, defaultProperties }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type, defaultProperties },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <StyledListItem
      ref={drag}
      button
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <Typography>{label}</Typography>
    </StyledListItem>
  );
};

const components = [
  // Form Components
  {
    type: 'input',
    label: 'Text Input',
    defaultProperties: {
      label: 'Input Label',
      placeholder: 'Enter text...',
      required: false,
      type: 'text',
      validation: {
        minLength: 0,
        maxLength: 100,
        pattern: '',
        patternError: '',
        custom: '',
        conditions: [],
        conditionGroups: []
      },
    },
  },
  {
    type: 'select',
    label: 'Select Dropdown',
    defaultProperties: {
      label: 'Select Option',
      options: 'Option 1,Option 2,Option 3',
      required: false,
      validation: {
        required: false,
        conditions: [],
        conditionGroups: []
      },
    },
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    defaultProperties: {
      label: 'Checkbox Label',
      checked: false,
    },
  },
  { type: 'input', label: 'Text Input', defaultProperties: { label: 'Text Input', placeholder: 'Enter text...' } },
  { type: 'select', label: 'Select', defaultProperties: { label: 'Select', options: 'Option 1,Option 2,Option 3' } },
  { type: 'checkbox', label: 'Checkbox', defaultProperties: { label: 'Checkbox' } },
  { type: 'radio', label: 'Radio Group', defaultProperties: { label: 'Radio Group', options: 'Option 1,Option 2,Option 3' } }
];

function ComponentLibrary() {
  return (
    <StyledPaper>
      <Typography variant="h6" gutterBottom>
        Components
      </Typography>
      <List>
        {components.map((component) => (
          <DraggableComponent key={component.type} {...component} />
        ))}
      </List>
    </StyledPaper>
  );
}

export default ComponentLibrary;

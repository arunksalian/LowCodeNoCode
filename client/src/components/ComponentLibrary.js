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
  {
    type: 'radio',
    label: 'Radio Group',
    defaultProperties: {
      label: 'Radio Group',
      options: 'Option 1,Option 2,Option 3',
      defaultValue: 'Option 1',
    },
  },
  {
    type: 'textarea',
    label: 'Text Area',
    defaultProperties: {
      label: 'Text Area Label',
      placeholder: 'Enter long text...',
      rows: 4,
      validation: {
        required: false,
        minLength: 0,
        maxLength: 1000,
        conditions: [],
        conditionGroups: []
      },
    },
  },
  {
    type: 'datepicker',
    label: 'Date Picker',
    defaultProperties: {
      label: 'Select Date',
      required: false,
    },
  },

  // Layout Components
  {
    type: 'container',
    label: 'Container',
    defaultProperties: {
      padding: '16px',
      backgroundColor: '#ffffff',
      borderRadius: '4px',
    },
  },
  {
    type: 'grid',
    label: 'Grid Layout',
    defaultProperties: {
      columns: 2,
      spacing: 2,
    },
  },
  {
    type: 'card',
    label: 'Card',
    defaultProperties: {
      title: 'Card Title',
      subtitle: 'Card Subtitle',
      elevation: 1,
    },
  },

  // Display Components
  {
    type: 'text',
    label: 'Text Block',
    defaultProperties: {
      content: 'Text content goes here',
      variant: 'body1',
      color: 'textPrimary',
    },
  },
  {
    type: 'button',
    label: 'Button',
    defaultProperties: {
      text: 'Click Me',
      variant: 'contained',
      color: 'primary',
      size: 'medium',
    },
  },
  {
    type: 'divider',
    label: 'Divider',
    defaultProperties: {
      orientation: 'horizontal',
      margin: '16px 0',
    },
  },
  {
    type: 'icon',
    label: 'Icon',
    defaultProperties: {
      name: 'star',
      color: 'primary',
      size: 'medium',
    },
  },
  {
    type: 'image',
    label: 'Image',
    defaultProperties: {
      src: 'https://via.placeholder.com/150',
      alt: 'Image',
      width: '100%',
      height: 'auto',
    },
  },
  {
    type: 'table',
    label: 'Table',
    defaultProperties: {
      headers: 'Column 1,Column 2,Column 3',
      data: '[]',
      pagination: true,
    },
  }
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

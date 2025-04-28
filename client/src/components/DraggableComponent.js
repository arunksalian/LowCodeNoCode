import React from 'react';
import { useDrag } from 'react-dnd';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import Icon from '@mui/material/Icon';

const DraggableComponent = ({ type, label, defaultProperties }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'COMPONENT',
    item: { type, defaultProperties },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <ListItem
      ref={drag}
      button
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: 'move',
      }}
    >
      <ListItemIcon>
        <Icon>{getIconForType(type)}</Icon>
      </ListItemIcon>
      <ListItemText primary={label} />
    </ListItem>
  );
};

const getIconForType = (type) => {
  const iconMap = {
    input: 'text_fields',
    select: 'arrow_drop_down',
    checkbox: 'check_box',
    radio: 'radio_button_checked',
  };
  return iconMap[type] || 'widgets';
};

export default DraggableComponent;

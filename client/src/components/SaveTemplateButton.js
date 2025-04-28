import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import SaveIcon from '@mui/icons-material/Save';

const StyledButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(1),
}));

function SaveTemplateButton({ components, onSave }) {
  const [open, setOpen] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setTemplateName('');
    setDescription('');
    setIsPublic(false);
  };

  const handleSave = () => {
    if (!templateName.trim()) {
      return;
    }

    const template = {
      name: templateName,
      description,
      isPublic,
      components,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    onSave(template);
    handleClose();
  };

  return (
    <>
      <StyledButton
        variant="contained"
        color="primary"
        startIcon={<SaveIcon />}
        onClick={handleClickOpen}
      >
        Save Template
      </StyledButton>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Save Template</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Template Name"
            type="text"
            fullWidth
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            required
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                color="primary"
              />
            }
            label="Make Public"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={!templateName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default SaveTemplateButton; 
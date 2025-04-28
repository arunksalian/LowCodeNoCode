import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import { workspaceService } from '../utils/workspaceService';
import TemplateViewer from './TemplateViewer';

const WorkspaceViewer = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      const data = await workspaceService.getAllWorkspaces();
      setWorkspaces(data);
      setError(null);
    } catch (err) {
      setError('Failed to load workspaces. Please try again later.');
      console.error('Error fetching workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async () => {
    try {
      const workspace = await workspaceService.createWorkspace(newWorkspace);
      setWorkspaces([...workspaces, workspace]);
      setOpenDialog(false);
      setNewWorkspace({ name: '', description: '' });
    } catch (err) {
      setError('Failed to create workspace. Please try again.');
      console.error('Error creating workspace:', err);
    }
  };

  const handleDeleteWorkspace = async (id) => {
    try {
      await workspaceService.deleteWorkspace(id);
      setWorkspaces(workspaces.filter(w => w._id !== id));
      if (selectedWorkspace?._id === id) {
        setSelectedWorkspace(null);
      }
    } catch (err) {
      setError('Failed to delete workspace. Please try again.');
      console.error('Error deleting workspace:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Workspaces</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Create New Workspace
        </Button>
      </Box>

      <Grid container spacing={3}>
        {workspaces.map((workspace) => (
          <Grid item xs={12} sm={6} md={4} key={workspace._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{workspace.name}</Typography>
                {workspace.description && (
                  <Typography color="textSecondary" paragraph>
                    {workspace.description}
                  </Typography>
                )}
                <Typography variant="body2">
                  Templates: {workspace.templates.length}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => setSelectedWorkspace(workspace)}
                >
                  View
                </Button>
                <Button
                  size="small"
                  color="error"
                  onClick={() => handleDeleteWorkspace(workspace._id)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {selectedWorkspace && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            {selectedWorkspace.name} - Templates
          </Typography>
          <Grid container spacing={2}>
            {selectedWorkspace.templates.map((template) => (
              <Grid item xs={12} key={template._id}>
                <TemplateViewer templateId={template._id} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Create New Workspace</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Name"
            fullWidth
            value={newWorkspace.name}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={newWorkspace.description}
            onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateWorkspace} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkspaceViewer; 
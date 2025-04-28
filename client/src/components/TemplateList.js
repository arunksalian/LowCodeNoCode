import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button,
  Grid,
  Chip
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';

const TemplateList = ({ templates = [] }) => {
  const navigate = useNavigate();

  // Ensure templates is an array
  const templateArray = Array.isArray(templates) ? templates : [];

  if (templateArray.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No templates available
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Available Templates
      </Typography>
      <Grid container spacing={3}>
        {templateArray.map((template) => (
          <Grid item xs={12} sm={6} md={4} key={template._id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {template.name}
                </Typography>
                {template.description && (
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {template.description}
                  </Typography>
                )}
                <Box sx={{ mb: 2 }}>
                  <Chip 
                    label={`${template.components?.length || 0} components`}
                    size="small"
                    sx={{ mr: 1 }}
                  />
                  {template.isPublic && (
                    <Chip 
                      label="Public"
                      size="small"
                      color="primary"
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary">
                  Created {formatDistanceToNow(new Date(template.createdAt))} ago
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => navigate(`/view/${template._id}`)}
                >
                  View Template
                </Button>
                <Button 
                  size="small"
                  onClick={() => navigate('/', { state: { templateId: template._id } })}
                >
                  Use as Base
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TemplateList;

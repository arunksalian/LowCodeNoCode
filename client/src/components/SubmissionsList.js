import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Collapse,
  Button
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { templateService } from '../utils/templateService';

const SubmissionRow = ({ submission }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{submission.name}</TableCell>
        <TableCell>
          <Chip 
            label={submission.status} 
            color={
              submission.status === 'approved' ? 'success' :
              submission.status === 'rejected' ? 'error' :
              submission.status === 'submitted' ? 'primary' : 'default'
            }
            size="small"
          />
        </TableCell>
        <TableCell>{formatDistanceToNow(new Date(submission.createdAt))} ago</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Submission Details
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Field</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submission.data.map((field) => (
                    <TableRow key={field.componentId}>
                      <TableCell component="th" scope="row">
                        {field.componentId}
                      </TableCell>
                      <TableCell>{field.value?.toString() || 'N/A'}</TableCell>
                      <TableCell>
                        <Chip 
                          label={field.isValid ? 'Valid' : 'Invalid'} 
                          color={field.isValid ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const SubmissionsList = () => {
  const { templateId } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const data = await templateService.getTemplateSubmissions(templateId);
        setSubmissions(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissions();
  }, [templateId]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading submissions...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (submissions.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          No submissions yet
        </Typography>
        <Button 
          variant="contained" 
          sx={{ mt: 2 }}
          onClick={() => window.history.back()}
        >
          Back to Template
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4">Template Submissions</Typography>
        <Button 
          variant="outlined" 
          onClick={() => window.history.back()}
        >
          Back to Template
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Name</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {submissions.map((submission) => (
              <SubmissionRow key={submission._id} submission={submission} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubmissionsList;

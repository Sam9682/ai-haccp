import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Alert
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import api from '../services/api';

export default function TemperatureLogs() {
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  
  console.log('TemperatureLogs component rendered, open:', open);
  
  useEffect(() => {
    console.log('Dialog open state changed:', open);
  }, [open]);
  const [formData, setFormData] = useState({
    location: '',
    temperature: '',
    equipment_id: '',
    is_within_limits: true
  });

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/temperature-logs');
      setLogs(response.data);
    } catch (error) {
      console.error('Error fetching temperature logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddClick = () => {
    console.log('Add button clicked, current open state:', open);
    setOpen(true);
    console.log('Set open to true');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    try {
      const temp = parseFloat(formData.temperature);
      const payload = {
        location: formData.location,
        temperature: temp,
        equipment_id: formData.equipment_id || null,
        is_within_limits: temp >= -18 && temp <= 4
      };
      console.log('Sending payload:', payload);
      
      const response = await api.post('/temperature-logs', payload);
      console.log('Response:', response.data);
      
      setOpen(false);
      setFormData({ location: '', temperature: '', equipment_id: '', is_within_limits: true });
      fetchLogs();
    } catch (error) {
      console.error('Error creating temperature log:', error);
      alert('Error creating temperature log: ' + (error.response?.data?.detail || error.message));
    }
  };

  const getStatusChip = (isWithinLimits) => {
    return (
      <Chip
        label={isWithinLimits ? 'Normal' : 'Alert'}
        color={isWithinLimits ? 'success' : 'error'}
        size="small"
      />
    );
  };

  if (loading) {
    return <Typography>Loading temperature logs...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Temperature Monitoring</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          Add Temperature Log
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        Safe temperature range: -18°C to 4°C for refrigerated items
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Location</TableCell>
              <TableCell>Temperature (°C)</TableCell>
              <TableCell>Equipment ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date/Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.location}</TableCell>
                <TableCell>{log.temperature}°C</TableCell>
                <TableCell>{log.equipment_id || 'N/A'}</TableCell>
                <TableCell>{getStatusChip(log.is_within_limits)}</TableCell>
                <TableCell>{new Date(log.created_at).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'white',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>Add Temperature Log</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Location"
              fullWidth
              variant="outlined"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Temperature (°C)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.temperature}
              onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Equipment ID"
              fullWidth
              variant="outlined"
              value={formData.equipment_id}
              onChange={(e) => setFormData({ ...formData, equipment_id: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Add Log</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
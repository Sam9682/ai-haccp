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
import { Add as AddIcon, Edit as EditIcon, Settings as SettingsIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import api from '../services/api';

export default function TemperatureLogs() {
  const { language } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempRange, setTempRange] = useState({ min: -18, max: 4 });
  
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

  const handleEditClick = (log) => {
    setEditingLog(log);
    setFormData({
      location: log.location,
      temperature: log.temperature.toString(),
      equipment_id: log.equipment_id || '',
      is_within_limits: log.is_within_limits
    });
    setEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const temp = parseFloat(formData.temperature);
      const payload = {
        location: formData.location,
        temperature: temp,
        equipment_id: formData.equipment_id || null,
        is_within_limits: temp >= tempRange.min && temp <= tempRange.max
      };
      
      await api.put(`/temperature-logs/${editingLog.id}`, payload);
      
      setEditOpen(false);
      setEditingLog(null);
      setFormData({ location: '', temperature: '', equipment_id: '', is_within_limits: true });
      fetchLogs();
    } catch (error) {
      console.error('Error updating temperature log:', error);
      alert('Error updating temperature log: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleSettingsSubmit = (e) => {
    e.preventDefault();
    setSettingsOpen(false);
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
        is_within_limits: temp >= tempRange.min && temp <= tempRange.max
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
        label={isWithinLimits ? t('normal', language) : t('alert', language)}
        color={isWithinLimits ? 'success' : 'error'}
        size="small"
      />
    );
  };

  if (loading) {
    return <Typography>{t('loading', language)}</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">{t('temperatureLogs', language)}</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<SettingsIcon />}
            onClick={() => setSettingsOpen(true)}
            sx={{ mr: 1 }}
          >
            Settings
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddClick}
          >
            {t('addTemperatureLog', language)}
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        {language === 'fr' ? `Plage de température sûre: ${tempRange.min}°C à ${tempRange.max}°C pour les articles réfrigérés` : `Safe temperature range: ${tempRange.min}°C to ${tempRange.max}°C for refrigerated items`}
      </Alert>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t('location', language)}</TableCell>
              <TableCell>{t('temperature', language)} (°C)</TableCell>
              <TableCell>Equipment ID</TableCell>
              <TableCell>{t('status', language)}</TableCell>
              <TableCell>{language === 'fr' ? 'Date/Heure' : 'Date/Time'}</TableCell>
              <TableCell>Actions</TableCell>
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
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditClick(log)}
                  >
                    Edit
                  </Button>
                </TableCell>
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
          <DialogTitle>{t('addTemperatureLog', language)}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t('location', language)}
              fullWidth
              variant="outlined"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label={`${t('temperature', language)} (°C)`}
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
            <Button onClick={() => setOpen(false)}>{t('cancel', language)}</Button>
            <Button type="submit" variant="contained">{t('add', language)}</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog 
        open={editOpen} 
        onClose={() => setEditOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <form onSubmit={handleEditSubmit}>
          <DialogTitle>Edit Temperature Log</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label={t('location', language)}
              fullWidth
              variant="outlined"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label={`${t('temperature', language)} (°C)`}
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
            <Button onClick={() => setEditOpen(false)}>{t('cancel', language)}</Button>
            <Button type="submit" variant="contained">Update</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog 
        open={settingsOpen} 
        onClose={() => setSettingsOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <form onSubmit={handleSettingsSubmit}>
          <DialogTitle>Temperature Range Settings</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Minimum Temperature (°C)"
              type="number"
              fullWidth
              variant="outlined"
              value={tempRange.min}
              onChange={(e) => setTempRange({ ...tempRange, min: parseFloat(e.target.value) })}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Maximum Temperature (°C)"
              type="number"
              fullWidth
              variant="outlined"
              value={tempRange.max}
              onChange={(e) => setTempRange({ ...tempRange, max: parseFloat(e.target.value) })}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained">Save</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
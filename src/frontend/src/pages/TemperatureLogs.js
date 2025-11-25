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
  Alert,
  Autocomplete
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Settings as SettingsIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import api from '../services/api';

export default function TemperatureLogs() {
  const { language } = useLanguage();
  const [logs, setLogs] = useState([]);
  const [locations, setLocations] = useState([]);
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [editingLog, setEditingLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tempRange, setTempRange] = useState({ min: -18, max: 4 });
  const [tempSettings, setTempSettings] = useState({
    refrigerated_min: -18,
    refrigerated_max: 4,
    frozen_min: -25,
    frozen_max: -18,
    ambient_min: 15,
    ambient_max: 25
  });
  
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
    fetchTempRanges();
    fetchLocations();
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

  const fetchTempRanges = async () => {
    try {
      const response = await api.get('/temperature-ranges');
      setTempSettings(response.data);
      setTempRange({
        min: response.data.refrigerated_min,
        max: response.data.refrigerated_max
      });
    } catch (error) {
      console.error('Error fetching temperature ranges:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await api.get('/temperature-locations');
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
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

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/temperature-ranges', tempSettings);
      setTempRange({
        min: tempSettings.refrigerated_min,
        max: tempSettings.refrigerated_max
      });
      setSettingsOpen(false);
    } catch (error) {
      console.error('Error updating temperature ranges:', error);
      alert('Error updating settings: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (logId) => {
    if (window.confirm('Are you sure you want to delete this temperature log?')) {
      try {
        await api.delete(`/temperature-logs/${logId}`);
        fetchLogs();
      } catch (error) {
        console.error('Error deleting temperature log:', error);
        alert('Error deleting temperature log: ' + (error.response?.data?.detail || error.message));
      }
    }
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
      fetchLocations();
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
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(log.id)}
                  >
                    Delete
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
            <Autocomplete
              freeSolo
              options={locations}
              value={formData.location}
              onChange={(event, newValue) => {
                setFormData({ ...formData, location: newValue || '' });
              }}
              onInputChange={(event, newInputValue) => {
                setFormData({ ...formData, location: newInputValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  autoFocus
                  margin="dense"
                  label={t('location', language)}
                  fullWidth
                  variant="outlined"
                  required
                  sx={{ mb: 2 }}
                />
              )}
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
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Refrigerated</Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Min (°C)"
                type="number"
                value={tempSettings.refrigerated_min}
                onChange={(e) => setTempSettings({ ...tempSettings, refrigerated_min: parseFloat(e.target.value) })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Max (°C)"
                type="number"
                value={tempSettings.refrigerated_max}
                onChange={(e) => setTempSettings({ ...tempSettings, refrigerated_max: parseFloat(e.target.value) })}
                sx={{ flex: 1 }}
              />
            </Box>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Frozen</Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Min (°C)"
                type="number"
                value={tempSettings.frozen_min}
                onChange={(e) => setTempSettings({ ...tempSettings, frozen_min: parseFloat(e.target.value) })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Max (°C)"
                type="number"
                value={tempSettings.frozen_max}
                onChange={(e) => setTempSettings({ ...tempSettings, frozen_max: parseFloat(e.target.value) })}
                sx={{ flex: 1 }}
              />
            </Box>
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Ambient</Typography>
            <Box display="flex" gap={2}>
              <TextField
                label="Min (°C)"
                type="number"
                value={tempSettings.ambient_min}
                onChange={(e) => setTempSettings({ ...tempSettings, ambient_min: parseFloat(e.target.value) })}
                sx={{ flex: 1 }}
              />
              <TextField
                label="Max (°C)"
                type="number"
                value={tempSettings.ambient_max}
                onChange={(e) => setTempSettings({ ...tempSettings, ambient_max: parseFloat(e.target.value) })}
                sx={{ flex: 1 }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSettingsOpen(false)}>{t('cancel', language)}</Button>
            <Button type="submit" variant="contained">Save Settings</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
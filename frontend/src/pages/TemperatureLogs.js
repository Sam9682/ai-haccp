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
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import api from '../services/api';

export default function TemperatureLogs() {
  const { language } = useLanguage();
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddClick}
        >
          {t('addTemperatureLog', language)}
        </Button>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        {language === 'fr' ? 'Plage de température sûre: -18°C à 4°C pour les articles réfrigérés' : 'Safe temperature range: -18°C to 4°C for refrigerated items'}
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
    </Box>
  );
}
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Alert,
  Divider,
  IconButton
} from '@mui/material';
import { Edit, Save, Cancel, Thermostat, AttachMoney } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import api from '../services/api';

export default function Configuration() {
  const { language } = useLanguage();
  const [parameters, setParameters] = useState([]);
  const [tempRanges, setTempRanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editingTemp, setEditingTemp] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchParameters();
    fetchTempRanges();
  }, []);

  const fetchParameters = async () => {
    try {
      const response = await api.get('/configuration');
      setParameters(response.data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading configuration parameters' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTempRanges = async () => {
    try {
      const response = await api.get('/temperature-ranges');
      setTempRanges(response.data);
    } catch (error) {
      console.error('Error fetching temperature ranges:', error);
    }
  };

  const handleEdit = (param) => {
    setEditingId(param.id);
    setEditValue(param.value);
  };

  const handleSave = async (id) => {
    try {
      await api.put(`/configuration/${id}`, { value: editValue });
      setParameters(parameters.map(p => 
        p.id === id ? { ...p, value: editValue } : p
      ));
      setEditingId(null);
      setMessage({ type: 'success', text: 'Parameter updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating parameter' });
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue('');
    setEditingTemp(null);
  };

  const handleTempEdit = (key) => {
    setEditingTemp(key);
    setEditValue(tempRanges[key]?.toString() || '');
  };

  const handleTempSave = async (key) => {
    try {
      const newRanges = { ...tempRanges, [key]: parseFloat(editValue) };
      await api.put('/temperature-ranges', newRanges);
      setTempRanges(newRanges);
      setEditingTemp(null);
      setMessage({ type: 'success', text: 'Temperature range updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating temperature range' });
    }
  };

  if (loading) {
    return <Typography>{t('loading', language)}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('configuration', language)}
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Temperature Ranges Section */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Thermostat sx={{ mr: 1, verticalAlign: 'middle' }} />
                Temperature Ranges (°C)
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {Object.entries({
                  refrigerated_min: 'Refrigerated Min',
                  refrigerated_max: 'Refrigerated Max',
                  frozen_min: 'Frozen Min',
                  frozen_max: 'Frozen Max',
                  ambient_min: 'Ambient Min',
                  ambient_max: 'Ambient Max'
                }).map(([key, label]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography variant="body2" sx={{ minWidth: 120 }}>
                        {label}:
                      </Typography>
                      {editingTemp === key ? (
                        <Box display="flex" gap={1} alignItems="center">
                          <TextField
                            size="small"
                            type="number"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            sx={{ width: 80 }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => handleTempSave(key)}
                            color="primary"
                          >
                            <Save fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={handleCancel}
                          >
                            <Cancel fontSize="small" />
                          </IconButton>
                        </Box>
                      ) : (
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" sx={{ minWidth: 40 }}>
                            {tempRanges[key] || 'N/A'}°C
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleTempEdit(key)}
                            color="primary"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Pricing Parameters Section */}
        {parameters.filter(p => p.parameter.toLowerCase().includes('cost') || p.parameter.toLowerCase().includes('price') || p.parameter.toLowerCase().includes('billing')).length > 0 && (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Pricing Configuration
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={2}>
                  {parameters.filter(p => p.parameter.toLowerCase().includes('cost') || p.parameter.toLowerCase().includes('price') || p.parameter.toLowerCase().includes('billing')).map((param) => (
                    <Grid item xs={12} sm={6} md={4} key={param.id}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" sx={{ minWidth: 120 }}>
                          {param.parameter}:
                        </Typography>
                        <Typography variant="body2" sx={{ minWidth: 80 }}>
                          {param.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Other Configuration Parameters */}
        {parameters.filter(p => !p.parameter.toLowerCase().includes('cost') && !p.parameter.toLowerCase().includes('price') && !p.parameter.toLowerCase().includes('billing')).map((param) => (
          <Grid item xs={12} md={6} key={param.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {param.parameter}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                {editingId === param.id ? (
                  <Box>
                    <TextField
                      fullWidth
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      multiline
                      rows={3}
                      sx={{ mb: 2 }}
                    />
                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={() => handleSave(param.id)}
                        size="small"
                      >
                        {t('save', language)}
                      </Button>
                      <Button
                        variant="outlined"
                        startIcon={<Cancel />}
                        onClick={handleCancel}
                        size="small"
                      >
                        {t('cancel', language)}
                      </Button>
                    </Box>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body2" sx={{ mb: 2, minHeight: 60 }}>
                      {param.value}
                    </Typography>
                    <IconButton
                      onClick={() => handleEdit(param)}
                      size="small"
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
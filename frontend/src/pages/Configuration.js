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
import { Edit, Save, Cancel } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import api from '../services/api';

export default function Configuration() {
  const { language } = useLanguage();
  const [parameters, setParameters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchParameters();
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
        {parameters.map((param) => (
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
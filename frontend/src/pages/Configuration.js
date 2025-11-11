import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Alert,
  Divider
} from '@mui/material';
import { AttachMoney, Thermostat } from '@mui/icons-material';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import api from '../services/api';

export default function Configuration() {
  const { language } = useLanguage();
  const [pricingConfig, setPricingConfig] = useState([]);
  const [tempRanges, setTempRanges] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchPricingConfig();
    fetchTempRanges();
  }, []);

  const fetchPricingConfig = async () => {
    try {
      const response = await api.get('/configuration');
      const pricingParams = response.data.filter(param => 
        param.parameter.startsWith('pricing.')
      );
      setPricingConfig(pricingParams);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error loading pricing configuration' });
    } finally {
      setLoading(false);
    }
  };

  const fetchTempRanges = async () => {
    try {
      const response = await api.get('/temperature-ranges');
      setTempRanges(response.data);
    } catch (error) {
      console.error('Error loading temperature ranges:', error);
    }
  };

  if (loading) {
    return <Typography>{t('loading', language)}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Configuration
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <AttachMoney sx={{ mr: 1, verticalAlign: 'middle' }} />
                Pricing Configuration Values
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Grid container spacing={2}>
                {pricingConfig.length > 0 ? (
                  pricingConfig.map((config, index) => (
                    <Grid item xs={12} sm={6} md={4} key={config.id || index}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                          {config.parameter.replace('pricing.', '')}:
                        </Typography>
                        <Typography variant="body2">
                          ${config.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ))
                ) : (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      No pricing configuration found
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        
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
                      <Typography variant="body2" sx={{ minWidth: 120, fontWeight: 'bold' }}>
                        {label}:
                      </Typography>
                      <Typography variant="body2">
                        {tempRanges[key] || 'N/A'}°C
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
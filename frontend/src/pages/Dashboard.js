import React, { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert
} from '@mui/material';
import {
  Thermostat,
  Inventory,
  Warning,
  TrendingUp
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import api from '../services/api';

export default function Dashboard() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    temperatureLogs: 0,
    products: 0,
    incidents: 0,
    monthlyCost: 0
  });
  const [temperatureData, setTemperatureData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Only fetch data if we have a token
    const token = localStorage.getItem('token');
    if (token) {
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [tempLogs, products, usageReport] = await Promise.all([
        api.get('/temperature-logs'),
        api.get('/products'),
        api.get('/usage-report')
      ]);

      setStats({
        temperatureLogs: tempLogs.data.length,
        products: products.data.length,
        incidents: 0, // Placeholder
        monthlyCost: usageReport.data.monthly_cost
      });

      // Format temperature data for chart
      const chartData = tempLogs.data.slice(0, 10).reverse().map((log, index) => ({
        time: new Date(log.created_at).toLocaleTimeString(),
        temperature: parseFloat(log.temperature),
        location: log.location
      }));
      setTemperatureData(chartData);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Don't redirect on API errors, let the interceptor handle it
      if (error.response?.status !== 401) {
        // Handle non-auth errors gracefully
      }
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary', onClick }) => (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        '&:hover': onClick ? { 
          transform: 'translateY(-2px)',
          boxShadow: 3,
          transition: 'all 0.2s ease-in-out'
        } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography color="textSecondary" gutterBottom variant="h6">
              {title}
            </Typography>
            <Typography variant="h4">
              {value}
            </Typography>
          </Box>
          <Box color={`${color}.main`}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <Typography>{t('loadingDashboard', language)}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('dashboard', language)}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('temperatureLogsCount', language)}
            value={stats.temperatureLogs}
            icon={<Thermostat fontSize="large" />}
            color="primary"
            onClick={() => navigate('/temperature-logs')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('productsCount', language)}
            value={stats.products}
            icon={<Inventory fontSize="large" />}
            color="success"
            onClick={() => navigate('/products')}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('openIncidents', language)}
            value={stats.incidents}
            icon={<Warning fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('monthlyCost', language)}
            value={`$${stats.monthlyCost.toFixed(4)}`}
            icon={<TrendingUp fontSize="large" />}
            color="info"
            onClick={() => navigate('/usage-report')}
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('recentTemperatureReadings', language)}
              </Typography>
              {temperatureData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={temperatureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="temperature" stroke="#8884d8" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <Alert severity="info">{t('noTemperatureData', language)}</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
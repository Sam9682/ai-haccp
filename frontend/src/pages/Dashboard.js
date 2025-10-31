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
import api from '../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState({
    temperatureLogs: 0,
    products: 0,
    incidents: 0,
    monthlyCost: 0
  });
  const [temperatureData, setTemperatureData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
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
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card>
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
    return <Typography>Loading dashboard...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Temperature Logs"
            value={stats.temperatureLogs}
            icon={<Thermostat fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Products"
            value={stats.products}
            icon={<Inventory fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Open Incidents"
            value={stats.incidents}
            icon={<Warning fontSize="large" />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Monthly Cost"
            value={`$${stats.monthlyCost.toFixed(4)}`}
            icon={<TrendingUp fontSize="large" />}
            color="info"
          />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Recent Temperature Readings
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
                <Alert severity="info">No temperature data available</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
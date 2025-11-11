import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function UsageReport() {
  const { language } = useLanguage();
  const [usageData, setUsageData] = useState({
    total_cost: 0,
    monthly_cost: 0,
    usage_breakdown: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsageReport();
  }, []);

  const fetchUsageReport = async () => {
    try {
      const response = await api.get('/usage-report');
      setUsageData(response.data);
    } catch (error) {
      console.error('Error fetching usage report:', error);
    } finally {
      setLoading(false);
    }
  };

  const chartData = usageData.usage_breakdown.map((item, index) => ({
    name: item.action.replace('_', ' ').toUpperCase(),
    value: item.cost,
    count: item.count,
    avgExecutionTime: item.avg_execution_time || 0
  }));

  if (loading) {
    return <Typography>{t('loadingUsageReport', language)}</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {t('usageCostReport', language)}
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('totalCost', language)}
              </Typography>
              <Typography variant="h4">
                ${usageData.total_cost.toFixed(4)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('monthlyCost', language)}
              </Typography>
              <Typography variant="h4">
                ${usageData.monthly_cost.toFixed(4)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('costPerUser', language)}
              </Typography>
              <Typography variant="h4">
                ${(usageData.monthly_cost / 1).toFixed(4)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('estimated', language)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                {t('serverlessSavings', language)}
              </Typography>
              <Typography variant="h4" color="success.main">
                ~85%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {t('vsTraditional', language)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('costBreakdownByAction', language)}
              </Typography>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: $${value.toFixed(4)}`}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toFixed(4)}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Typography>{t('noUsageData', language)}</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('usageDetails', language)}
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>{t('actionType', language)}</TableCell>
                      <TableCell align="right">{t('count', language)}</TableCell>
                      <TableCell align="right">{t('totalCostCol', language)}</TableCell>
                      <TableCell align="right">{t('avgCost', language)}</TableCell>
                      <TableCell align="right">Avg Exec Time (ms)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usageData.usage_breakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.action.replace('_', ' ').toUpperCase()}</TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                        <TableCell align="right">${item.cost.toFixed(4)}</TableCell>
                        <TableCell align="right">${(item.cost / item.count).toFixed(6)}</TableCell>
                        <TableCell align="right">
                          {item.avg_execution_time ? (item.avg_execution_time * 1000).toFixed(2) : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {t('costOptimizationFeatures', language)}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="primary">
                    {t('serverlessArchitecture', language)}
                  </Typography>
                  <Typography variant="body2">
                    {t('payOnlyForUsage', language)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="primary">
                    {t('sharedInfrastructure', language)}
                  </Typography>
                  <Typography variant="body2">
                    {t('costDistributed', language)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="primary">
                    {t('usageBasedBilling', language)}
                  </Typography>
                  <Typography variant="body2">
                    {t('transparentPricing', language)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="primary">
                    {t('autoScaling', language)}
                  </Typography>
                  <Typography variant="body2">
                    {t('resourcesScale', language)}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
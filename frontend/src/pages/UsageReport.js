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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function UsageReport() {
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
    count: item.count
  }));

  if (loading) {
    return <Typography>Loading usage report...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Usage & Cost Report
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Cost
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
                Monthly Cost
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
                Cost per User
              </Typography>
              <Typography variant="h4">
                ${(usageData.monthly_cost / 1).toFixed(4)}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                (Estimated)
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Serverless Savings
              </Typography>
              <Typography variant="h4" color="success.main">
                ~85%
              </Typography>
              <Typography variant="body2" color="textSecondary">
                vs Traditional
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost Breakdown by Action
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
                <Typography>No usage data available</Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Usage Details
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Action Type</TableCell>
                      <TableCell align="right">Count</TableCell>
                      <TableCell align="right">Total Cost</TableCell>
                      <TableCell align="right">Avg Cost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {usageData.usage_breakdown.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.action.replace('_', ' ').toUpperCase()}</TableCell>
                        <TableCell align="right">{item.count}</TableCell>
                        <TableCell align="right">${item.cost.toFixed(4)}</TableCell>
                        <TableCell align="right">${(item.cost / item.count).toFixed(6)}</TableCell>
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
                Cost Optimization Features
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="primary">
                    Serverless Architecture
                  </Typography>
                  <Typography variant="body2">
                    Pay only for actual usage, no idle server costs
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="primary">
                    Shared Infrastructure
                  </Typography>
                  <Typography variant="body2">
                    Cost distributed among all platform users
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="primary">
                    Usage-Based Billing
                  </Typography>
                  <Typography variant="body2">
                    Transparent pricing based on actual resource consumption
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Typography variant="subtitle2" color="primary">
                    Auto-Scaling
                  </Typography>
                  <Typography variant="body2">
                    Resources scale automatically with demand
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
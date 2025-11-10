import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TemperatureLogs from './pages/TemperatureLogs';
import Products from './pages/Products';
import UsageReport from './pages/UsageReport';
import CleaningPlan from './pages/CleaningPlan';
import AIChat from './pages/AIChat';
import Help from './pages/Help';
import MaterialReception from './pages/MaterialReception';
import Layout from './components/Layout';
import { AuthProvider, useAuth } from './services/AuthContext';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/temperature-logs" element={
              <ProtectedRoute>
                <Layout>
                  <TemperatureLogs />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/products" element={
              <ProtectedRoute>
                <Layout>
                  <Products />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/usage-report" element={
              <ProtectedRoute>
                <Layout>
                  <UsageReport />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/cleaning-plan" element={
              <ProtectedRoute>
                <Layout>
                  <CleaningPlan />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/ai-chat" element={
              <ProtectedRoute>
                <Layout>
                  <AIChat />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/help" element={
              <ProtectedRoute>
                <Layout>
                  <Help />
                </Layout>
              </ProtectedRoute>
            } />
            <Route path="/material-reception" element={
              <ProtectedRoute>
                <Layout>
                  <MaterialReception />
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { useAuth } from '../services/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { t } from '../translations/translations';
import LanguageSwitcher from '../components/LanguageSwitcher';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [ssoLoading, setSsoLoading] = useState(false);
  const { login, ssoLogin, user } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    console.log('User state changed:', user);
    if (user) {
      console.log('User is logged in, navigating to dashboard');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Check for SSO parameters in URL
    const urlParams = new URLSearchParams(location.search);
    const ssoToken = urlParams.get('sso_token') || urlParams.get('token') || urlParams.get('access_token') || urlParams.get('id_token');
    const userParam = urlParams.get('user');
    const scope = urlParams.get('scope');
    const state = urlParams.get('state');
    const code = urlParams.get('code');
    
    console.log('SSO parameters found:', {
      token: ssoToken ? ssoToken.substring(0, 20) + '...' : null,
      user: userParam,
      scope,
      state,
      code
    });
    
    if (ssoToken) {
      setSsoLoading(true);
      handleSsoLogin(ssoToken);
    } else if (code) {
      // Handle OAuth authorization code flow
      console.log('OAuth code flow detected, code:', code);
      setSsoLoading(true);
      handleSsoLogin(code);
    }
  }, [location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Form submitted with:', email, password);

    const result = await login(email, password);
    
    console.log('Login result:', result);
    
    if (result.success) {
      console.log('Login successful, navigating to dashboard');
      navigate('/');
    } else {
      console.error('Login failed:', result.error);
      setError(result.error);
    }
    
    setLoading(false);
  };

  const handleSsoLogin = async (ssoToken) => {
    setError('');
    console.log('Attempting SSO login with token:', ssoToken.substring(0, 20) + '...');

    const result = await ssoLogin(ssoToken);
    
    if (result.success) {
      console.log('SSO login successful');
      navigate('/');
    } else {
      console.error('SSO login failed:', result.error);
      setError(`SSO Login Failed: ${result.error}`);
      setSsoLoading(false);
      // Clear the token from URL to allow manual login
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  const redirectToSso = () => {
    const redirectUri = encodeURIComponent('https://ai-haccp.swautomorph.com:8102/');
    window.location.href = `https://www.swautomorph.com/sso/auth?redirect_uri=${redirectUri}`;
  };

  // Check for SSO token in URL - if present, show loading state
  const urlParams = new URLSearchParams(location.search);
  const hasSsoToken = urlParams.get('sso_token') || urlParams.get('token') || urlParams.get('access_token') || urlParams.get('id_token') || urlParams.get('code');

  if (hasSsoToken && ssoLoading) {
    return (
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Paper elevation={3} sx={{ padding: 4, width: '100%', textAlign: 'center' }}>
            <Typography component="h1" variant="h4" align="center" gutterBottom>
              AI-HACCP
            </Typography>
            <Typography component="h2" variant="h6" align="center" color="textSecondary" gutterBottom>
              Authenticating via SSO...
            </Typography>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
                <Box sx={{ mt: 1 }}>
                  <Button 
                    size="small" 
                    onClick={() => {
                      setSsoLoading(false);
                      setError('');
                      window.history.replaceState({}, document.title, window.location.pathname);
                    }}
                  >
                    Try Manual Login
                  </Button>
                </Box>
              </Alert>
            )}
            <Box sx={{ mt: 3 }}>
              <Typography variant="body1">Please wait while we authenticate you...</Typography>
              {!error && (
                <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                  If this takes too long, please try refreshing the page.
                </Typography>
              )}
            </Box>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
            <LanguageSwitcher />
          </Box>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            AI-HACCP
          </Typography>
          <Typography component="h2" variant="h6" align="center" color="textSecondary" gutterBottom>
            Food Safety Management Platform
          </Typography>
          
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('emailAddress', language)}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('password', language)}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading || ssoLoading}
            >
              {loading ? t('signingIn', language) : t('signIn', language)}
            </Button>
          </Box>
          
          <Box sx={{ my: 2 }}>
            <Divider>
              <Chip label="OR" size="small" />
            </Divider>
          </Box>
          
          <Button
            fullWidth
            variant="outlined"
            onClick={redirectToSso}
            disabled={loading || ssoLoading}
            sx={{ mb: 2 }}
          >
            {ssoLoading ? 'Authenticating...' : 'Login with SSO'}
          </Button>
          
          <Typography variant="body2" color="textSecondary" align="center" sx={{ mt: 2 }}>
            {t('demo', language)}
          </Typography>
          
          <Typography variant="caption" color="textSecondary" align="center" display="block" sx={{ mt: 1 }}>
            <strong>Direct login:</strong> Admin / password or admin@ai-automorph.com / password<br/>
            <strong>SSO:</strong> Use swautomorph.com credentials
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}
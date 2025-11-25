import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './api';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('userData');
    if (token) {
      // Check if token is expired
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        if (payload.exp > currentTime) {
          // Token is still valid
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const parsedUserData = userData ? JSON.parse(userData) : {};
          setUser({ ...parsedUserData, token });
        } else {
          // Token is expired, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('userData');
          delete api.defaults.headers.common['Authorization'];
        }
      } catch (error) {
        // Invalid token format, remove it
        localStorage.removeItem('token');
        localStorage.removeItem('userData');
        delete api.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('Login response:', response.data);
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('userData', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser({ ...userData, token: access_token });
      
      console.log('Login successful, user set:', userData);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.response?.data?.detail || error.message || 'Login failed' };
    }
  };

  const ssoLogin = async (ssoToken) => {
    try {
      console.log('Sending SSO token to backend...');
      const response = await api.post('/auth/sso', { sso_token: ssoToken });
      const { access_token, user: userData } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('userData', JSON.stringify(userData));
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      setUser({ ...userData, token: access_token });
      
      console.log('SSO login successful, user:', userData.email);
      return { success: true };
    } catch (error) {
      console.error('SSO login error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.detail || error.message || 'SSO login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const value = {
    user,
    login,
    ssoLogin,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
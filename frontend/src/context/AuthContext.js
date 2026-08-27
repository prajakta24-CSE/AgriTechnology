import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('agritech_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.data);
          }
        } catch (error) {
          console.error('Session expired or invalid token');
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('agritech_token', userData.token);
      return { success: true, user: userData };
    }
    return { success: false, message: res.data.message };
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('agritech_token', userData.token);
      return { success: true, user: userData };
    }
    return { success: false, message: res.data.message };
  };

  const demoLogin = async (role = 'farmer') => {
    const res = await api.get(`/auth/demo/${role}`);
    if (res.data.success) {
      const userData = res.data.data;
      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('agritech_token', userData.token);
      return { success: true, user: userData };
    }
    return { success: false, message: res.data.message };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('agritech_token');
  };

  const updateProfile = async (updatedData) => {
    const res = await api.put('/auth/profile', updatedData);
    if (res.data.success) {
      setUser(res.data.data);
      return { success: true, user: res.data.data };
    }
    return { success: false, message: res.data.message };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isFarmer: user?.role === 'farmer',
        isExpert: user?.role === 'expert',
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

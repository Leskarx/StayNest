import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('staynest_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('staynest_token') || null);
  const [loading, setLoading] = useState(true);

  const persistUser = (userData, tokenData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('staynest_user', JSON.stringify(userData));
    localStorage.setItem('staynest_token', tokenData);
  };

  const login = useCallback(async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success) {
      persistUser(res.user, res.token);
      return res.user;
    }
    throw new Error('Login failed');
  }, []);

  const register = useCallback(async (data) => {
    const res = await authService.register(data);
    if (res.success) {
      persistUser(res.user, res.token);
      return res.user;
    }
    throw new Error('Registration failed');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('staynest_token');
    localStorage.removeItem('staynest_user');
  }, []);

  const refreshUser = useCallback(async () => {
    if (!token) return;
    try {
      const res = await authService.getMe();
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('staynest_user', JSON.stringify(res.user));
      }
    } catch {
      logout();
    }
  }, [token, logout]);

  useEffect(() => {
    const init = async () => {
      if (token) {
        await refreshUser();
      }
      setLoading(false);
    };
    init();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

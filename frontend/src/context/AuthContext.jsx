import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, updateProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('fintrack_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('fintrack_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const data = await getCurrentUser();
          if (data.success) {
            setUser(data.user);
            localStorage.setItem('fintrack_user', JSON.stringify(data.user));
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to verify token:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (email, password) => {
    const data = await loginUser({ email, password });
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('fintrack_token', data.token);
      localStorage.setItem('fintrack_user', JSON.stringify(data.user));
    }
    return data;
  };

  const register = async (userData) => {
    const data = await registerUser(userData);
    if (data.success) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('fintrack_token', data.token);
      localStorage.setItem('fintrack_user', JSON.stringify(data.user));
    }
    return data;
  };

  const updateUser = async (profileData) => {
    const data = await updateProfile(profileData);
    if (data.success) {
      setUser(data.user);
      localStorage.setItem('fintrack_user', JSON.stringify(data.user));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('fintrack_token');
    localStorage.removeItem('fintrack_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

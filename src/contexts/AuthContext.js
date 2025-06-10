import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const token = response.token; // Assumindo que o backend retorna um token
      
      localStorage.setItem('authToken', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      const token = response.token; // Assumindo que o backend retorna um token
      
      localStorage.setItem('authToken', token);
      const decoded = jwtDecode(token);
      setUser(decoded);
      
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          setUser(decoded);
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        localStorage.removeItem('authToken');
      }
    }
    
    setLoading(false);
  }, []);

  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
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
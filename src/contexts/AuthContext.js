import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      
      // Backend retorna: { id, nome, email, role }
      const userInfo = {
        id: response.id,
        nomeCompleto: response.nome, // Backend usa "nome"
        email: response.email,
        tipo: response.role // Backend usa "role"
      };
      
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      console.error('Erro no registro:', error);
      return { success: false, message: error.message || 'Erro ao registrar usuário' };
    }
  };

  const login = async (email, senha) => {
    try {
      const response = await authService.login(email, senha);
      
      // Backend retorna: { token, usuario: { id, nome, email, role }, tipo }
      // Os dados do usuário estão dentro do campo "usuario"
      const usuario = response.usuario || response;
      
      const userInfo = {
        id: usuario.id,
        nomeCompleto: usuario.nome || usuario.nomeCompleto || email,
        email: usuario.email || email,
        tipo: usuario.role || 'USUARIO'
      };
      
      console.log('Dados do usuário salvos:', userInfo);
      
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error) {
      console.error('Erro no login:', error);
      return { success: false, message: error.message || 'Erro ao fazer login' };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      try {
        const userInfo = JSON.parse(storedUser);
        setUser(userInfo);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('user');
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
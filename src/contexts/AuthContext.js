import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Função para registrar um novo usuário
  const register = async (userData) => {
    try {
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || []);
      
      // Verifica se o email já existe
      if (existingUsers.some(user => user.email === userData.email)) {
        throw new Error('Já existe um usuário cadastrado com este email');
      }
      
      // Cria o novo usuário
      const newUser = {
        id: Date.now().toString(),
        ...userData,
        createdAt: new Date().toISOString()
      };
      
      // Armazena o usuário
      localStorage.setItem('registeredUsers', JSON.stringify([...existingUsers, newUser]));
      
      // Faz login automaticamente após cadastro
      const token = generateMockJWT(newUser);
      localStorage.setItem('authToken', token);
      setUser(jwtDecode(token));
      
      return { success: true, message: 'Cadastro realizado com sucesso!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Função para fazer login
  const login = async (email, password) => {
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const user = registeredUsers.find(u => u.email === email && u.senha === password);
      
      if (!user) {
        throw new Error('Email ou senha incorretos');
      }
      
      // Gera o token JWT
      const token = generateMockJWT(user);
      
      // Decodifica o token para obter informações do usuário
      const decoded = jwtDecode(token);
      
      // Armazena o token
      localStorage.setItem('authToken', token);
      setUser(decoded);
      
      return { success: true, message: 'Login realizado com sucesso!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Função para gerar um JWT mock
  const generateMockJWT = (user) => {
    const header = {
      alg: 'HS256',
      typ: 'JWT'
    };
    
    const payload = {
      sub: user.id,
      name: user.nomeCompleto,
      email: user.email,
      role: user.tipo,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60) // Expira em 1 hora
    };
    
    const signature = 'mock-signature';
    
    return [
      btoa(JSON.stringify(header)),
      btoa(JSON.stringify(payload)),
      signature
    ].join('.');
  };

  // Verifica se o token JWT é válido
  const validateToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const now = Date.now() / 1000;
      
      if (decoded.exp < now) {
        return null; // Token expirado
      }
      
      return decoded;
    } catch (error) {
      return null;
    }
  };

  // Função para fazer logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  // Verifica se há usuário logado ao inicializar
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const decoded = validateToken(token);
      
      if (decoded) {
        setUser(decoded);
      } else {
        localStorage.removeItem('authToken');
      }
    }
    
    setLoading(false);
  }, []);

  // Verifica se o usuário está autenticado
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
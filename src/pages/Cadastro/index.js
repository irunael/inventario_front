import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'administrador'
  });

  const [isLogin, setIsLogin] = useState(false); // Estado para alternar entre login/cadastro
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!isLogin && formData.senha !== formData.confirmarSenha) {
      alert('As senhas não coincidem!');
      return;
    }

    // Simula o login/cadastro
    login({
      id: '1',
      name: formData.nomeCompleto,
      email: formData.email,
      role: formData.tipo
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <div className="login-wrapper">
        <div className="login-form-section">
          <div className="header">
            <div className="logo">
              <span className="logo-icon">📦</span>
              <h1>Inbox</h1>
            </div>
            <nav className="nav-links">
              <button 
                className="login-btn"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Cadastre-se' : 'Login'}
              </button>
            </nav>
          </div>
          
          <div className="form-content">
            <h2>{isLogin ? 'Faça Login' : 'Crie sua conta'}</h2>
            
            <form onSubmit={handleSubmit} className="signup-form">
              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="nomeCompleto">Nome completo:</label>
                  <input
                    type="text"
                    id="nomeCompleto"
                    name="nomeCompleto"
                    value={formData.nomeCompleto}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="input-group">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  required
                />
              </div>
              
              {!isLogin && (
                <div className="input-group">
                  <label htmlFor="confirmarSenha">Confirmar senha:</label>
                  <input
                    type="password"
                    id="confirmarSenha"
                    name="confirmarSenha"
                    value={formData.confirmarSenha}
                    onChange={handleChange}
                    required={!isLogin}
                  />
                </div>
              )}
              
              {!isLogin && (
                <div className="radio-group">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tipo"
                      value="administrador"
                      checked={formData.tipo === 'administrador'}
                      onChange={handleChange}
                    />
                    <span>Administrador</span>
                  </label>
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tipo"
                      value="operador"
                      checked={formData.tipo === 'operador'}
                      onChange={handleChange}
                    />
                    <span>Operador</span>
                  </label>
                </div>
              )}
              
              <button type="submit" className="create-account-btn">
                {isLogin ? 'Entrar' : 'Criar conta'}
              </button>
            </form>
            
            <p className="login-link">
              {isLogin ? 'Não tem conta? ' : 'Já tem conta? '}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#d4af37',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  font: 'inherit'
                }}
              >
                {isLogin ? 'Cadastre-se' : 'Faça login'}
              </button>
            </p>
          </div>
        </div>
        
        <div className="image-section">
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="profile-frame">
            <div className="frame-border">
              <div className="profile-image">
                <img src="/api/placeholder/200/250" alt="Profile" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
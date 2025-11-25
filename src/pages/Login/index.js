import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    senha: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Verifica se há mensagem de sucesso do registro
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      
      // Se houver email do registro, pré-preenche o campo
      if (location.state.email) {
        setFormData(prev => ({
          ...prev,
          email: location.state.email
        }));
      }
      
      // Remove a mensagem após 5 segundos
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    }
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = await login(formData.email, formData.senha);
      
      if (result.success) {
        // Redireciona para o dashboard após login bem-sucedido
        navigate('/dashboard');
      } else {
        // Para qualquer erro de autenticação, mostra mensagem genérica
        // Isso inclui: usuário não existe, senha incorreta, credenciais inválidas, etc.
        setErrors({ submit: 'Usuário ou senha incorretos. Tente novamente.' });
      }
    } catch (error) {
      setErrors({ submit: 'Erro interno. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper auth-wrapper-single">
        <div className="auth-form-section">
          <div className="auth-header">
            <div className="logo">
              <span className="logo-icon">📦</span>
              <h1>Inbox</h1>
            </div>
            <nav className="nav-links">
              <Link to="/register" className="auth-nav-btn">
                Não tem conta? Cadastre-se
              </Link>
            </nav>
          </div>
          
          <div className="form-content">
            <h2>Entrar na sua conta</h2>
            <p className="form-subtitle">Digite seus dados para acessar o sistema</p>
            
            {/* Mensagem de sucesso do registro */}
            {successMessage && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  placeholder="seu@email.com"
                  disabled={loading}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="senha">Senha:</label>
                <input
                  type="password"
                  id="senha"
                  name="senha"
                  value={formData.senha}
                  onChange={handleChange}
                  className={errors.senha ? 'error' : ''}
                  placeholder="Sua senha"
                  disabled={loading}
                />
                {errors.senha && <span className="error-message">{errors.senha}</span>}
              </div>
              
              {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
              
              <button type="submit" className="auth-submit-btn" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
            
            <p className="auth-link">
              Não tem uma conta? {' '}
              <Link to="/register" className="link-button">
                Cadastre-se aqui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
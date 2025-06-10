import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    tipo: 'administrador'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

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

    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    } else if (formData.nomeCompleto.trim().length < 2) {
      newErrors.nomeCompleto = 'Nome deve ter pelo menos 2 caracteres';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (formData.senha.length < 6) {
      newErrors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
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
      const result = await register(formData);
      
      if (result.success) {
        // Mostra mensagem de sucesso
        setSuccessMessage('Usuário cadastrado com sucesso! Redirecionando para o login...');
        
        // Redireciona para login após 2 segundos
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              message: 'Cadastro realizado com sucesso! Faça login para continuar.',
              email: formData.email // Opcional: pré-preencher o email no login
            } 
          });
        }, 2000);
      } else {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: 'Erro interno. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <div className="auth-form-section">
          <div className="auth-header">
            <div className="logo">
              <span className="logo-icon">📦</span>
              <h1>Inbox</h1>
            </div>
            <nav className="nav-links">
              <Link to="/login" className="auth-nav-btn">
                Já tem conta? Faça Login
              </Link>
            </nav>
          </div>
          
          <div className="form-content">
            <h2>Criar Nova Conta</h2>
            <p className="form-subtitle">Preencha seus dados para criar uma conta</p>
            
            {/* Mensagem de sucesso */}
            {successMessage && (
              <div className="success-message">
                <span className="success-icon">✅</span>
                {successMessage}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="nomeCompleto">Nome completo:</label>
                <input
                  type="text"
                  id="nomeCompleto"
                  name="nomeCompleto"
                  value={formData.nomeCompleto}
                  onChange={handleChange}
                  className={errors.nomeCompleto ? 'error' : ''}
                  disabled={loading || successMessage}
                />
                {errors.nomeCompleto && <span className="error-message">{errors.nomeCompleto}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                  disabled={loading || successMessage}
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
                  disabled={loading || successMessage}
                />
                {errors.senha && <span className="error-message">{errors.senha}</span>}
              </div>
              
              <div className="input-group">
                <label htmlFor="confirmarSenha">Confirmar senha:</label>
                <input
                  type="password"
                  id="confirmarSenha"
                  name="confirmarSenha"
                  value={formData.confirmarSenha}
                  onChange={handleChange}
                  className={errors.confirmarSenha ? 'error' : ''}
                  disabled={loading || successMessage}
                />
                {errors.confirmarSenha && <span className="error-message">{errors.confirmarSenha}</span>}
              </div>
              
              <div className="radio-group">
                <label className="radio-group-title">Tipo de usuário:</label>
                <div className="radio-options">
                  <label className="radio-label">
                    <input
                      type="radio"
                      name="tipo"
                      value="administrador"
                      checked={formData.tipo === 'administrador'}
                      onChange={handleChange}
                      disabled={loading || successMessage}
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
                      disabled={loading || successMessage}
                    />
                    <span>Operador</span>
                  </label>
                </div>
              </div>
              
              {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}
              
              <button 
                type="submit" 
                className="auth-submit-btn" 
                disabled={loading || successMessage}
              >
                {loading ? 'Criando conta...' : successMessage ? 'Redirecionando...' : 'Criar conta'}
              </button>
            </form>
            
            {!successMessage && (
              <p className="auth-link">
                Já tem uma conta? {' '}
                <Link to="/login" className="link-button">
                  Faça login aqui
                </Link>
              </p>
            )}
          </div>
        </div>
        
        <div className="auth-image-section">
          <div className="geometric-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
          <div className="profile-frame">
            <div className="frame-border">
              <div className="profile-image">
                <div className="placeholder-icon">👤</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
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
    tipo: 'usuario'
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

    // Validação do nome
    if (!formData.nomeCompleto.trim()) {
      newErrors.nomeCompleto = 'Nome completo é obrigatório';
    } else if (formData.nomeCompleto.trim().length < 2) {
      newErrors.nomeCompleto = 'Nome deve ter pelo menos 2 caracteres';
    }

    // Validação do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const dominiosValidos = ['gmail.com', 'outlook.com', 'hotmail.com', 'yahoo.com', 'icloud.com', 'live.com'];
    
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Email inválido';
    } else {
      const dominio = formData.email.split('@')[1]?.toLowerCase();
      if (!dominiosValidos.includes(dominio)) {
        newErrors.email = 'Seu email precisa conter um domínio válido, exemplo: @gmail.com, @outlook.com';
      }
    }

    // Validação da senha
    if (!formData.senha) {
      newErrors.senha = 'Senha é obrigatória';
    } else {
      if (formData.senha.length < 6) {
        newErrors.senha = 'A senha precisa conter pelo menos 6 dígitos';
      } else {
        const temCaracterEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(formData.senha);
        if (!temCaracterEspecial) {
          newErrors.senha = 'A senha precisa conter pelo menos um caractere especial (!@#$%^&*...)';
        }
      }
    }

    // Validação da confirmação de senha
    if (!formData.confirmarSenha) {
      newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
    } else if (formData.senha !== formData.confirmarSenha) {
      newErrors.confirmarSenha = 'As senhas não coincidem';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Formulário submetido');
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      console.log('Erros de validação:', formErrors);
      setErrors(formErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      console.log('Enviando dados para registro:', formData);
      const result = await register(formData);
      console.log('Resultado do registro:', result);
      
      if (result.success) {
        setSuccessMessage('Usuário cadastrado com sucesso! Redirecionando para o dashboard...');
        
        // Redireciona para dashboard após 1.5 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } else {
        console.error('Falha no registro:', result.message);
        
        // Trata mensagens específicas do backend
        let errorMessage = result.message || 'Erro ao cadastrar usuário';
        
        if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('já')) {
          errorMessage = 'Email já cadastrado. Por favor, use outro email ou faça login.';
        }
        
        setErrors({ submit: errorMessage });
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      setErrors({ submit: error.message || 'Erro interno. Tente novamente.' });
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
      </div>
    </div>
  );
};

export default Register;
// src/pages/Movimentacao.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Movimentacao.css';

const Movimentacao = () => {
  const navigate = useNavigate();
  const [movimentacoes, setMovimentacoes] = useState([]);

  // Carrega movimentações do localStorage ao iniciar
  useEffect(() => {
    const stored = localStorage.getItem('movimentacoes');
    setMovimentacoes(stored ? JSON.parse(stored) : []);
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <span className="logo-icon">📦</span>
          <span className="logo-text">Inbox</span>
        </div>
        <nav className="nav-menu">
          <div className="nav-item" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/items')}>
            <span className="nav-icon">📋</span>
            <span className="nav-text">Items</span>
          </div>
          <div className="nav-item active">
            <span className="nav-icon">🔄</span>
            <span className="nav-text">Movimentação</span>
          </div>
        </nav>
      </div>

      {/* Conteúdo Principal */}
      <div className="main-content">
        <div className="header">
          <h1>Movimentações</h1>
          <button 
            className="btn-new-item" 
            onClick={() => navigate('/movimentacao-form')}
          >
            Movimentar produto
          </button>
          <div className="user-icon" onClick={() => { /* Lógica de logout */ }}>👤</div>
        </div>
        
        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Data de alteração</th>
                <th>Quantidade</th>
                <th>Tipo de movimentação</th>
                <th>ID do setor de origem</th>
                <th>ID do setor de destino</th>
                <th>ID do produto</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center' }}>Nenhuma movimentação registrada</td>
                </tr>
              ) : (
                movimentacoes.map((mov, idx) => (
                  <tr key={idx}>
                    <td>{mov.data}</td>
                    <td>{mov.quantidade}</td>
                    <td>{mov.tipo}</td>
                    <td>{mov.origem}</td>
                    <td>{mov.destino}</td>
                    <td>{mov.idProduto}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Movimentacao;
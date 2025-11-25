// src/pages/Movimentacao.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import { useAuth } from '../../contexts/AuthContext';
import './Movimentacao.css';

const Movimentacao = () => {
  const navigate = useNavigate();
  const { movimentacoes } = useContext(ItemsContext);
  const { user, logout } = useAuth();

  const [filtros, setFiltros] = useState({
    data: '',
    tipo: '',
    responsavel: ''
  });

  console.log('Movimentações carregadas:', movimentacoes);

  const handleFiltroChange = (campo, valor) => {
    // Validação para o campo de data - limita o ano a 4 dígitos
    if (campo === 'data' && valor) {
      const ano = valor.split('-')[0];
      if (ano && ano.length > 4) {
        return; // Não atualiza se o ano tiver mais de 4 dígitos
      }
    }
    
    setFiltros(prev => ({
      ...prev,
      [campo]: valor
    }));
  };

  const limparFiltros = () => {
    setFiltros({
      data: '',
      tipo: '',
      responsavel: ''
    });
  };

  // Filtra as movimentações
  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    // Filtro por data específica
    if (filtros.data) {
      const dataMovimentacao = new Date(mov.data + 'T00:00:00');
      const dataFiltro = new Date(filtros.data + 'T00:00:00');
      
      // Compara apenas ano, mês e dia
      if (
        dataMovimentacao.getFullYear() !== dataFiltro.getFullYear() ||
        dataMovimentacao.getMonth() !== dataFiltro.getMonth() ||
        dataMovimentacao.getDate() !== dataFiltro.getDate()
      ) {
        return false;
      }
    }

    // Filtro por tipo
    if (filtros.tipo && mov.tipoMovimentacao !== filtros.tipo) {
      return false;
    }

    // Filtro por responsável
    if (filtros.responsavel) {
      const responsavelNome = (mov.responsavel || '').toLowerCase();
      if (!responsavelNome.includes(filtros.responsavel.toLowerCase())) {
        return false;
      }
    }

    return true;
  });

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
            <span className="nav-text">Itens</span>
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
          <div className="user-profile">
            <span className="user-icon">👤</span>
            <span className="user-name">{user?.nomeCompleto || user?.email || 'Usuário'}</span>
            <button className="btn-logout" onClick={logout}>Sair</button>
          </div>
        </div>

        {/* Filtros */}
        <div className="filters-section">
          <div className="filters-row">
            <div className="filter-group">
              <label>Data:</label>
              <input
                type="date"
                value={filtros.data}
                onChange={(e) => handleFiltroChange('data', e.target.value)}
                className="filter-input"
                min="1900-01-01"
                max="9999-12-31"
              />
            </div>

            <div className="filter-group">
              <label>Tipo:</label>
              <select
                value={filtros.tipo}
                onChange={(e) => handleFiltroChange('tipo', e.target.value)}
                className="filter-select"
              >
                <option value="">Todos</option>
                <option value="ENTRADA">Entrada</option>
                <option value="SAIDA">Saída</option>
                <option value="TRANSFERENCIA">Transferência</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Responsável:</label>
              <input
                type="text"
                value={filtros.responsavel}
                onChange={(e) => handleFiltroChange('responsavel', e.target.value)}
                placeholder="Buscar responsável..."
                className="filter-input"
              />
            </div>

            <button className="btn-clear-filters" onClick={limparFiltros}>
              Limpar Filtros
            </button>
          </div>

          <div className="filters-info">
            <span className="results-count">
              {movimentacoesFiltradas.length} de {movimentacoes.length} movimentações
            </span>
          </div>
        </div>
        
        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Produto</th>
                <th>Quantidade</th>
                <th>Tipo</th>
                <th>Responsável</th>
                <th>Origem</th>
                <th>Destino</th>
              </tr>
            </thead>
            <tbody>
              {!movimentacoesFiltradas || movimentacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center' }}>
                    {movimentacoes.length === 0 ? 'Nenhuma movimentação registrada' : 'Nenhuma movimentação encontrada com os filtros aplicados'}
                  </td>
                </tr>
              ) : (
                movimentacoesFiltradas.map((mov, idx) => {
                  const tipo = mov.tipoMovimentacao || '-';
                  const isTransferencia = tipo === 'TRANSFERENCIA';
                  
                  // Corrige o problema de data (timezone)
                  let dataFormatada = '-';
                  if (mov.data) {
                    const data = new Date(mov.data + 'T00:00:00');
                    dataFormatada = data.toLocaleDateString('pt-BR');
                  }
                  
                  // Para TRANSFERENCIA: mostra origem e destino
                  // Para ENTRADA/SAIDA: mostra apenas origem (setor do produto)
                  const origem = mov.setorOrigem || '-';
                  const destino = isTransferencia ? (mov.setorDestino || '-') : 'N/A';
                  
                  return (
                    <tr key={mov.id || idx}>
                      <td>{dataFormatada}</td>
                      <td>{mov.produtoDescricao || mov.produtoId || '-'}</td>
                      <td>{mov.quantidade || 0}</td>
                      <td>
                        <span className={`status-badge ${tipo.toLowerCase()}`}>
                          {tipo}
                        </span>
                      </td>
                      <td>{mov.responsavel || 'N/A'}</td>
                      <td>{origem}</td>
                      <td className={!isTransferencia ? 'text-muted' : ''}>{destino}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Movimentacao;
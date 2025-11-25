// src/pages/ItemsList.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import { useAuth } from '../../contexts/AuthContext';
import './ItemsList.css';

const ItemsList = () => {
  const navigate = useNavigate();
  const { items, deleteItem } = useContext(ItemsContext);
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    supplier: ''
  });

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const filteredItems = items
    .filter(item => {
      const itemName = item.name || item.descricao || '';
      const itemCategory = item.categoria || item.category || '';
      const itemSupplier = item.setor || item.supplier || '';
      
      const matchesSearch = itemName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = !filters.category || itemCategory === filters.category;
      const matchesStatus = !filters.status || (filters.status === 'In Stock' ? (item.quantidade || item.quantity || 0) > 0 : (item.quantidade || item.quantity || 0) === 0);
      const matchesSupplier = !filters.supplier || itemSupplier === filters.supplier;

      return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
    })
    .sort((a, b) => {
      const nameA = a.name || a.descricao || '';
      const nameB = b.name || b.descricao || '';
      return nameA.localeCompare(nameB);
    }); // Ordenação alfabética

  // Categorias fixas (mesmas do formulário de cadastro)
  const categorias = [
    'Smartphone',
    'Notebook',
    'Computador',
    'Mouse',
    'Teclado',
    'Monitor',
    'Smart TV',
    'Tablet',
    'Fone de Ouvido',
    'Impressora',
    'Webcam',
    'Roteador'
  ];

  // Setores fixos (mesmos do formulário de cadastro)
  const setores = [
    'TechSource Inc.',
    'AudioGear Corp.',
    'Print Solutions Ltd.',
    'VisualTech Co.'
  ];

  const handleNewItem = () => {
    navigate('/add-item');
  };

  const handleViewItem = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleEditItem = (itemId) => {
    navigate(`/item/${itemId}/edit`);
  };

  const handleDeleteItem = async (id) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      try {
        await deleteItem(id);
        alert('Produto excluído com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir produto:', error);
        alert(`Erro ao excluir produto: ${error.message || 'Tente novamente'}`);
      }
    }
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logout();
  };

  const handleNavigateToMovement = () => {
    navigate('/movimentacao');
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <span className="logo-icon">📦</span>
          <span className="logo-text">Inbox</span>
        </div>
        <nav className="nav-menu">
          <div className="nav-item" onClick={handleNavigateToDashboard}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </div>
          <div className="nav-item active">
            <span className="nav-icon">📋</span>
            <span className="nav-text">Itens</span>
          </div>
          <div className="nav-item" onClick={handleNavigateToMovement}>
            <span className="nav-icon">🔄</span>
            <span className="nav-text">Movimentação</span>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Itens</h1>
          <button className="btn-new-item" onClick={handleNewItem}>Novo item</button>
          <div className="user-profile">
            <span className="user-icon">👤</span>
            <span className="user-name">{user?.nomeCompleto || user?.email || 'Usuário'}</span>
            <button className="btn-logout" onClick={handleLogout}>Sair</button>
          </div>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Busque produtos pelo nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filters">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="">Todas as categorias</option>
              {categorias.map(categoria => (
                <option key={categoria} value={categoria}>{categoria}</option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos os status</option>
              <option value="In Stock">Em estoque</option>
              <option value="Low Stock">Fora de estoque</option>
            </select>

            <select
              value={filters.supplier}
              onChange={(e) => handleFilterChange('supplier', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos os setores</option>
              {setores.map(setor => (
                <option key={setor} value={setor}>{setor}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Setor</th>
                <th>Quantidade</th>
                <th>Estoque Mínimo</th>
                <th>Preço</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-state">
                    Nenhum item encontrado
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  // Mapeia os campos do backend para o frontend
                  const quantidade = item.quantidade || item.quantity || 0;
                  const categoria = item.categoria || item.category || '-';
                  const setor = item.setor || item.supplier || '-';
                  const abaixoDoMinimo = item.estoqueMinimo && quantidade < item.estoqueMinimo;
                  const itemName = item.descricao || item.name || 'Sem nome';
                  const itemPrice = item.precoUnitario || item.price || 0;
                  
                  return (
                    <tr key={item.id} className={abaixoDoMinimo ? 'alerta-estoque' : ''}>
                      <td className="item-name">
                        {itemName}
                        {abaixoDoMinimo && <span className="alerta-icon" title="Estoque abaixo do mínimo!">⚠️</span>}
                      </td>
                      <td>{categoria}</td>
                      <td>{setor}</td>
                      <td className={abaixoDoMinimo ? 'quantidade-baixa' : ''}>{quantidade}</td>
                      <td>{item.estoqueMinimo !== undefined && item.estoqueMinimo !== null ? item.estoqueMinimo : '-'}</td>
                      <td>R$ {parseFloat(itemPrice).toFixed(2)}</td>
                      <td>
                        <div className="status-container">
                          <span className={`status-badge ${quantidade > 0 ? 'in-stock' : 'low-stock'}`}>
                            {quantidade > 0 ? 'Em estoque' : 'Fora de estoque'}
                          </span>
                          {abaixoDoMinimo && (
                            <span className="status-badge alerta">
                              Abaixo do mínimo
                            </span>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="view-btn" onClick={() => handleViewItem(item.id)}>Visualizar</button>
                          <button className="edit-btn" onClick={() => handleEditItem(item.id)}>Editar</button>
                          <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>Excluir</button>
                        </div>
                      </td>
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

export default ItemsList;

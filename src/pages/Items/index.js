// src/pages/ItemsList.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import './ItemsList.css';

const ItemsList = () => {
  const navigate = useNavigate();
  const { items, deleteItem } = useContext(ItemsContext); // Adicione deleteItem aqui

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

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || item.category === filters.category;
    const matchesStatus = !filters.status || (filters.status === 'In Stock' ? item.inStock : !item.inStock);
    const matchesSupplier = !filters.supplier || item.supplier === filters.supplier;

    return matchesSearch && matchesCategory && matchesStatus && matchesSupplier;
  });

  const uniqueCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
  const uniqueSuppliers = [...new Set(items.map(item => item.supplier).filter(Boolean))];

  const handleNewItem = () => {
    navigate('/add-item');
  };

  const handleViewItem = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  const handleEditItem = (itemId) => {
    navigate(`/item/${itemId}/edit`);
  };

  const handleDeleteItem = (id) => {
    if (window.confirm("Tem certeza que deseja excluir este item?")) {
      deleteItem(id);
    }
  };

  const handleNavigateToDashboard = () => {
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
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
            <span className="nav-text">Items</span>
          </div>
          <div className="nav-item" onClick={handleNavigateToMovement}>
            <span className="nav-icon">🔄</span>
            <span className="nav-text">Movimentação</span>
          </div>
        </nav>
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Items</h1>
          <div className="header-actions">
            <button className="generate-report-btn">Gerar relatório</button>
            <button className="btn-new-item" onClick={handleNewItem}>Novo item</button>
          </div>
          <div className="user-icon" onClick={handleLogout}>👤</div>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search items..."
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
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
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
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
              <option value="Transferência">Transferência</option>
            </select>

            <select
              value={filters.supplier}
              onChange={(e) => handleFilterChange('supplier', e.target.value)}
              className="filter-select"
            >
              <option value="">Todos os setores</option>
              {uniqueSuppliers.map(supplier => (
                <option key={supplier} value={supplier}>{supplier}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Código</th>
                <th>Categoria</th>
                <th>Setor</th>
                <th>Quantidade</th>
                <th>Preço</th>
                <th>Em estoque</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="9" className="empty-state">
                    Nenhum item encontrado
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => (
                  <tr key={item.id}>
                    <td className="item-name">{item.name}</td>
                    <td>{item.sku || '-'}</td>
                    <td>{item.category || '-'}</td>
                    <td>{item.supplier || '-'}</td>
                    <td>{item.quantity || 0}</td>
                    <td>R$ {(item.price || 0).toFixed(2)}</td>
                    <td>{item.inStock ? 'Sim' : 'Não'}</td>
                    <td>
                      <div className="status-container">
                        <span className={`status-badge ${item.inStock ? 'in-stock' : 'low-stock'}`}>
                          {item.inStock ? 'Em estoque' : 'Fora de estoque'}
                        </span>
                        {item.status && item.status !== 'normal' && (
                          <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                            {item.status}
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ItemsList;

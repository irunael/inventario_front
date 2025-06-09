import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { items } = useContext(ItemsContext);

  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalProducts = items.length;
  const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0);
  const diverseProducts = new Set(items.map(item => item.category)).size;
  const inStockItems = items.filter(item => item.inStock).length;

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleNewItem = () => navigate('/add-item');
  const handleView = (id) => navigate(`/item/${id}`);
  const handleEdit = (id) => navigate(`/item/${id}/edit`);
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };
  const handleNavigateToItems = () => navigate('/items');
  const handleNavigateToMovement = () => navigate('/movimentacao');

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <div className="logo">
          <span className="logo-icon">📦</span>
          <span className="logo-text">Inbox</span>
        </div>
        <nav className="nav-menu">
          <div className="nav-item active" onClick={() => navigate('/dashboard')}>
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Dashboard</span>
          </div>
          <div className="nav-item" onClick={handleNavigateToItems}>
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
          <h1>Dashboard</h1>
          <button className="btn-new-item" onClick={handleNewItem}>Novo item</button>
          <div className="user-icon" onClick={handleLogout}>👤</div>
        </div>

        <div className="stats-section">
          <div className="stat-card blue">
            <div className="stat-content">
              <h3>Total de Produtos</h3>
              <p>{totalProducts}</p>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-content">
              <h3>Valor Total</h3>
              <p>R$ {totalValue.toFixed(2)}</p>
            </div>
          </div>
          <div className="stat-card red">
            <div className="stat-content">
              <h3>Categorias</h3>
              <p>{diverseProducts}</p>
            </div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Busque produtos pelo nome"
              value={searchTerm}
              onChange={handleSearch}
              className="search-input"
            />
          </div>
        </div>

        <div className="products-section">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <p>Nenhum produto encontrado.</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div key={item.id} className="product-card">
                <div className="product-info">
                  <h3>{item.name}</h3>
                  <p>{item.description || 'Sem descrição'}</p>
                  <div className="product-details">
                    <div className="price-info">
                      <span className="price">R$ {(item.price || 0).toFixed(2)}</span>
                      <span className="quantity">Qtd: {item.quantity || 0}</span>
                    </div>
                    <div className="category-info">
                      <span className="category">{item.category || 'Sem categoria'}</span>
                      <span className="supplier">{item.supplier || 'Sem fornecedor'}</span>
                    </div>
                  </div>
                  <div className="stock-status">
                    <span className={`stock-indicator ${item.inStock ? 'in-stock' : 'out-stock'}`}>
                      {item.inStock ? 'Em estoque' : 'Fora de estoque'}
                    </span>
                    {item.status === 'em movimentação' && (
                      <span className="status-badge movement">Em movimentação</span>
                    )}
                  </div>
                </div>
                <div className="product-actions">
                  <button className="btn-view" onClick={() => handleView(item.id)}>Visualizar</button>
                  <button className="btn-edit" onClick={() => handleEdit(item.id)}>Editar</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

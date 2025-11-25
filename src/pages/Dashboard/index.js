// src/pages/Dashboard.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { items, deleteItem } = useContext(ItemsContext);
  const { user, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => {
    const itemName = item.name || item.descricao || '';
    return itemName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleSearch = (e) => setSearchTerm(e.target.value);
  const handleNewItem = () => navigate('/add-item');
  const handleView = (id) => navigate(`/item/${id}`);
  const handleEdit = (id) => navigate(`/item/${id}/edit`);
  const handleLogout = () => {
    logout();
  };
  const handleNavigateToItems = () => navigate('/items');
  const handleNavigateToMovement = () => navigate('/movimentacao');

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
          <h1>Dashboard</h1>
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
            filteredItems.map((item) => {
              // Mapeia os campos do backend para o frontend
              const itemName = item.descricao || item.name || 'Sem nome';
              const itemPrice = item.precoUnitario || item.price || 0;
              const quantidade = item.quantidade || item.quantity || 0;
              const categoria = item.categoria || item.category || 'Sem categoria';
              const setor = item.setor || item.supplier || 'Sem setor';
              const valorTotal = parseFloat(itemPrice) * quantidade;
              
              return (
                <div key={item.id} className="product-card">
                  <div className="product-info">
                    <h3>{itemName}</h3>
                    <p>Equipamento eletrônico</p>
                    <div className="product-details">
                      <div className="price-info">
                        <span className="price">R$ {parseFloat(itemPrice).toFixed(2)}</span>
                        <span className="quantity">Qtd: {quantidade}</span>
                      </div>
                      <div className="total-value">
                        <span className="total-label">Valor Total:</span>
                        <span className="total-amount">R$ {valorTotal.toFixed(2)}</span>
                      </div>
                      <div className="category-info">
                        <span className="category">{categoria}</span>
                        <span className="supplier">{setor}</span>
                      </div>
                    </div>
                    <div className="stock-status">
                      <span className={`status-badge ${quantidade > 0 ? 'in-stock' : 'out-stock'}`}>
                        {quantidade > 0 ? 'Em estoque' : 'Fora de estoque'}
                      </span>
                      {item.estoqueMinimo && quantidade < item.estoqueMinimo && (
                        <span className="status-badge alerta">
                          ⚠️ Abaixo do mínimo
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="product-actions">
                    <button className="btn-view" onClick={() => handleView(item.id)}>Visualizar</button>
                    <button className="btn-edit" onClick={() => handleEdit(item.id)}>Editar</button>
                    <button className="delete-btn" onClick={() => handleDeleteItem(item.id)}>Excluir</button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

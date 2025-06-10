// src/pages/ItemDetails.js
import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import './ItemDetails.css';

const ItemDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getItemById } = useContext(ItemsContext);
  
  const item = getItemById(id);

  if (!item) {
    return (
      <div className="content-wrapper">
        <div className="form-section">
          <h1>Item não encontrado</h1>
          <p>O item solicitado não foi encontrado.</p>
          <button
            type="button"
            className="btn-white-outline"
            onClick={() => navigate('/items')}
          >
            Voltar para lista
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    navigate(`/item/${item.id}/edit`);
  };

  const handleBackToList = () => {
    navigate('/items');
  };

  return (
    <div className="content-wrapper">
      <div className="form-section">
        <h1>Detalhes do Item</h1>
        
        <div className="details-content">
          <div className="detail-group">
            <label>Nome</label>
            <div className="detail-value">{item.name}</div>
          </div>

          {item.sku && (
            <div className="detail-group">
              <label>Codigo</label>
              <div className="detail-value">{item.sku}</div>
            </div>
          )}

          <div className="detail-group">
            <label>Descrição</label>
            <div className="detail-value">{item.description || 'Sem descrição'}</div>
          </div>

          <div className="detail-row">
            <div className="detail-group">
              <label>Quantidade</label>
              <div className="detail-value">{item.quantity || 0}</div>
            </div>

            <div className="detail-group">
              <label>Preço</label>
              <div className="detail-value">R$ {(item.price || 0).toFixed(2)}</div>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-group">
              <label>Categoria</label>
              <div className="detail-value">{item.category || 'Sem categoria'}</div>
            </div>

            <div className="detail-group">
              <label>Setor</label>
              <div className="detail-value">{item.supplier || 'Sem fornecedor'}</div>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-group">
              <label>Status do Estoque</label>
              <div className="detail-value">
                <span className={`status-badge ${item.inStock ? 'in-stock' : 'out-stock'}`}>
                  {item.inStock ? 'Em estoque' : 'Fora de estoque'}
                </span>
              </div>
            </div>

            {item.status && item.status !== 'normal' && (
              <div className="detail-group">
                <label>Status do Item</label>
                <div className="detail-value">
                  <span className={`status-badge ${item.status.toLowerCase().replace(' ', '-')}`}>
                    {item.status}
                  </span>
                </div>
              </div>
            )}
          </div>

          {item.lastUpdated && (
            <div className="detail-group">
              <label>Última atualização</label>
              <div className="detail-value">{item.lastUpdated}</div>
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="btn-white-outline"
            onClick={handleBackToList}
          >
            Voltar
          </button>
          <button
            type="button"
            className="btn-white-primary"
            onClick={handleEdit}
          >
            Editar
          </button>
        </div>
      </div>

      <div className="illustration">
        <div className="box-illustration">
          <div className="box">
            <div className="box-top"></div>
            <div className="box-front"></div>
            <div className="box-side"></div>
            <div className="tape tape-1"></div>
            <div className="tape tape-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;

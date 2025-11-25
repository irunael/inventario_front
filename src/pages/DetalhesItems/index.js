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
            <label>Descrição do Produto</label>
            <div className="detail-value">{item.descricao || item.name || 'Sem descrição'}</div>
          </div>

          <div className="detail-row">
            <div className="detail-group">
              <label>Quantidade</label>
              <div className="detail-value">{item.quantidade || item.quantity || 0}</div>
            </div>

            <div className="detail-group">
              <label>Estoque Mínimo</label>
              <div className="detail-value">{item.estoqueMinimo || 0}</div>
            </div>
          </div>

          <div className="detail-group">
            <label>Preço Unitário</label>
            <div className="detail-value">R$ {parseFloat(item.precoUnitario || item.price || 0).toFixed(2)}</div>
          </div>

          <div className="detail-row">
            <div className="detail-group">
              <label>Categoria</label>
              <div className="detail-value">{item.categoria || item.category || 'Sem categoria'}</div>
            </div>

            <div className="detail-group">
              <label>Setor</label>
              <div className="detail-value">{item.setor || item.supplier || 'Sem setor'}</div>
            </div>
          </div>

          <div className="detail-row">
            <div className="detail-group">
              <label>Status do Estoque</label>
              <div className="detail-value">
                <span className={`status-badge ${(item.quantidade || item.quantity || 0) > 0 ? 'in-stock' : 'out-stock'}`}>
                  {(item.quantidade || item.quantity || 0) > 0 ? 'Em estoque' : 'Fora de estoque'}
                </span>
              </div>
            </div>

            {item.estoqueMinimo && (item.quantidade || item.quantity || 0) < item.estoqueMinimo && (
              <div className="detail-group">
                <label>Alerta</label>
                <div className="detail-value">
                  <span className="status-badge alerta">
                    ⚠️ Abaixo do mínimo
                  </span>
                </div>
              </div>
            )}
          </div>
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

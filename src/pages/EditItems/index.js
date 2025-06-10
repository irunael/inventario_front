import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import './EditItem.css';

const EditItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { items, updateItem } = useContext(ItemsContext);
  
  const [item, setItem] = useState({
    name: '',
    sku: '',
    description: '',
    quantity: 0,
    price: 0,
    category: '',
    supplier: '',
    inStock: true,
    isSupplierChanging: false,
    newSupplier: '',
    originalSupplier: '',
    status: 'normal'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const foundItem = items.find(item => item.id === parseInt(id));
    
    if (foundItem) {
      setItem({
        ...foundItem,
        originalSupplier: foundItem.supplier,
        isSupplierChanging: false,
        newSupplier: '',
        status: foundItem.status || 'normal'
      });
    } else {
      setError('Item não encontrado');
    }
    
    setLoading(false);
  }, [id, items]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setItem(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSupplierChangeToggle = (e) => {
    const isChanging = e.target.value === 'true';
    setItem(prev => ({
      ...prev,
      isSupplierChanging: isChanging,
      newSupplier: isChanging ? '' : prev.supplier,
      status: isChanging ? 'em movimentação' : 'normal'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!item.name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    const updatedItem = {
      ...item,
      supplier: item.isSupplierChanging ? item.newSupplier : item.supplier,
      status: item.isSupplierChanging ? 'em movimentação' : 'normal'
    };

    try {
      updateItem(item.id, updatedItem);
      navigate(`/item/${item.id}`);
    } catch (err) {
      setError('Erro ao salvar item');
      console.error('Erro:', err);
    }
  };

  const handleCancel = () => {
    navigate(`/item/${item.id}`);
  };

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="form-section">
          <h1>Carregando...</h1>
        </div>
      </div>
    );
  }

  if (error && !item.id) {
    return (
      <div className="content-wrapper">
        <div className="form-section">
          <h1>Erro</h1>
          <p>{error}</p>
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

  const availableCategories = [...new Set(items.map(item => item.category).filter(Boolean))];
  const availableSuppliers = [...new Set(items.map(item => item.supplier).filter(Boolean))];

  return (
    <div className="content-wrapper">
      <div className="form-section">
        <h1>Editar Item</h1>
        
        {error && item.id && (
          <div className="error-message" style={{color: 'red', marginBottom: '16px'}}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="name"
              value={item.name}
              onChange={handleInputChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label>Código</label>
            <input
              type="text"
              name="sku"
              value={item.sku}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <textarea
              name="description"
              value={item.description}
              onChange={handleInputChange}
              className="form-textarea"
              rows="3"
            />
          </div>

            <div className="form-group">
              <label>Preço *</label>
              <input
                type="number"
                name="price"
                value={item.price}
                onChange={handleInputChange}
                className="form-input"
                step="0.01"
                min="0"
                required
              />
            </div>

          <div className="form-row">
            <div className="form-group">
              <label>Categoria</label>
              <select
                name="category"
                value={item.category}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="">Selecione uma categoria</option>
                {availableCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-white-outline"
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-white-primary"
            >
              Salvar Alterações
            </button>
          </div>
        </form>
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

export default EditItem;

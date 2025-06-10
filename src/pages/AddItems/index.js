import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import './AddNewItem.css';

const AddNewItem = () => {
  const { addItem } = useContext(ItemsContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', // Mudei de itemName para name para manter consistência
    sku: '',
    description: '',
    quantity: '',
    price: '',
    category: '',
    supplier: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpa o erro quando o usuário começa a digitar
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ['name', 'sku', 'quantity', 'price', 'category', 'supplier'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo é obrigatório';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Cria o novo item com os dados do formulário
    const newItem = {
      ...formData,
      id: Date.now(), // Gera um ID único
      inStock: parseInt(formData.quantity) > 0,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    };

    // Adiciona o item usando o contexto
    addItem(newItem);
    
    // Redireciona para a página de itens
    navigate('/items');
  };

  return (
    <div className="content-wrapper">
      <div className="form-section">
        <h1>Adicionar novo item</h1>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label>Código *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className={`form-input ${errors.sku ? 'error' : ''}`}
            />
            {errors.sku && <span className="error-message">{errors.sku}</span>}
          </div>

          <div className="form-group">
            <label>Descrição</label>
            <input
              type="text"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Quantidade *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className={`form-input ${errors.quantity ? 'error' : ''}`}
              min="0"
            />
            {errors.quantity && <span className="error-message">{errors.quantity}</span>}
          </div>

          <div className="form-group">
            <label>Preço *</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`form-input ${errors.price ? 'error' : ''}`}
              step="0.01"
              min="0"
            />
            {errors.price && <span className="error-message">{errors.price}</span>}
          </div>

          <div className="form-group">
            <label>Categoria *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`form-select ${errors.category ? 'error' : ''}`}
            >
              <option value="">Selecione</option>
              <option value="Eletrônicos">Eletrônicos</option>
              <option value="Roupas">Roupas</option>
              <option value="Alimentos">Alimentos</option>
              <option value="Acessórios">Acessórios</option>
              <option value="Material de Escritório">Material de Escritório</option>
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label>Setor *</label>
            <select
              name="supplier"
              value={formData.supplier}
              onChange={handleInputChange}
              className={`form-select ${errors.supplier ? 'error' : ''}`}
            >
              <option value="">Selecione</option>
              <option value="TechSource Inc.">TechSource Inc.</option>
              <option value="AudioGear Corp.">AudioGear Corp.</option>
              <option value="Print Solutions Ltd.">Print Solutions Ltd.</option>
              <option value="VisualTech Co.">VisualTech Co.</option>
            </select>
            {errors.supplier && <span className="error-message">{errors.supplier}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-white-outline"
              onClick={() => navigate(-1)}
            >
              Voltar
            </button>

            <button
              type="submit"
              className="btn-white-primary"
            >
              Adicionar item
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

export default AddNewItem;
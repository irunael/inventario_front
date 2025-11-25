import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import './AddNewItem.css';

const AddNewItem = () => {
  const { addItem } = useContext(ItemsContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    descricao: '',
    precoUnitario: '',
    quantity: '',
    category: '',
    supplier: '',
    estoqueMinimo: ''
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
    const requiredFields = ['descricao', 'precoUnitario', 'quantity', 'category', 'supplier', 'estoqueMinimo'];
    
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Este campo é obrigatório';
      }
    });

    // Validação adicional
    if (formData.precoUnitario && parseFloat(formData.precoUnitario) <= 0) {
      newErrors.precoUnitario = 'Preço deve ser maior que zero';
    }

    if (formData.estoqueMinimo && parseInt(formData.estoqueMinimo) <= 0) {
      newErrors.estoqueMinimo = 'Estoque mínimo deve ser maior que 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      // Prepara todos os dados no formato que o backend aceita
      const backendData = {
        descricao: formData.descricao,
        precoUnitario: parseFloat(formData.precoUnitario),
        unidadeMedida: 'UNIDADE',
        categoria: formData.category,
        setor: formData.supplier,
        quantidadeInicial: parseInt(formData.quantity),
        estoqueMinimo: parseInt(formData.estoqueMinimo)
      };

      console.log('Enviando dados para backend:', backendData);

      // Adiciona o item usando o contexto
      const createdItem = await addItem(backendData);
      
      console.log('Item criado com sucesso:', createdItem);
      
      // Redireciona para a página de itens
      navigate('/items');
    } catch (error) {
      console.error('Erro ao adicionar item:', error);
      setErrors({ submit: error.message || 'Erro ao adicionar item. Tente novamente.' });
    }
  };

  return (
    <div className="content-wrapper">
      <div className="form-section">
        <h1>Adicionar novo item</h1>

        {errors.submit && (
          <div className="error-message submit-error" style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#ffdce0', color: '#86181d', borderRadius: '6px', border: '1px solid #d73a49' }}>
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Descrição do Produto *</label>
            <input
              type="text"
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className={`form-input ${errors.descricao ? 'error' : ''}`}
              placeholder="Ex: Notebook Dell Inspiron 15"
            />
            {errors.descricao && <span className="error-message">{errors.descricao}</span>}
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
            <label>Estoque Mínimo *</label>
            <input
              type="number"
              name="estoqueMinimo"
              value={formData.estoqueMinimo}
              onChange={handleInputChange}
              className={`form-input ${errors.estoqueMinimo ? 'error' : ''}`}
              min="1"
            />
            {errors.estoqueMinimo && <span className="error-message">{errors.estoqueMinimo}</span>}
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
              <option value="Smartphone">Smartphone</option>
              <option value="Notebook">Notebook</option>
              <option value="Computador">Computador</option>
              <option value="Mouse">Mouse</option>
              <option value="Teclado">Teclado</option>
              <option value="Monitor">Monitor</option>
              <option value="Smart TV">Smart TV</option>
              <option value="Tablet">Tablet</option>
              <option value="Fone de Ouvido">Fone de Ouvido</option>
              <option value="Impressora">Impressora</option>
              <option value="Webcam">Webcam</option>
              <option value="Roteador">Roteador</option>
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

          <div className="form-group">
            <label>Preço Unitário *</label>
            <input
              type="number"
              name="precoUnitario"
              value={formData.precoUnitario}
              onChange={handleInputChange}
              className={`form-input ${errors.precoUnitario ? 'error' : ''}`}
              step="0.01"
              min="0"
              placeholder="0.00"
            />
            {errors.precoUnitario && <span className="error-message">{errors.precoUnitario}</span>}
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
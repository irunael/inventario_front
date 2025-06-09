// src/pages/MovimentacaoForm.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import './MovimentacaoForm.css';

const MovimentacaoForm = () => {
  const navigate = useNavigate();
  const { items, addMovimentacao } = useContext(ItemsContext);
  
  const [form, setForm] = useState({
    data: new Date().toISOString().split('T')[0],
    idProduto: '',
    quantidade: '',
    tipo: 'entrada',
    origem: '',
    destino: ''
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.data) newErrors.data = 'Data é obrigatória';
    if (!form.idProduto) newErrors.idProduto = 'Selecione um produto';
    if (!form.quantidade || isNaN(form.quantidade) || parseInt(form.quantidade) < 1) {
      newErrors.quantidade = 'Quantidade inválida.';
    }
    
    if (form.tipo === 'movimentar') {
      if (!form.origem) newErrors.origem = 'Origem é obrigatória';
      if (!form.destino) newErrors.destino = 'Destino é obrigatório';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const movimentacao = {
      ...form,
      quantidade: parseInt(form.quantidade)
    };

    if (addMovimentacao(movimentacao)) {
      navigate('/movimentacao');
    } else {
      setErrors({ ...errors, idProduto: 'Produto não encontrado' });
    }
  };

  return (
    <div className="content-wrapper">
      <div className="form-section">
        <h1>Registrar Movimentação</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Data *</label>
            <input
              type="date"
              name="data"
              value={form.data}
              onChange={handleChange}
              className={errors.data ? 'error-input' : ''}
            />
            {errors.data && <span className="error-message">{errors.data}</span>}
          </div>

          <div className="form-group">
            <label>Produto *</label>
            <select
              name="idProduto"
              value={form.idProduto}
              onChange={handleChange}
              className={errors.idProduto ? 'error-input' : ''}
            >
              <option value="">Selecione um produto</option>
              {items.map(item => (
                <option key={item.id} value={item.id}>
                  {item.name} (ID: {item.id}, Estoque: {item.quantity})
                </option>
              ))}
            </select>
            {errors.idProduto && <span className="error-message">{errors.idProduto}</span>}
          </div>

          <div className="form-group">
            <label>Quantidade *</label>
            <input
              type="number"
              name="quantidade"
              value={form.quantidade}
              onChange={handleChange}
              min="1"
              className={errors.quantidade ? 'error-input' : ''}
            />
            {errors.quantidade && <span className="error-message">{errors.quantidade}</span>}
          </div>

          <div className="form-group">
            <label>Tipo de Movimentação *</label>
            <select
              name="tipo"
              value={form.tipo}
              onChange={handleChange}
            >
              <option value="entrada">Entrada</option>
              <option value="saída">Saída</option>
              <option value="movimentar">Transferência</option>
            </select>
          </div>

          {form.tipo === 'movimentar' && (
            <>
              <div className="form-group">
                <label>Setor de Origem *</label>
                <input
                  type="text"
                  name="origem"
                  value={form.origem}
                  onChange={handleChange}
                  className={errors.origem ? 'error-input' : ''}
                />
                {errors.origem && <span className="error-message">{errors.origem}</span>}
              </div>
              <div className="form-group">
                <label>Setor de Destino *</label>
                <input
                  type="text"
                  name="destino"
                  value={form.destino}
                  onChange={handleChange}
                  className={errors.destino ? 'error-input' : ''}
                />
                {errors.destino && <span className="error-message">{errors.destino}</span>}
              </div>
            </>
          )}

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate('/movimentacao')}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Registrar Movimentação
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovimentacaoForm;
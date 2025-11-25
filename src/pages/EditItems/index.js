import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import './EditItem.css';

const EditItem = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { items, updateItem } = useContext(ItemsContext);
  
  const [item, setItem] = useState({
    descricao: '',
    precoUnitario: 0,
    quantity: 0,
    category: '',
    supplier: '',
    estoqueMinimo: 0,
    inStock: true,
    status: 'normal'
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const foundItem = items.find(item => item.id === parseInt(id));
    
    if (foundItem) {
      setItem({
        id: foundItem.id,
        descricao: foundItem.descricao || foundItem.name || '',
        precoUnitario: foundItem.precoUnitario || foundItem.price || 0,
        quantity: foundItem.quantidade || foundItem.quantity || 0,
        category: foundItem.categoria || foundItem.category || '',
        supplier: foundItem.setor || foundItem.supplier || '',
        estoqueMinimo: foundItem.estoqueMinimo || 0,
        inStock: foundItem.inStock !== undefined ? foundItem.inStock : true,
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!item.descricao || !item.descricao.trim()) {
      setError('Descrição é obrigatória');
      return;
    }

    if (!item.precoUnitario || parseFloat(item.precoUnitario) <= 0) {
      setError('Preço deve ser maior que zero');
      return;
    }

    try {
      // Prepara todos os dados no formato que o backend aceita
      const backendData = {
        descricao: item.descricao,
        precoUnitario: parseFloat(item.precoUnitario),
        unidadeMedida: 'UNIDADE',
        categoria: item.category,
        setor: item.supplier,
        quantidade: parseInt(item.quantity),
        estoqueMinimo: parseInt(item.estoqueMinimo)
      };

      console.log('Atualizando produto:', backendData);
      await updateItem(item.id, backendData);
      navigate(`/item/${item.id}`);
    } catch (err) {
      setError('Erro ao salvar item');
      console.error('Erro:', err);
    }
  };

  const handleCancel = () => {
    navigate(-1); // Volta para a página anterior
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
            <label>Descrição do Produto *</label>
            <input
              type="text"
              name="descricao"
              value={item.descricao}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Ex: Notebook Dell Inspiron 15"
              required
            />
          </div>

          <div className="form-group">
            <label>Quantidade *</label>
            <input
              type="number"
              name="quantity"
              value={item.quantity}
              onChange={handleInputChange}
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Estoque Mínimo *</label>
            <input
              type="number"
              name="estoqueMinimo"
              value={item.estoqueMinimo}
              onChange={handleInputChange}
              className="form-input"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Preço Unitário *</label>
            <input
              type="number"
              name="precoUnitario"
              value={item.precoUnitario}
              onChange={handleInputChange}
              className="form-input"
              step="0.01"
              min="0"
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Categoria *</label>
            <select
              name="category"
              value={item.category}
              onChange={handleInputChange}
              className="form-select"
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
          </div>

          <div className="form-group">
            <label>Setor *</label>
            <select
              name="supplier"
              value={item.supplier}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Selecione</option>
              <option value="TechSource Inc.">TechSource Inc.</option>
              <option value="AudioGear Corp.">AudioGear Corp.</option>
              <option value="Print Solutions Ltd.">Print Solutions Ltd.</option>
              <option value="VisualTech Co.">VisualTech Co.</option>
            </select>
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

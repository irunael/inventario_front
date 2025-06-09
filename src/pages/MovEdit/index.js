import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './MovEdit.css';

const MovEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    produto: '',
    tipo: '',
    quantidade: '',
    data: '',
    origem: '',
    destino: ''
  });

  // Simulação de carregamento de dados - substitua por sua chamada API real
  useEffect(() => {
    // Exemplo de dados mockados
    const mockData = {
      1: { produto: 'Produto A', tipo: 'Entrada', quantidade: 10, data: '2023-05-01', origem: 'DEP001', destino: 'DEP002' },
      2: { produto: 'Produto B', tipo: 'Saída', quantidade: 5, data: '2023-05-02', origem: 'DEP002', destino: 'DEP001' }
    };
    
    if (mockData[id]) {
      setFormData(mockData[id]);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você adicionaria a lógica para salvar as alterações
    alert('Movimentação atualizada com sucesso!');
    navigate('/movimentacao');
  };

  return (
    <div className="content-wrapper">
      <div className="form-section">
        <h1>Editar Movimentação #{id}</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Produto:</label>
            <input
              type="text"
              name="produto"
              value={formData.produto}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Tipo:</label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleInputChange}
              required
            >
              <option value="Entrada">Entrada</option>
              <option value="Saída">Saída</option>
              <option value="Movimentação">Movimentação</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantidade:</label>
            <input
              type="number"
              name="quantidade"
              value={formData.quantidade}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Data:</label>
            <input
              type="date"
              name="data"
              value={formData.data}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Origem:</label>
            <input
              type="text"
              name="origem"
              value={formData.origem}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Destino:</label>
            <input
              type="text"
              name="destino"
              value={formData.destino}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">Salvar Alterações</button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/movimentacao')}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovEdit;
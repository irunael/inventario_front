import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Movimentacao.css';

const Movimentacao = () => {
  const navigate = useNavigate();
  const [movimentacoes, setMovimentacoes] = useState([]);

  // Simulação de dados - substitua por sua chamada API real
  useEffect(() => {
    // Exemplo de dados mockados
    const mockData = [
      { id: 1, produto: 'Produto A', tipo: 'Entrada', quantidade: 10, data: '2023-05-01', origem: 'DEP001', destino: 'DEP002' },
      { id: 2, produto: 'Produto B', tipo: 'Saída', quantidade: 5, data: '2023-05-02', origem: 'DEP002', destino: 'DEP001' }
    ];
    setMovimentacoes(mockData);
  }, []);

  const handleEdit = (id) => {
    navigate(`/movimentacao/${id}/edit`);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
        {/* Seu sidebar existente */}
      </div>

      <div className="main-content">
        <div className="header">
          <h1>Movimentações</h1>
          <button 
            className="btn-new-item" 
            onClick={() => navigate('/movimentacao-form')}
          >
            Nova Movimentação
          </button>
          <div className="user-icon">👤</div>
        </div>

        <div className="table-container">
          <table className="items-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Quantidade</th>
                <th>Data</th>
                <th>Origem</th>
                <th>Destino</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoes.map(mov => (
                <tr key={mov.id}>
                  <td>{mov.id}</td>
                  <td>{mov.produto}</td>
                  <td>{mov.tipo}</td>
                  <td>{mov.quantidade}</td>
                  <td>{mov.data}</td>
                  <td>{mov.origem}</td>
                  <td>{mov.destino}</td>
                  <td>
                    <button 
                      className="edit-btn"
                      onClick={() => handleEdit(mov.id)}
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Movimentacao;
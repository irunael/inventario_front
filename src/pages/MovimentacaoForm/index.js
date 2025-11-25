// src/pages/MovimentacaoForm.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ItemsContext } from '../../contexts/ItemsContext';
import { useAuth } from '../../contexts/AuthContext';
import './MovimentacaoForm.css';

const MovimentacaoForm = () => {
  const navigate = useNavigate();
  const { items, addMovimentacao } = useContext(ItemsContext);
  const { user } = useAuth();
  
  const [form, setForm] = useState({
    data: new Date().toISOString().split('T')[0],
    idProduto: '',
    quantidade: '',
    tipo: 'entrada',
    origem: '',
    destino: ''
  });

  // Lista de setores disponíveis
  const setoresDisponiveis = [
    'TechSource Inc.',
    'AudioGear Corp.',
    'Print Solutions Ltd.',
    'VisualTech Co.'
  ];
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Se mudou o produto, atualiza o setor de origem para todos os tipos
    if (name === 'idProduto') {
      const produto = items.find(item => item.id === parseInt(value));
      const setorProduto = produto?.setor || produto?.supplier || '';
      
      setForm(prev => ({
        ...prev,
        [name]: value,
        origem: setorProduto,
        destino: form.tipo === 'transferencia' ? '' : prev.destino
      }));
    }
    // Se mudou o tipo, atualiza origem se necessário
    else if (name === 'tipo' && form.idProduto) {
      const produto = items.find(item => item.id === parseInt(form.idProduto));
      const setorProduto = produto?.setor || produto?.supplier || '';
      
      setForm(prev => ({
        ...prev,
        [name]: value,
        origem: setorProduto,
        destino: value === 'transferencia' ? '' : null
      }));
    }
    else {
      setForm(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
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
    
    if (form.tipo === 'transferencia') {
      if (!form.origem) newErrors.origem = 'Produto não possui setor de origem';
      if (!form.destino) newErrors.destino = 'Selecione o setor de destino';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    // Busca o produto selecionado
    const produto = items.find(item => item.id === parseInt(form.idProduto));
    
    if (!produto) {
      setErrors({ ...errors, idProduto: 'Produto não encontrado' });
      return;
    }

    const estoqueAtual = produto.quantidade || produto.quantity || 0;
    const nomeProduto = produto.descricao || produto.name || 'Produto';

    // Verifica estoque mínimo em caso de saída
    if (form.tipo === 'saída') {
      const novoEstoque = estoqueAtual - parseInt(form.quantidade);
      
      if (novoEstoque < 0) {
        alert('Erro: Quantidade insuficiente em estoque!');
        return;
      }
      
      if (produto.estoqueMinimo && novoEstoque < produto.estoqueMinimo) {
        alert(`ALERTA: O estoque do produto "${nomeProduto}" ficará abaixo do mínimo configurado (${produto.estoqueMinimo})!\nEstoque atual: ${estoqueAtual}\nEstoque após saída: ${novoEstoque}`);
      }
    }

    // Prepara os dados no formato que o backend espera
    const movimentacao = {
      produtoId: parseInt(form.idProduto),
      quantidade: parseInt(form.quantidade),
      tipoMovimentacao: form.tipo.toUpperCase(), // ENTRADA, SAIDA, TRANSFERENCIA
      data: form.data,
      responsavel: user?.nomeCompleto || user?.email || 'Usuário',
      // Para ENTRADA e SAIDA, envia apenas origem (setor do produto)
      // Para TRANSFERENCIA, envia origem e destino
      setorOrigem: form.origem || null,
      setorDestino: form.tipo === 'transferencia' ? (form.destino || null) : null
    };

    console.log('Registrando movimentação:', movimentacao);

    try {
      await addMovimentacao(movimentacao);
      navigate('/movimentacao');
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      setErrors({ ...errors, idProduto: error.message || 'Erro ao registrar movimentação' });
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
              {items.map(item => {
                const nome = item.descricao || item.name || 'Sem nome';
                const estoque = item.quantidade || item.quantity || 0;
                return (
                  <option key={item.id} value={item.id}>
                    {nome} (ID: {item.id}, Estoque: {estoque})
                  </option>
                );
              })}
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
              <option value="transferencia">Transferência</option>
            </select>
          </div>

          {form.tipo === 'transferencia' && (
            <>
              <div className="form-group">
                <label>Setor de Origem *</label>
                <input
                  type="text"
                  name="origem"
                  value={form.origem}
                  className="form-input"
                  disabled
                  style={{ backgroundColor: '#f6f8fa', cursor: 'not-allowed' }}
                />
                {errors.origem && <span className="error-message">{errors.origem}</span>}
                {!form.origem && form.idProduto && (
                  <span className="error-message">Produto não possui setor cadastrado</span>
                )}
              </div>
              <div className="form-group">
                <label>Setor de Destino *</label>
                <select
                  name="destino"
                  value={form.destino}
                  onChange={handleChange}
                  className={errors.destino ? 'error-input' : ''}
                >
                  <option value="">Selecione o setor de destino</option>
                  {setoresDisponiveis
                    .filter(setor => setor !== form.origem)
                    .map(setor => (
                      <option key={setor} value={setor}>{setor}</option>
                    ))
                  }
                </select>
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
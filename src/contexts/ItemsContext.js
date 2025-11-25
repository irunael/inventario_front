import React, { createContext, useState, useEffect } from 'react';
import { produtoService, movimentacaoService } from '../services/api';

export const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produtos, movimentacoes] = await Promise.all([
          produtoService.listar(),
          movimentacaoService.listar()
        ]);
        
        console.log('Produtos recebidos do backend:', produtos);
        
        setItems(produtos);
        setMovimentacoes(movimentacoes);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const addItem = async (newItem) => {
    try {
      console.log('Adicionando item:', newItem);
      const createdItem = await produtoService.criar(newItem);
      console.log('Item criado:', createdItem);
      setItems(prev => [...prev, createdItem]);
      return createdItem;
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
      console.error('Detalhes do erro:', err.response?.data);
      throw err;
    }
  };

  const addMovimentacao = async (movimentacao) => {
    try {
      // Se for transferência, verifica se precisa criar produto no destino
      if (movimentacao.tipoMovimentacao === 'TRANSFERENCIA') {
        const produtoOrigem = items.find(item => item.id === movimentacao.produtoId);
        
        if (produtoOrigem && movimentacao.setorDestino) {
          // Verifica se já existe produto com mesmo nome no setor de destino
          const produtoDestino = items.find(item => 
            (item.descricao === produtoOrigem.descricao || item.name === produtoOrigem.descricao) &&
            (item.setor === movimentacao.setorDestino || item.supplier === movimentacao.setorDestino)
          );
          
          // Se não existe, cria novo produto no setor de destino com estoque mínimo igual ao original
          if (!produtoDestino) {
            const novoProduto = {
              descricao: produtoOrigem.descricao || produtoOrigem.name,
              categoria: produtoOrigem.categoria || produtoOrigem.category,
              setor: movimentacao.setorDestino,
              quantidade: 0, // Começa com 0, a movimentação vai adicionar
              estoqueMinimo: produtoOrigem.estoqueMinimo || 0, // Copia o estoque mínimo
              precoUnitario: produtoOrigem.precoUnitario || produtoOrigem.price || 0
            };
            
            console.log('Criando produto no setor de destino:', novoProduto);
            await produtoService.criar(novoProduto);
          }
        }
      }
      
      const createdMovimentacao = await movimentacaoService.registrar(movimentacao);
      setMovimentacoes(prev => [...prev, createdMovimentacao]);
      
      // Atualiza a lista de produtos após movimentação
      const produtos = await produtoService.listar();
      setItems(produtos);
      
      return true;
    } catch (err) {
      throw err;
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const updated = await produtoService.atualizar(id, updatedItem);
      setItems(prevItems => prevItems.map(item => 
        item.id === id ? updated : item
      ));
    } catch (err) {
      throw err;
    }
  };

  const deleteItem = async (id) => {
    try {
      console.log('Excluindo produto ID:', id);
      await produtoService.remover(id);
      console.log('Produto excluído com sucesso');
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      console.error('Detalhes do erro:', err.response?.data);
      throw err;
    }
  };

  const getItemById = (id) => {
    return items.find(item => item.id === parseInt(id));
  };

  return (
    <ItemsContext.Provider value={{ 
      items, 
      loading,
      error,
      addItem, 
      addMovimentacao, 
      updateItem, 
      deleteItem, 
      getItemById,
      movimentacoes
    }}>
      {children}
    </ItemsContext.Provider>
  );
};
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
      const createdItem = await produtoService.criar(newItem);
      setItems(prev => [...prev, createdItem]);
      return createdItem;
    } catch (err) {
      throw err;
    }
  };

  const addMovimentacao = async (movimentacao) => {
    try {
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
      await produtoService.remover(id);
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (err) {
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
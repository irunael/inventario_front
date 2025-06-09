// src/contexts/ItemsContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    const savedItems = localStorage.getItem('inventoryItems');
    return savedItems ? JSON.parse(savedItems) : [
      {
        id: 1,
        name: 'Produto A',
        sku: 'SKU001',
        description: 'Descrição do Produto A',
        quantity: 10,
        inStock: true,
        price: 100,
        category: 'Eletrônicos',
        supplier: 'TechSource Inc.',
        status: 'normal'
      },
      {
        id: 2,
        name: 'Produto B',
        sku: 'SKU002',
        description: 'Descrição do Produto B',
        quantity: 0,
        inStock: false,
        price: 200,
        category: 'Vestuário',
        supplier: 'AudioGear Corp.',
        status: 'normal'
      }
    ];
  });

  const [movimentacoes, setMovimentacoes] = useState(() => {
    const savedMovimentacoes = localStorage.getItem('movimentacoes');
    return savedMovimentacoes ? JSON.parse(savedMovimentacoes) : [];
  });

  // Salva os itens e movimentações no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
    localStorage.setItem('movimentacoes', JSON.stringify(movimentacoes));
  }, [items, movimentacoes]);

  const addItem = (newItem) => {
    const itemWithId = { 
      ...newItem, 
      id: Date.now(),
      lastUpdated: new Date().toLocaleString('pt-BR'),
      status: newItem.status || 'normal'
    };
    setItems((prev) => [...prev, itemWithId]);
  };

  const addMovimentacao = (movimentacao) => {
    const { idProduto, quantidade, tipo, origem, destino } = movimentacao;

    setMovimentacoes(prev => [...prev, movimentacao]); // Adiciona a movimentação ao estado

    setItems(prevItems => {
      return prevItems.map(item => {
        if (item.id === parseInt(idProduto)) {
          let updatedItem = { ...item };

          if (tipo === 'entrada') {
            updatedItem.quantity += parseInt(quantidade);
            updatedItem.status = 'Entrada'; // Atualiza o status para 'Entrada'
          } else if (tipo === 'saída') {
            updatedItem.quantity -= parseInt(quantidade);
            updatedItem.status = 'Saída'; // Atualiza o status para 'Saída'
          } else if (tipo === 'movimentar') {
            updatedItem.supplier = destino; // Atualiza o fornecedor para o depósito de destino
            updatedItem.status = 'Transferência'; // Atualiza o status para 'Transferência'
          }

          return updatedItem;
        }
        return item;
      });
    });

    return true; // Retorne true se a movimentação for adicionada com sucesso
  };

  const updateItem = (id, updatedItem) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { 
          ...item, 
          ...updatedItem,
          lastUpdated: new Date().toLocaleString('pt-BR'),
          inStock: updatedItem.inStock !== undefined ? updatedItem.inStock : (updatedItem.quantity > 0)
        } : item
      );
      return updatedItems;
    });
  };

  const deleteItem = (id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const getItemById = (id) => {
    return items.find(item => item.id === parseInt(id));
  };

  return (
    <ItemsContext.Provider value={{ 
      items, 
      addItem, 
      addMovimentacao, 
      updateItem, 
      deleteItem, 
      getItemById,
      movimentacoes // Adiciona movimentações ao contexto
    }}>
      {children}
    </ItemsContext.Provider>
  );
};

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

  // Salva os itens no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('inventoryItems', JSON.stringify(items));
  }, [items]);

  const addItem = (newItem) => {
    const itemWithId = { 
      ...newItem, 
      id: Date.now(),
      lastUpdated: new Date().toLocaleString('pt-BR'),
      status: newItem.status || 'normal'
    };
    setItems((prev) => [...prev, itemWithId]);
  };

  const updateItem = (id, updatedItem) => {
    setItems(prevItems => {
      const updatedItems = prevItems.map(item => 
        item.id === id ? { 
          ...item, 
          ...updatedItem,
          lastUpdated: new Date().toLocaleString('pt-BR'),
          // Garante que inStock seja atualizado baseado na quantidade se não for especificado
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
      updateItem, 
      deleteItem, 
      getItemById 
    }}>
      {children}
    </ItemsContext.Provider>
  );
};
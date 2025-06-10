// src/contexts/ItemsContext.js
import React, { createContext, useState, useEffect } from 'react';

export const ItemsContext = createContext();

export const ItemsProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [movimentacoes, setMovimentacoes] = useState([]);

  useEffect(() => {
    // Função para buscar os itens do backend
    const fetchItems = async () => {
      try {
        const response = await fetch('/produtos'); // Substitua '/produtos' pelo endpoint correto do seu backend
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Erro ao buscar itens do backend:", error);
        // Tratar o erro, como exibir uma mensagem para o usuário
      }
    };

    // Função para buscar as movimentações do backend
    const fetchMovimentacoes = async () => {
      try {
        const response = await fetch('/movimentacoes'); // Substitua '/movimentacoes' pelo endpoint correto do seu backend
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMovimentacoes(data);
      } catch (error) {
        console.error("Erro ao buscar movimentações do backend:", error);
        // Tratar o erro, como exibir uma mensagem para o usuário
      }
    };

    fetchItems();
    fetchMovimentacoes();
  }, []); // Executa apenas uma vez ao montar o componente

  const addItem = async (newItem) => {
    try {
      const response = await fetch('/produtos', { // Substitua '/produtos' pelo endpoint correto do seu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems((prev) => [...prev, data]); // Adiciona o novo item ao estado
    } catch (error) {
      console.error("Erro ao adicionar item no backend:", error);
      // Tratar o erro, como exibir uma mensagem para o usuário
    }
  };

  const addMovimentacao = async (movimentacao) => {
    try {
      const response = await fetch('/movimentacoes', { // Substitua '/movimentacoes' pelo endpoint correto do seu backend
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(movimentacao),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMovimentacoes(prev => [...prev, data]); // Adiciona a movimentação ao estado
      
      // Após adicionar a movimentação, você pode precisar atualizar os itens
      // Buscando novamente do backend ou atualizando o estado localmente
      const fetchItems = async () => {
        try {
          const response = await fetch('/produtos'); // Substitua '/produtos' pelo endpoint correto do seu backend
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setItems(data);
        } catch (error) {
          console.error("Erro ao buscar itens do backend:", error);
          // Tratar o erro, como exibir uma mensagem para o usuário
        }
      };
      fetchItems();

      return true; // Retorne true se a movimentação for adicionada com sucesso
    } catch (error) {
      console.error("Erro ao adicionar movimentação no backend:", error);
      return false; // Retorne false se a movimentação não foi adicionada
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const response = await fetch(`/produtos/${id}`, { // Substitua '/produtos/:id' pelo endpoint correto do seu backend
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setItems(prevItems => {
        const updatedItems = prevItems.map(item => 
          item.id === id ? data : item // Substitui o item atualizado pelo item retornado do backend
        );
        return updatedItems;
      });
    } catch (error) {
      console.error("Erro ao atualizar item no backend:", error);
      // Tratar o erro, como exibir uma mensagem para o usuário
    }
  };

  const deleteItem = async (id) => {
    try {
      const response = await fetch(`/produtos/${id}`, { // Substitua '/produtos/:id' pelo endpoint correto do seu backend
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Erro ao deletar item no backend:", error);
      // Tratar o erro, como exibir uma mensagem para o usuário
    }
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

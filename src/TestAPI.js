import React, { useState } from 'react';
import axios from 'axios';

const TestAPI = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testRegister = async () => {
    setLoading(true);
    setResult('Testando...');
    
    try {
      const testData = {
        nomeCompleto: 'Teste Usuario',
        email: 'teste@email.com',
        senha: '123456',
        tipo: 'usuario'
      };
      
      console.log('Enviando:', testData);
      
      const response = await axios.post('http://localhost:8080/auth/register', testData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta:', response);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Erro:', error);
      setResult(`ERRO: ${error.message}\n\nDetalhes: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  const testLogin = async () => {
    setLoading(true);
    setResult('Testando login...');
    
    try {
      const testData = {
        email: 'teste@email.com',
        senha: '123456'
      };
      
      console.log('Enviando login:', testData);
      
      const response = await axios.post('http://localhost:8080/auth/login', testData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Resposta login:', response);
      setResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Erro login:', error);
      setResult(`ERRO: ${error.message}\n\nDetalhes: ${JSON.stringify(error.response?.data || error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Teste de API</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testRegister} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Testar Registro
        </button>
        
        <button 
          onClick={testLogin} 
          disabled={loading}
          style={{ 
            padding: '10px 20px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          Testar Login
        </button>
      </div>
      
      <div style={{ 
        background: '#f5f5f5', 
        padding: '15px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        minHeight: '200px'
      }}>
        {result || 'Clique em um botão para testar'}
      </div>
      
      <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
        <p>Abra o Console do navegador (F12) para ver logs detalhados</p>
      </div>
    </div>
  );
};

export default TestAPI;

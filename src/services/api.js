import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Serviço de Autenticação
export const authService = {
  login: async (email, senha) => {
    try {
      console.log('Fazendo login com:', { email, senha });
      const response = await api.post('/auth/login', { email, senha });
      console.log('Resposta do login:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro no login:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao fazer login';
      throw new Error(errorMessage);
    }
  },

  register: async (userData) => {
    try {
      // Ajusta os campos para o formato que o backend espera
      const payload = {
        nome: userData.nomeCompleto, // Backend espera "nome"
        email: userData.email,
        senha: userData.senha,
        role: userData.tipo?.toUpperCase() || 'USUARIO' // Backend espera "role" em maiúsculo
      };
      
      console.log('Registrando usuário:', payload);
      const response = await api.post('/auth/register', payload);
      console.log('Resposta do registro:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro completo no registro:', error);
      console.error('Resposta do erro:', error.response);
      console.error('Dados do erro:', error.response?.data);
      
      // Tenta pegar a mensagem de erro do backend
      let errorMessage = 'Erro ao registrar usuário';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      throw new Error(errorMessage);
    }
  },
};

// Serviço de Produtos
export const produtoService = {
  listar: async () => {
    try {
      const response = await api.get('/produtos');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao listar produtos' };
    }
  },

  criar: async (produtoData) => {
    try {
      console.log('Criando produto:', produtoData);
      const response = await api.post('/produtos', produtoData);
      console.log('Resposta do backend:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      console.error('Resposta do erro:', error.response?.data);
      
      let errorMessage = 'Erro ao criar produto';
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      throw new Error(errorMessage);
    }
  },

  buscarPorId: async (id) => {
    try {
      const response = await api.get(`/produtos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao buscar produto' };
    }
  },

  atualizar: async (id, produtoData) => {
    try {
      console.log(`Atualizando produto ${id}:`, produtoData);
      const response = await api.put(`/produtos/${id}`, produtoData);
      console.log('Produto atualizado:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      throw error.response?.data || { message: 'Erro ao atualizar produto' };
    }
  },

  remover: async (id) => {
    try {
      console.log(`Removendo produto ${id}`);
      await api.delete(`/produtos/${id}`);
      console.log('Produto removido com sucesso');
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      console.error('Detalhes:', error.response?.data);
      
      // Verifica se é erro de constraint (produto tem movimentações)
      const errorData = error.response?.data;
      if (errorData?.error && errorData.error.includes('constraint')) {
        throw new Error('Não é possível excluir este produto pois ele possui movimentações registradas.');
      }
      
      const errorMessage = errorData?.message || errorData?.error || 'Erro ao remover produto';
      throw new Error(errorMessage);
    }
  },
};

// Serviço de Estoque
export const estoqueService = {
  consultarValorTotal: async () => {
    try {
      const response = await api.get('/estoque');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao consultar valor total' };
    }
  },

  consultarPorProduto: async (produtoId) => {
    try {
      const response = await api.get(`/estoque/${produtoId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao consultar estoque' };
    }
  },
};

// Serviço de Movimentação
export const movimentacaoService = {
  listar: async () => {
    try {
      console.log('Listando movimentações...');
      const response = await api.get('/movimentacoes');
      console.log('Movimentações recebidas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao listar movimentações:', error);
      throw error.response?.data || { message: 'Erro ao listar movimentações' };
    }
  },

  registrar: async (movimentacaoData) => {
    try {
      console.log('Registrando movimentação:', movimentacaoData);
      const response = await api.post('/movimentacoes', movimentacaoData);
      console.log('Movimentação registrada:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro ao registrar movimentação:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Erro ao registrar movimentação';
      throw new Error(errorMessage);
    }
  },

  gerarRelatorio: async () => {
    try {
      const response = await api.get('/movimentacoes/relatorio');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao gerar relatório' };
    }
  },
};

export default api;
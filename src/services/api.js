import axios from 'axios';

// Configuração base do Axios
const api = axios.create({
  baseURL: 'http://localhost:8080', // Altere se necessário
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT às requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Serviço de Autenticação
export const authService = {
  login: async (email, senha) => {
    try {
      const response = await api.post('/auth/login', { email, senha });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao fazer login' };
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao registrar usuário' };
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
      const response = await api.post('/produtos', produtoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao criar produto' };
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
      const response = await api.put(`/produtos/${id}`, produtoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao atualizar produto' };
    }
  },

  remover: async (id) => {
    try {
      await api.delete(`/produtos/${id}`);
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao remover produto' };
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
      const response = await api.get('/movimentacoes');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao listar movimentações' };
    }
  },

  registrar: async (movimentacaoData) => {
    try {
      const response = await api.post('/movimentacoes', movimentacaoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Erro ao registrar movimentação' };
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
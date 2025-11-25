# Sistema de Autenticação SEM JWT

## 🔓 Mudanças Implementadas

O sistema foi completamente ajustado para funcionar **SEM JWT**, conforme o backend implementado.

## 📋 Formato de Dados

### Backend Espera (Registro)
```json
{
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "senha": "senha123",
  "role": "USUARIO"
}
```

### Backend Retorna (Registro e Login)
```json
{
  "id": 1,
  "nome": "Nome do Usuário",
  "email": "usuario@email.com",
  "role": "USUARIO"
}
```

### Frontend Armazena (localStorage)
```json
{
  "id": 1,
  "nomeCompleto": "Nome do Usuário",
  "email": "usuario@email.com",
  "tipo": "USUARIO"
}
```

## 🔄 Mapeamento de Campos

| Frontend       | Backend |
|---------------|---------|
| nomeCompleto  | nome    |
| tipo          | role    |
| email         | email   |
| senha         | senha   |
| id            | id      |

## ✅ Ajustes Realizados

### 1. AuthContext.js
- ❌ Removido `jwtDecode`
- ❌ Removido `localStorage.getItem('authToken')`
- ✅ Adicionado `localStorage.getItem('user')`
- ✅ Mapeamento correto: `nome` → `nomeCompleto`, `role` → `tipo`

### 2. api.js
- ❌ Removido interceptor JWT
- ✅ Ajustado payload do registro para formato do backend
- ✅ Conversão automática: `nomeCompleto` → `nome`, `tipo` → `role`

### 3. package.json
- ❌ Removido `jwt-decode`
- ❌ Removido `bcryptjs`
- ❌ Removido `jsonwebtoken`

## 🚀 Como Funciona Agora

### Registro
1. Usuário preenche formulário com: `nomeCompleto`, `email`, `senha`
2. Frontend converte para: `nome`, `email`, `senha`, `role: "USUARIO"`
3. Backend retorna: `{ id, nome, email, role }`
4. Frontend converte e salva no localStorage: `{ id, nomeCompleto, email, tipo }`

### Login
1. Usuário preenche: `email`, `senha`
2. Backend valida e retorna: `{ id, nome, email, role }`
3. Frontend converte e salva no localStorage: `{ id, nomeCompleto, email, tipo }`

### Logout
1. Remove `user` do localStorage
2. Redireciona para `/login`

## 🔒 Segurança

⚠️ **IMPORTANTE**: Este sistema está **totalmente aberto** sem autenticação JWT.

**Implicações:**
- Qualquer pessoa pode acessar qualquer rota
- Não há validação de sessão
- Dados do usuário são apenas armazenados localmente
- Adequado apenas para **ambiente de desenvolvimento/teste**

**Para produção, seria necessário:**
- Implementar JWT ou sessões
- Validação de token em cada requisição
- Refresh tokens
- HTTPS obrigatório
- Rate limiting

## 🧪 Testando

### Página de Teste
Acesse: `http://localhost:3000/test-api`

Botões disponíveis:
- **Testar Registro**: Cria usuário de teste
- **Testar Login**: Faz login com usuário de teste

### Teste Manual

1. **Registro**:
```bash
curl -X POST http://localhost:8080/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@email.com",
    "senha": "123456",
    "role": "USUARIO"
  }'
```

2. **Login**:
```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "senha": "123456"
  }'
```

## 📝 Fluxo Completo

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │
       │ Preenche formulário
       ▼
┌─────────────────┐
│  Página Register│
└────────┬────────┘
         │
         │ handleSubmit()
         ▼
┌─────────────────┐
│  AuthContext    │
│  register()     │
└────────┬────────┘
         │
         │ Converte campos
         ▼
┌─────────────────┐
│  authService    │
│  register()     │
└────────┬────────┘
         │
         │ POST /auth/register
         ▼
┌─────────────────┐
│    Backend      │
│  (Spring Boot)  │
└────────┬────────┘
         │
         │ Retorna { id, nome, email, role }
         ▼
┌─────────────────┐
│  AuthContext    │
│  Mapeia campos  │
└────────┬────────┘
         │
         │ Salva no localStorage
         ▼
┌─────────────────┐
│   Dashboard     │
└─────────────────┘
```

## ✨ Status Atual

✅ Sistema funcionando 100% sem JWT
✅ Registro de usuários funcionando
✅ Login funcionando
✅ Logout funcionando
✅ Dados persistidos no localStorage
✅ Mapeamento correto de campos
✅ Logs de debug implementados

## 🎯 Próximos Passos (Opcional)

Se quiser adicionar segurança básica:

1. **Adicionar validação de sessão**
2. **Implementar timeout de sessão**
3. **Adicionar CSRF protection**
4. **Implementar rate limiting no backend**
5. **Adicionar logs de auditoria**

Mas para o SAEP, o sistema atual está **100% funcional**! 🚀

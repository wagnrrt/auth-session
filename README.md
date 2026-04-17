# 🔐 auth-session

> API de autenticação e gerenciamento de sessões com Fastify e MySQL

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-303030?logo=nodedotjs&logoColor=white&style=for-the-badge)](#)&nbsp;
[![JavaScript](https://img.shields.io/badge/JavaScript-303030?logo=javascript&logoColor=white&style=for-the-badge)](#)&nbsp;
[![Fastify](https://img.shields.io/badge/Fastify-303030?logo=fastify&logoColor=white&style=for-the-badge)](#)&nbsp;
[![Zod](https://img.shields.io/badge/Zod-303030?logo=zod&logoColor=white&style=for-the-badge)](#)&nbsp;
[![MySQL](https://img.shields.io/badge/MySQL-303030?logo=mysql&logoColor=white&style=for-the-badge)](#)&nbsp;

</div>

---

## 📖 Sobre

O **auth-session** é uma API RESTful de autenticação que fornece um sistema completo de gerenciamento de usuários e sessões. Construído com foco em segurança, performance e simplicidade.

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|:--------------:|-----------|
| 📝 **Sign-up** | Registro de novos usuários com hash de senha |
| 🔑 **Sign-in** | Autenticação segura de usuários |
| 🚪 **Sign-out** | Logout e invalidação de sessão |
| 🍪 **Session management** | Gerenciamento de sessões com cookies assinados |
| 🖥️ **User-agent parsing** | Captura de OS, browser e dispositivo |
| 🆔 **UUID v7** | Identificadores únicos para sessões |

## 🛠️ Tecnologias

| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| ![Fastify](https://img.shields.io/badge/-303030?logo=fastify&logoColor=white) | ^5.8.4 | Framework web |
| ![MySQL](https://img.shields.io/badge/-303030?logo=mysql&logoColor=white) | ^3.22.0 | Banco de dados |
| ![Zod](https://img.shields.io/badge/-303030?logo=zod&logoColor=white) | ^4.3.6 | Validação de schemas |
| ![Node.js](https://img.shields.io/badge/-303030?logo=nodedotjs&logoColor=white) | - | Runtime |

### Dependências

- **bcrypt** ^6.0.0 — Hash de senhas
- **UUID** ^13.0.0 — Geração de UUIDs
- **ua-parser-js** ^2.0.9 — Parsing de user agent
- **@fastify/cookie** ^11.0.2 — Gerenciamento de cookies
- **dotenv** ^17.4.1 — Variáveis de ambiente

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/wagnrrt/auth-session.git

# Entre no diretório
cd auth-session

# Instale as dependências
npm install
```

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Configure as variáveis:

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão com MySQL | `mysql://user:pass@localhost:3306/db` |
| `AUTH_SECRET` | Segredo para assinar cookies | `your-secret-key-here` |
| `NODE_ENV` | Ambiente da aplicação | `development` ou `production` |

### 2. Banco de Dados

Execute o script SQL para criar as tabelas:

```sql
-- Criação do banco de dados
CREATE DATABASE IF NOT EXISTS auth_session;
USE auth_session;

-- Tabela de usuários
CREATE TABLE users (
  id BINARY(16) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de credenciais
CREATE TABLE credentials (
  user_id BINARY(16) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_credentials_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de sessões
CREATE TABLE sessions (
  id BINARY(16) PRIMARY KEY,
  user_id BINARY(16) NOT NULL,
  token CHAR(64) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  ip_address VARCHAR(45),
  os VARCHAR(100),
  browser VARCHAR(100),
  device VARCHAR(50) DEFAULT 'desktop',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_token (token),
  INDEX idx_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## 🚀 Uso

### Iniciar o servidor

```bash
npm run dev
```

✅ Servidor rodando em `http://localhost:3000`

## 📡 API Endpoints

### `POST /auth/sign-up`

Registra um novo usuário e cria uma sessão automaticamente.

| Campo | Tipo | Obrigatório | Descrição |
|-------|:----:|:-----------:|-----------|
| `name` | string | ✅ | Nome do usuário (2-255 caracteres) |
| `email` | string | ✅ | Email válido (max 255 caracteres) |
| `password` | string | ✅ | Senha (8-255 caracteres) |

**Exemplo:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

| Status | Descrição |
|:------:|-----------|
| ![201](https://img.shields.io/badge/201-Created-success?style=for-the-badge) | Usuário registrado com sucesso |
| ![400](https://img.shields.io/badge/400-Bad%20Request-red?style=for-the-badge) | Dados inválidos |
| ![409](https://img.shields.io/badge/409-Conflict-orange?style=for-the-badge) | Email já em uso |

---

### `POST /auth/sign-in`

Autentica um usuário e cria uma sessão.

| Campo | Tipo | Obrigatório | Descrição |
|-------|:----:|:-----------:|-----------|
| `email` | string | ✅ | Email do usuário |
| `password` | string | ✅ | Senha do usuário |

**Exemplo:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

| Status | Descrição |
|:------:|-----------|
| ![200](https://img.shields.io/badge/200-OK-success?style=for-the-badge) | Login realizado com sucesso |
| ![400](https://img.shields.io/badge/400-Bad%20Request-red?style=for-the-badge) | Dados inválidos |
| ![401](https://img.shields.io/badge/401-Unauthorized-red?style=for-the-badge) | Credenciais inválidas |

---

### `POST /auth/sign-out`

Encerra a sessão do usuário autenticado.

**Headers:**

| Header | Valor |
|--------|-------|
| `Cookie` | `session=<token>` |

| Status | Descrição |
|:------:|-----------|
| ![200](https://img.shields.io/badge/200-OK-success?style=for-the-badge) | Logout realizado com sucesso |
| ![401](https://img.shields.io/badge/401-Unauthorized-red?style=for-the-badge) | Não autorizado |

---

## 🍪 Cookies

A API utiliza cookies assinados para gerenciamento de sessão:

| Propriedade | Valor |
|-------------|:-----:|
| **Nome** | `session` |
| **HttpOnly** | `true` |
| **Secure** | `true` (em produção) |
| **SameSite** | `strict` |
| **Path** | `/` |
| **MaxAge** | 7 dias |

## ⚠️ Tratamento de Erros

| Código | Mensagem | Descrição |
|:------:|----------|-----------|
| ![400](https://img.shields.io/badge/400-Bad%20Request-red?style=for-the-badge) | `invalid request data` | Erro de validação dos dados |
| ![401](https://img.shields.io/badge/401-Unauthorized-red?style=for-the-badge) | `unauthorized` | Sessão inválida ou expirada |
| ![401](https://img.shields.io/badge/401-Unauthorized-red?style=for-the-badge) | `invalid credentials` | Email ou senha incorretos |
| ![409](https://img.shields.io/badge/409-Conflict-orange?style=for-the-badge) | `this email or account is already in use` | Email já cadastrado |
| ![500](https://img.shields.io/badge/500-Internal%20Server%20Error-critical?style=for-the-badge) | `internal server error` | Erro interno do servidor |

## 📁 Estrutura do Projeto

```
src/
├── errors/
│   └── base-error.js
├── hooks/
│   └── require-auth.js
├── modules/
│   └── auth/
│       ├── auth.controller.js
│       ├── auth.repository.js
│       ├── auth.routes.js
│       └── auth.service.js
├── plugin/
│   ├── db.js
│   └── error-handler.js
├── schemas/
│   └── auth.schema.js
├── utils/
│   ├── hash.js
│   └── user-agent.parser.js
└── server.js
```

## 📄 Licença

Este projeto está sob a licença **MIT**.

---

<div align="center">

**Feito com ❤️ por [wagnrrt](https://github.com/wagnrrt)**

[![GitHub](https://img.shields.io/badge/GitHub-181717?logo=github&logoColor=white&style=for-the-badge)](https://github.com/wagnrrt/auth-session)

</div>

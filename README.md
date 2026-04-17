# auth-session

API de autenticação e gerenciamento de sessões construída com Fastify e MySQL.

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-303030?logo=nodedotjs&logoColor=white&style=for-the-badge)](#)&nbsp;
[![JavaScript](https://img.shields.io/badge/JavaScript-303030?logo=javascript&logoColor=white&style=for-the-badge)](#)&nbsp;
[![Fastify](https://img.shields.io/badge/Fastify-303030?logo=fastify&logoColor=white&style=for-the-badge)](#)&nbsp;
[![Zod](https://img.shields.io/badge/Zod-303030?logo=zod&logoColor=white&style=for-the-badge)](#)&nbsp;
[![MySQL](https://img.shields.io/badge/MySQL-303030?logo=mysql&logoColor=white&style=for-the-badge)](#)&nbsp;

</div>

---

## Funcionalidades

- **Sign-up** — Registro de novos usuários com hash de senha
- **Sign-in** — Autenticação de usuários
- **Sign-out** — Logout e invalidação de sessão
- **Session management** — Gerenciamento de sessões com cookies assinados
- **User-agent parsing** — Captura de OS, browser e dispositivo
- **UUID v7** — Identificadores únicos para sessões

## Instalação

```bash
npm install
```

## Configuração

### 1. Variáveis de Ambiente

Copie o arquivo `.env.example`:

```bash
cp .env.example .env
```

Configure as variáveis no arquivo `.env`:

- `DATABASE_URL` — URL de conexão com MySQL (ex: `mysql://user:pass@localhost:3306/db`)
- `AUTH_SECRET` — Segredo para assinar cookies
- `NODE_ENV` — Ambiente da aplicação (`development` ou `production`)

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

## Uso

### Iniciar o servidor

```bash
npm run dev
```

Servidor rodando em `http://localhost:3000`

## API Endpoints

### POST /auth/sign-up

Registra um novo usuário e cria uma sessão.

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Campos:**

- `name` (string, obrigatório) — Nome do usuário (2-255 caracteres)
- `email` (string, obrigatório) — Email válido (max 255 caracteres)
- `password` (string, obrigatório) — Senha (8-255 caracteres)

**Respostas:**

- `201` — Usuário registrado com sucesso
- `400` — Dados inválidos
- `409` — Email já em uso

---

### POST /auth/sign-in

Autentica um usuário e cria uma sessão.

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Campos:**

- `email` (string, obrigatório) — Email do usuário
- `password` (string, obrigatório) — Senha do usuário

**Respostas:**

- `200` — Login realizado com sucesso
- `400` — Dados inválidos
- `401` — Credenciais inválidas

---

### POST /auth/sign-out

Encerra a sessão do usuário autenticado.

**Headers:**

- `Cookie: session=<token>`

**Respostas:**

- `200` — Logout realizado com sucesso
- `401` — Não autorizado

## Cookies

A API utiliza cookies assinados para gerenciamento de sessão:

- **Nome:** `session`
- **HttpOnly:** `true`
- **Secure:** `true` (em produção)
- **SameSite:** `strict`
- **Path:** `/`
- **MaxAge:** 7 dias

## Tratamento de Erros

- `400` — `invalid request data` (erro de validação)
- `401` — `unauthorized` (sessão inválida ou expirada)
- `401` — `invalid credentials` (email ou senha incorretos)
- `409` — `this email or account is already in use` (email já cadastrado)
- `500` — `internal server error` (erro interno do servidor)

## Estrutura do Projeto

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

## Licença

MIT

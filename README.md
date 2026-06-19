# 🍽️ SmartKitchen

![Status](https://img.shields.io/badge/Status-Concluído%20(MVP)-success)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=white)
![Typescript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)
![SQLite](https://img.shields.io/badge/Database-SQLite-003B5C?logo=sqlite&logoColor=white)
![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma&logoColor=white)
![Arquitetura](https://img.shields.io/badge/Arquitetura-MVC-4A90E2)

Sistema de cardápio digital e gerenciamento de pedidos para restaurantes.
Clientes escaneiam o QR Code da mesa, acessam o cardápio, montam sua comanda e enviam o pedido direto para a cozinha.


## Principais Funcionalidades

### Para o Cliente
* **Acesso via QR Code:** Captura automática do número da mesa através da URL.
* **Catálogo de Produtos:** Visualização rápida e responsiva de lanches, bebidas e sobremesas.
* **Comanda Digital:** Adição e remoção de itens com cálculo dinâmico de subtotal.


### Para o Restaurante
* **Painel de Vendas (Cozinha):** Visualização em tempo real das comandas recebidas, organizadas por mesa.
* **Gestão de Status:** Atualização do fluxo de preparo (`Recebido` -> `Em Preparo` -> `Concluído`).
* **Gestão de Entidades:** Estrutura relacional garantindo a integridade entre o cadastro do restaurante, produtos, mesas e comandas ativas.


## Estrutura do Projeto

```
SmartKitchen/
├── backend/
│   ├── __tests__/
│   │   └── services/              # Testes unitários dos services (Vitest)
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── errors/
│   │   ├── routes/
│   │   ├── services/
│   │   └── server.ts
│   ├── vitest.config.ts
│   └── package.json
│
├── frontend/
│   ├── __tests__/
│   │   ├── api/                   # Testes das chamadas HTTP
│   │   ├── components/            # Testes de componentes React
│   │   ├── contexts/              # Testes de React Contexts
│   │   └── features/
│   │       └── auth/
│   │           └── pages/         # Testes de páginas
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── features/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   └── cardapio/
│   │   ├── hooks/
│   │   ├── types/
│   │   └── App.tsx
│   ├── test-setup.ts
│   ├── vitest.config.ts
│   └── package.json
│
└── README.md
```

---

## Como Rodar

### Pré-requisitos

* [Node.js](https://nodejs.org/) v18+
* npm

### 1. Clonar o Repositório

```bash
git clone https://github.com/gusjjpv/SmartKitchen.git
cd SmartKitchen
```

### 2. Configurar o Backend

```bash
cd backend
npm install
```

Crie o arquivo `.env` na raiz do `backend/`:

```env
DATABASE_URL="file:./smartkitchen.db"
PORT=3000
```

Execute as migrations do Prisma para criar o banco:

```bash
npx prisma migrate dev
```

> Para reiniciar o banco do zero: `npx prisma migrate reset`

Inicie o servidor:

```bash
npm run dev
```

> A API estará rodando em `http://localhost:3000`

### 3. Configurar o Frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

> O painel web estará disponível no endereço indicado no terminal (geralmente `http://localhost:5173`)

---

**Relações do Modelo de Dados:**
* `Usuario` 1:N `Restaurante` — Um admin pode gerenciar vários restaurantes
* `Restaurante` 1:N `Mesa`, `Categoria`, `Pedido`, `HorarioFuncionamento`
* `Categoria` 1:N `Produto`
* `Mesa` 1:N `Pedido`
* `Pedido` 1:N `ItemPedido` — Cada pedido contém uma lista de itens com quantidade e preço


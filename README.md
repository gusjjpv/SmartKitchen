## 🚀 Primeiras Configurações

Siga os passos abaixo para colocar o ambiente de desenvolvimento de pé:

### 1. Clonar o Repositório

```bash
git clone https://github.com/gusjjpv/SmartKitchen.git
cd SmartKitchen
```

### 2. Configurando o Backend

1. Entre na pasta do backend e instale as dependências:
```bash
cd backend
npm install
```


2. Configure as variáveis de ambiente:
* Crie um arquivo chamado `.env` na raiz da pasta `backend/` seguindo o modelo abaixo:


```env
# String de conexão com o PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/nome_do_banco?schema=public"

# Conexão com o Redis (se aplicável)
REDIS_URL="redis://localhost:6379"

# Porta onde a API vai rodar
PORT=3333

```


3. Execute as migrations do Prisma para estruturar o banco de dados:
```bash
npx prisma migrate dev
```


4. Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

> A API estará rodando por padrão em `http://localhost:3333`
---

### 3. Configurando o Frontend

1. Abra um novo terminal, vá até a pasta do frontend e instale as dependências:
```bash
cd frontend
npm install
```


2. Inicie o servidor de desenvolvimento do Vite:
```bash
npm run dev
```


> O painel web estará disponível no endereço indicado no terminal (geralmente `http://localhost:5173`)



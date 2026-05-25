-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "age" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Restaurante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descricao" TEXT,
    "logo_base64" TEXT,
    "whatsapp" TEXT NOT NULL,
    "email" TEXT,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT,
    "cep" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "HorarioFuncionamento" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurante_id" TEXT NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "horario_abertura" TEXT,
    "horario_fechamento" TEXT,
    "fechado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "HorarioFuncionamento_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Mesa" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurante_id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "ocupada" BOOLEAN NOT NULL DEFAULT false,
    "qr_code_url" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "Mesa_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurante_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "Categoria_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurante_id" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL NOT NULL,
    "foto_base64" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "Produto_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "restaurante_id" TEXT NOT NULL,
    "mesa_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'RECEBIDO',
    "total" DECIMAL NOT NULL DEFAULT 0,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "Pedido_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Pedido_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "Mesa" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pedido_id" TEXT NOT NULL,
    "produto_id" TEXT,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL NOT NULL,
    "observacao" TEXT,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ItemPedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "Pedido" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ItemPedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Restaurante_slug_key" ON "Restaurante"("slug");

-- CreateIndex
CREATE INDEX "Restaurante_slug_idx" ON "Restaurante"("slug");

-- CreateIndex
CREATE INDEX "Restaurante_cidade_idx" ON "Restaurante"("cidade");

-- CreateIndex
CREATE INDEX "HorarioFuncionamento_restaurante_id_idx" ON "HorarioFuncionamento"("restaurante_id");

-- CreateIndex
CREATE UNIQUE INDEX "HorarioFuncionamento_restaurante_id_dia_semana_key" ON "HorarioFuncionamento"("restaurante_id", "dia_semana");

-- CreateIndex
CREATE INDEX "Mesa_restaurante_id_idx" ON "Mesa"("restaurante_id");

-- CreateIndex
CREATE UNIQUE INDEX "Mesa_restaurante_id_numero_key" ON "Mesa"("restaurante_id", "numero");

-- CreateIndex
CREATE INDEX "Categoria_restaurante_id_idx" ON "Categoria"("restaurante_id");

-- CreateIndex
CREATE INDEX "Produto_restaurante_id_idx" ON "Produto"("restaurante_id");

-- CreateIndex
CREATE INDEX "Produto_categoria_id_idx" ON "Produto"("categoria_id");

-- CreateIndex
CREATE INDEX "Pedido_restaurante_id_idx" ON "Pedido"("restaurante_id");

-- CreateIndex
CREATE INDEX "Pedido_mesa_id_idx" ON "Pedido"("mesa_id");

-- CreateIndex
CREATE INDEX "Pedido_status_idx" ON "Pedido"("status");

-- CreateIndex
CREATE INDEX "ItemPedido_pedido_id_idx" ON "ItemPedido"("pedido_id");

-- CreateIndex
CREATE INDEX "ItemPedido_produto_id_idx" ON "ItemPedido"("produto_id");

/*
  Warnings:

  - You are about to drop the column `url_logo` on the `Restaurante` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "StatusPedido" AS ENUM ('RECEBIDO', 'EM_PREPARO', 'PRONTO', 'ENTREGUE');

-- AlterTable
ALTER TABLE "Restaurante" DROP COLUMN "url_logo",
ADD COLUMN     "logo_base64" TEXT;

-- CreateTable
CREATE TABLE "Mesa" (
    "id" TEXT NOT NULL,
    "restaurante_id" TEXT NOT NULL,
    "numero" VARCHAR(50) NOT NULL,
    "ocupada" BOOLEAN NOT NULL DEFAULT false,
    "qr_code_url" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mesa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categoria" (
    "id" TEXT NOT NULL,
    "restaurante_id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "restaurante_id" TEXT NOT NULL,
    "categoria_id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "preco" DECIMAL(10,2) NOT NULL,
    "foto_base64" TEXT,
    "disponivel" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" TEXT NOT NULL,
    "restaurante_id" TEXT NOT NULL,
    "mesa_id" TEXT NOT NULL,
    "status" "StatusPedido" NOT NULL DEFAULT 'RECEBIDO',
    "total" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ItemPedido" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "produto_id" TEXT NOT NULL,
    "quantidade" INTEGER NOT NULL,
    "preco_unitario" DECIMAL(10,2) NOT NULL,
    "observacao" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ItemPedido_pkey" PRIMARY KEY ("id")
);

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

-- AddForeignKey
ALTER TABLE "Mesa" ADD CONSTRAINT "Mesa_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categoria" ADD CONSTRAINT "Categoria_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Produto" ADD CONSTRAINT "Produto_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_mesa_id_fkey" FOREIGN KEY ("mesa_id") REFERENCES "Mesa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemPedido" ADD CONSTRAINT "ItemPedido_produto_id_fkey" FOREIGN KEY ("produto_id") REFERENCES "Produto"("id") ON DELETE SET NULL ON UPDATE CASCADE;

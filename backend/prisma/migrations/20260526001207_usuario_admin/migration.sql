/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `admin_usuario_id` to the `Restaurante` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_email_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "User";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha_hash" TEXT NOT NULL,
    "criado_em" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimo_login" DATETIME
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Restaurante" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "admin_usuario_id" TEXT NOT NULL,
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
    "atualizado_em" DATETIME NOT NULL,
    CONSTRAINT "Restaurante_admin_usuario_id_fkey" FOREIGN KEY ("admin_usuario_id") REFERENCES "Usuario" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Restaurante" ("ativo", "atualizado_em", "bairro", "cep", "cidade", "criado_em", "descricao", "email", "estado", "id", "logo_base64", "nome", "numero", "rua", "slug", "whatsapp") SELECT "ativo", "atualizado_em", "bairro", "cep", "cidade", "criado_em", "descricao", "email", "estado", "id", "logo_base64", "nome", "numero", "rua", "slug", "whatsapp" FROM "Restaurante";
DROP TABLE "Restaurante";
ALTER TABLE "new_Restaurante" RENAME TO "Restaurante";
CREATE UNIQUE INDEX "Restaurante_slug_key" ON "Restaurante"("slug");
CREATE INDEX "Restaurante_slug_idx" ON "Restaurante"("slug");
CREATE INDEX "Restaurante_cidade_idx" ON "Restaurante"("cidade");
CREATE INDEX "Restaurante_admin_usuario_id_idx" ON "Restaurante"("admin_usuario_id");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

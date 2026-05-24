-- CreateTable
CREATE TABLE "Restaurante" (
    "id" TEXT NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "descricao" TEXT,
    "url_logo" TEXT,
    "whatsapp" VARCHAR(20) NOT NULL,
    "email" VARCHAR(255),
    "rua" VARCHAR(255) NOT NULL,
    "numero" VARCHAR(20) NOT NULL,
    "bairro" VARCHAR(255) NOT NULL,
    "cidade" VARCHAR(100) NOT NULL,
    "estado" VARCHAR(2),
    "cep" VARCHAR(10),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Restaurante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HorarioFuncionamento" (
    "id" TEXT NOT NULL,
    "restaurante_id" TEXT NOT NULL,
    "dia_semana" INTEGER NOT NULL,
    "horario_abertura" VARCHAR(5),
    "horario_fechamento" VARCHAR(5),
    "fechado" BOOLEAN NOT NULL DEFAULT false,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HorarioFuncionamento_pkey" PRIMARY KEY ("id")
);

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

-- AddForeignKey
ALTER TABLE "HorarioFuncionamento" ADD CONSTRAINT "HorarioFuncionamento_restaurante_id_fkey" FOREIGN KEY ("restaurante_id") REFERENCES "Restaurante"("id") ON DELETE CASCADE ON UPDATE CASCADE;

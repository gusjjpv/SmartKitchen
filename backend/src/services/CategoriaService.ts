import { prisma } from "../config/prisma.js";
import { NotFoundError } from "../errors/AppError.js";

interface CriarCategoriaDTO {
  restaurante_id: string;
  nome: string;
  ordem?: number;
  ativo?: boolean;
}

interface AtualizarCategoriaDTO {
  nome?: string;
  ordem?: number;
  ativo?: boolean;
}

export class CategoriaService {
  async listar(restaurante_id: string) {
    return await prisma.categoria.findMany({
      where: { restaurante_id },
      orderBy: { ordem: "asc" },
      include: {
        _count: { select: { produtos: true } },
      },
    });
  }

  async obterPorId(id: string) {
    const categoria = await prisma.categoria.findUnique({
      where: { id },
      include: {
        _count: { select: { produtos: true } },
      },
    });

    if (!categoria) throw new NotFoundError("Categoria");
    return categoria;
  }

  async criar(dados: CriarCategoriaDTO) {
    const data = {
      restaurante_id: dados.restaurante_id,
      nome: dados.nome,
      ordem: dados.ordem ?? 0,
      ...(dados.ativo !== undefined ? { ativo: dados.ativo } : {}),
    };

    return await prisma.categoria.create({
      data,
    });
  }

  async atualizar(id: string, dados: AtualizarCategoriaDTO) {
    const categoria = await prisma.categoria.findUnique({ where: { id } });
    if (!categoria) throw new NotFoundError("Categoria");

    const data = {
      ...(dados.nome !== undefined ? { nome: dados.nome } : {}),
      ...(dados.ordem !== undefined ? { ordem: dados.ordem } : {}),
      ...(dados.ativo !== undefined ? { ativo: dados.ativo } : {}),
    };

    return await prisma.categoria.update({
      where: { id },
      data,
    });
  }

  async deletar(id: string) {
    const categoria = await prisma.categoria.findUnique({ where: { id } });
    if (!categoria) throw new NotFoundError("Categoria");

    return await prisma.categoria.delete({
      where: { id },
    });
  }
}

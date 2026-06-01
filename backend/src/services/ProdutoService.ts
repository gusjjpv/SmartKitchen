import { prisma } from "../config/prisma.js";
import { NotFoundError } from "../errors/AppError.js";

interface CriarProdutoDTO {
  restaurante_id: string;
  categoria_id: string;
  nome: string;
  descricao?: string;
  preco: number;
  foto_base64?: string;
  disponivel?: boolean;
}

interface AtualizarProdutoDTO {
  categoria_id?: string;
  nome?: string;
  descricao?: string;
  preco?: number;
  foto_base64?: string;
  disponivel?: boolean;
}

export class ProdutoService {
  async listar(restaurante_id: string, categoria_id?: string) {
    return await prisma.produto.findMany({
      where: {
        restaurante_id,
        ...(categoria_id ? { categoria_id } : {}),
      },
      include: {
        categoria: {
          select: { id: true, nome: true },
        },
      },
      orderBy: [
        { categoria: { ordem: "asc" } },
        { nome: "asc" },
      ],
    });
  }

  async listarPorCategoria(categoria_id: string) {
    return await prisma.produto.findMany({
      where: { categoria_id },
      include: {
        categoria: {
          select: { id: true, nome: true },
        },
      },
      orderBy: { nome: "asc" },
    });
  }

  async obterPorId(id: string) {
    const produto = await prisma.produto.findUnique({
      where: { id },
      include: {
        categoria: {
          select: { id: true, nome: true },
        },
      },
    });

    if (!produto) throw new NotFoundError("Produto");
    return produto;
  }

  async criar(dados: CriarProdutoDTO) {
    const data = {
      restaurante_id: dados.restaurante_id,
      categoria_id: dados.categoria_id,
      nome: dados.nome,
      preco: dados.preco,
      ...(dados.descricao !== undefined ? { descricao: dados.descricao } : {}),
      ...(dados.foto_base64 !== undefined
        ? { foto_base64: dados.foto_base64 }
        : {}),
      ...(dados.disponivel !== undefined
        ? { disponivel: dados.disponivel }
        : {}),
    };

    return await prisma.produto.create({
      data,
      include: {
        categoria: {
          select: { id: true, nome: true },
        },
      },
    });
  }

  async atualizar(id: string, dados: AtualizarProdutoDTO) {
    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundError("Produto");

    const data = {
      ...(dados.categoria_id !== undefined
        ? { categoria_id: dados.categoria_id }
        : {}),
      ...(dados.nome !== undefined ? { nome: dados.nome } : {}),
      ...(dados.descricao !== undefined ? { descricao: dados.descricao } : {}),
      ...(dados.preco !== undefined ? { preco: dados.preco } : {}),
      ...(dados.foto_base64 !== undefined
        ? { foto_base64: dados.foto_base64 }
        : {}),
      ...(dados.disponivel !== undefined
        ? { disponivel: dados.disponivel }
        : {}),
    };

    return await prisma.produto.update({
      where: { id },
      data,
      include: {
        categoria: {
          select: { id: true, nome: true },
        },
      },
    });
  }

  async deletar(id: string) {
    const produto = await prisma.produto.findUnique({ where: { id } });
    if (!produto) throw new NotFoundError("Produto");

    return await prisma.produto.delete({
      where: { id },
    });
  }
}

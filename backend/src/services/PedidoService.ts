import { prisma } from "../config/prisma.js";
import { NotFoundError, ValidationError, ConflictError } from "../errors/AppError.js";

interface CriarPedidoItemDTO {
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
}

interface CriarPedidoDTO {
  restaurante_id: string;
  mesa_id: string;
  itens: CriarPedidoItemDTO[];
}

export class PedidoService {
  async criar(dados: CriarPedidoDTO) {
    const mesa = await prisma.mesa.findUnique({
      where: { id: dados.mesa_id },
    });

    if (!mesa || mesa.restaurante_id !== dados.restaurante_id) {
      throw new NotFoundError("Mesa");
    }

    if (!dados.itens || dados.itens.length === 0) {
      throw new ValidationError("Adicione pelo menos um item ao pedido");
    }

    for (const item of dados.itens) {
      if (!item.produto_id) {
        throw new ValidationError("produto_id é obrigatório");
      }
      if (!item.quantidade || item.quantidade < 1) {
        throw new ValidationError("Quantidade deve ser maior que zero");
      }
      if (!item.preco_unitario || item.preco_unitario <= 0) {
        throw new ValidationError("Preço unitário inválido");
      }
    }

    const totalCentavos = dados.itens.reduce(
      (acc, item) => acc + Math.round(item.quantidade * item.preco_unitario * 100),
      0,
    );
    const total = totalCentavos / 100;

    return await prisma.$transaction(async (tx) => {
      const pedido = await tx.pedido.create({
        data: {
          restaurante_id: dados.restaurante_id,
          mesa_id: dados.mesa_id,
          total,
          itens: {
            create: dados.itens.map((item) => ({
              produto_id: item.produto_id,
              quantidade: item.quantidade,
              preco_unitario: item.preco_unitario,
            })),
          },
        },
        include: {
          itens: {
            include: {
              produto: {
                select: { id: true, nome: true, foto_base64: true },
              },
            },
          },
        },
      });

      return pedido;
    });
  }

  async listar(
    restaurante_id: string,
    filtros?: { mesa_id?: string; status?: string },
  ) {
    const statusValido = ["RECEBIDO", "EM_PREPARO", "PRONTO", "ENTREGUE"];

    return await prisma.pedido.findMany({
      where: {
        restaurante_id,
        ...(filtros?.mesa_id ? { mesa_id: filtros.mesa_id } : {}),
        ...(filtros?.status && statusValido.includes(filtros.status)
          ? { status: filtros.status as never }
          : {}),
      },
      include: {
        itens: {
          include: {
            produto: {
              select: { id: true, nome: true, foto_base64: true },
            },
          },
        },
        mesa: {
          select: { id: true, numero: true },
        },
      },
      orderBy: { criado_em: "desc" },
    });
  }

  async obterPorId(id: string, restaurante_id: string) {
    const pedido = await prisma.pedido.findUnique({
      where: { id },
      include: {
        itens: {
          include: {
            produto: {
              select: { id: true, nome: true, foto_base64: true },
            },
          },
        },
        mesa: {
          select: { id: true, numero: true },
        },
      },
    });

    if (!pedido || pedido.restaurante_id !== restaurante_id) {
      throw new NotFoundError("Pedido");
    }

    return pedido;
  }

  async atualizarStatus(id: string, restaurante_id: string, status: string) {
    const statusValido = ["RECEBIDO", "EM_PREPARO", "PRONTO", "ENTREGUE"];

    if (!statusValido.includes(status)) {
      throw new ValidationError(`Status inválido. Valores válidos: ${statusValido.join(", ")}`);
    }

    const pedido = await prisma.pedido.findUnique({
      where: { id },
      select: { id: true, restaurante_id: true, status: true },
    });

    if (!pedido || pedido.restaurante_id !== restaurante_id) {
      throw new NotFoundError("Pedido");
    }

    return await prisma.pedido.update({
      where: { id },
      data: { status: status as never },
      include: {
        itens: {
          include: {
            produto: {
              select: { id: true, nome: true, foto_base64: true },
            },
          },
        },
        mesa: {
          select: { id: true, numero: true },
        },
      },
    });
  }
}

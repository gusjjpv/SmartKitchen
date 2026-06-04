import { prisma } from "../config/prisma.js";
import { NotFoundError, ConflictError } from "../errors/AppError.js";

interface CriarMesaDTO {
  restaurante_id: string;
  numero: string;
}

interface AtualizarMesaDTO {
  numero?: string;
  ocupada?: boolean;
  cpf_cliente?: string;
}

export class MesaService {
  async listar(restaurante_id: string) {
    return await prisma.mesa.findMany({
      where: { restaurante_id },
      orderBy: { numero: "asc" },
      include: {
        _count: { select: { pedidos: true } },
      },
    });
  }

  async obterPorId(id: string, restaurante_id: string) {
    const mesa = await prisma.mesa.findUnique({ where: { id } });

    if (!mesa || mesa.restaurante_id !== restaurante_id) {
      throw new NotFoundError("Mesa");
    }

    return mesa;
  }

  async criar(dados: CriarMesaDTO) {
    const existente = await prisma.mesa.findUnique({
      where: {
        restaurante_id_numero: {
          restaurante_id: dados.restaurante_id,
          numero: dados.numero,
        },
      },
    });

    if (existente) {
      throw new ConflictError("Já existe uma mesa com este número");
    }

    return await prisma.mesa.create({
      data: {
        restaurante_id: dados.restaurante_id,
        numero: dados.numero,
      },
    });
  }

  async atualizar(id: string, restaurante_id: string, dados: AtualizarMesaDTO) {
    const mesa = await prisma.mesa.findUnique({ where: { id } });
    if (!mesa || mesa.restaurante_id !== restaurante_id) {
      throw new NotFoundError("Mesa");
    }

    if (dados.numero && dados.numero !== mesa.numero) {
      const existente = await prisma.mesa.findUnique({
        where: {
          restaurante_id_numero: {
            restaurante_id,
            numero: dados.numero,
          },
        },
      });
      if (existente) {
        throw new ConflictError("Já existe uma mesa com este número");
      }
    }

    const data = {
      ...(dados.numero !== undefined ? { numero: dados.numero } : {}),
      ...(dados.ocupada !== undefined ? { ocupada: dados.ocupada } : {}),
      ...(dados.cpf_cliente !== undefined ? { cpf_cliente: dados.cpf_cliente } : {}),
    };

    return await prisma.mesa.update({
      where: { id },
      data,
    });
  }

  async deletar(id: string, restaurante_id: string) {
    const mesa = await prisma.mesa.findUnique({ where: { id } });
    if (!mesa || mesa.restaurante_id !== restaurante_id) {
      throw new NotFoundError("Mesa");
    }

    return await prisma.mesa.delete({
      where: { id },
    });
  }
}

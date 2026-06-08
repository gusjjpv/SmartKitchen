import { prisma } from "../config/prisma.js";

interface CriarHorarioDTO {
  restaurante_id: string;
  dia_semana: number;
  horario_abertura?: string;
  horario_fechamento?: string;
  fechado?: boolean;
}

interface AtualizarHorarioDTO {
  horario_abertura?: string;
  horario_fechamento?: string;
  fechado?: boolean;
}

export class HorarioFuncionamentoService {
  async listarPorRestaurante(restaurante_id: string) {
    return await prisma.horarioFuncionamento.findMany({
      where: { restaurante_id },
      orderBy: { dia_semana: "asc" },
    });
  }

  async obterPorDia(restaurante_id: string, dia_semana: number) {
    return await prisma.horarioFuncionamento.findUnique({
      where: {
        restaurante_id_dia_semana: {
          restaurante_id,
          dia_semana,
        },
      },
    });
  }

  async criar(dados: CriarHorarioDTO) {
    const data = {
      restaurante_id: dados.restaurante_id,
      dia_semana: dados.dia_semana,
      ...(dados.horario_abertura !== undefined
        ? { horario_abertura: dados.horario_abertura }
        : {}),
      ...(dados.horario_fechamento !== undefined
        ? { horario_fechamento: dados.horario_fechamento }
        : {}),
      ...(dados.fechado !== undefined ? { fechado: dados.fechado } : {}),
    };

    return await prisma.horarioFuncionamento.create({
      data,
    });
  }

  async atualizar(
    restaurante_id: string,
    dia_semana: number,
    dados: AtualizarHorarioDTO
  ) {
    const data = {
      ...(dados.horario_abertura !== undefined
        ? { horario_abertura: dados.horario_abertura }
        : {}),
      ...(dados.horario_fechamento !== undefined
        ? { horario_fechamento: dados.horario_fechamento }
        : {}),
      ...(dados.fechado !== undefined ? { fechado: dados.fechado } : {}),
    };

    return await prisma.horarioFuncionamento.update({
      where: {
        restaurante_id_dia_semana: {
          restaurante_id,
          dia_semana,
        },
      },
      data,
    });
  }

  async deletar(restaurante_id: string, dia_semana: number) {
    return await prisma.horarioFuncionamento.delete({
      where: {
        restaurante_id_dia_semana: {
          restaurante_id,
          dia_semana,
        },
      },
    });
  }
}

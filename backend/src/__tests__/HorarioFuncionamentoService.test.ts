import { describe, it, expect, vi, beforeEach } from "vitest";
import { HorarioFuncionamentoService } from "../services/HorarioFuncionamentoService.js";
import { prisma } from "../config/prisma.js";

vi.mock("../config/prisma.js", () => ({
  prisma: {
    horarioFuncionamento: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("HorarioFuncionamentoService", () => {
  let horarioService: HorarioFuncionamentoService;

  beforeEach(() => {
    horarioService = new HorarioFuncionamentoService();
    vi.clearAllMocks();
  });

  describe("obterPorDia", () => {
    it("deve buscar o horário usando a chave composta corretamente", async () => {
      const horarioMock = {
        restaurante_id: "rest-1",
        dia_semana: 1,
        horario_abertura: "18:00",
        horario_fechamento: "23:00",
        fechado: false,
      };

      vi.mocked(prisma.horarioFuncionamento.findUnique).mockResolvedValue(horarioMock as any);

      const resultado = await horarioService.obterPorDia("rest-1", 1);

      expect(resultado).toEqual(horarioMock);
      expect(prisma.horarioFuncionamento.findUnique).toHaveBeenCalledWith({
        where: {
          restaurante_id_dia_semana: {
            restaurante_id: "rest-1",
            dia_semana: 1,
          },
        },
      });
    });
  });

  describe("atualizar", () => {
    it("deve atualizar os horários usando a chave composta", async () => {
      const dadosAtualizacao = { horario_abertura: "19:00", fechado: false };
      vi.mocked(prisma.horarioFuncionamento.update).mockResolvedValue({} as any);

      await horarioService.atualizar("rest-1", 1, dadosAtualizacao);

      expect(prisma.horarioFuncionamento.update).toHaveBeenCalledWith({
        where: {
          restaurante_id_dia_semana: {
            restaurante_id: "rest-1",
            dia_semana: 1,
          },
        },
        data: dadosAtualizacao,
      });
    });
  });

  describe("deletar", () => {
    it("deve remover o horário de um dia específico usando a chave composta", async () => {
      vi.mocked(prisma.horarioFuncionamento.delete).mockResolvedValue({} as any);

      await horarioService.deletar("rest-1", 1);

      expect(prisma.horarioFuncionamento.delete).toHaveBeenCalledWith({
        where: {
          restaurante_id_dia_semana: {
            restaurante_id: "rest-1",
            dia_semana: 1,
          },
        },
      });
    });
  });
});
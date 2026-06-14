import { describe, it, expect, vi, beforeEach } from "vitest";
import { PedidoService } from "../services/PedidoService.js";
import { prisma } from "../config/prisma.js";
import { NotFoundError, ValidationError } from "../errors/AppError.js";

// Mock global do Prisma para interceptar todas as operações de banco
vi.mock("../config/prisma.js", () => ({
  prisma: {
    mesa: {
      findUnique: vi.fn(),
    },
    pedido: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn((callback) => callback(prisma)),
  },
}));

describe("PedidoService", () => {
  let pedidoService: PedidoService;

  beforeEach(() => {
    pedidoService = new PedidoService();
    vi.clearAllMocks(); // Limpa o histórico dos mocks entre um teste e outro
  });

  describe("criar", () => {
    it("deve criar um pedido com sucesso", async () => {
      const dadosPedido = {
        restaurante_id: "restaurante-1",
        mesa_id: "mesa-1",
        itens: [{ produto_id: "prod-1", quantidade: 2, preco_unitario: 15.5 }],
      };

      vi.mocked(prisma.mesa.findUnique).mockResolvedValue({
        id: "mesa-1",
        restaurante_id: "restaurante-1",
        numero: 5,
      } as any);

      const pedidoMockado = { id: "pedido-1", total: 31.0 };
      vi.mocked(prisma.pedido.create).mockResolvedValue(pedidoMockado as any);

      const resultado = await pedidoService.criar(dadosPedido);

      expect(resultado).toEqual(pedidoMockado);
      expect(prisma.mesa.findUnique).toHaveBeenCalledWith({ where: { id: "mesa-1" } });
    });

    it("deve lançar NotFoundError se a mesa não existir", async () => {
      const dadosPedido = {
        restaurante_id: "restaurante-1",
        mesa_id: "mesa-invalida",
        itens: [{ produto_id: "prod-1", quantidade: 2, preco_unitario: 15.5 }],
      };

      vi.mocked(prisma.mesa.findUnique).mockResolvedValue(null);

      await expect(pedidoService.criar(dadosPedido)).rejects.toThrow(NotFoundError);
    });

    it("deve lançar ValidationError se a lista de itens estiver vazia", async () => {
      const dadosPedido = {
        restaurante_id: "restaurante-1",
        mesa_id: "mesa-1",
        itens: [],
      };

      vi.mocked(prisma.mesa.findUnique).mockResolvedValue({
        id: "mesa-1",
        restaurante_id: "restaurante-1",
      } as any);

      await expect(pedidoService.criar(dadosPedido)).rejects.toThrow(ValidationError);
    });
  });

  describe("obterPorId", () => {
    it("deve retornar o pedido correto quando encontrado", async () => {
      const pedidoMockado = {
        id: "pedido-123",
        restaurante_id: "restaurante-1",
        total: 45.0,
        status: "RECEBIDO",
      };

      vi.mocked(prisma.pedido.findUnique).mockResolvedValue(pedidoMockado as any);

      const resultado = await pedidoService.obterPorId("pedido-123", "restaurante-1");

      expect(resultado).toEqual(pedidoMockado);
      expect(prisma.pedido.findUnique).toHaveBeenCalledWith({
        where: { id: "pedido-123" },
        include: expect.any(Object),
      });
    });

    it("deve lançar NotFoundError se o pedido não existir", async () => {
      vi.mocked(prisma.pedido.findUnique).mockResolvedValue(null);

      await expect(
        pedidoService.obterPorId("pedido-inexistente", "restaurante-1")
      ).rejects.toThrow(NotFoundError);
    });

    it("deve lançar NotFoundError se o pedido pertencer a outro restaurante", async () => {
      const pedidoDeOutroRestaurante = {
        id: "pedido-123",
        restaurante_id: "restaurante-hackers",
      };

      vi.mocked(prisma.pedido.findUnique).mockResolvedValue(pedidoDeOutroRestaurante as any);

      await expect(
        pedidoService.obterPorId("pedido-123", "restaurante-1")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("listar", () => {
    it("deve listar os pedidos aplicando os filtros corretamente", async () => {
      const listaMockada = [
        { id: "p1", status: "EM_PREPARO", restaurante_id: "restaurante-1" },
      ];

      vi.mocked(prisma.pedido.findMany).mockResolvedValue(listaMockada as any);

      const resultado = await pedidoService.listar("restaurante-1", {
        status: "EM_PREPARO",
      });

      expect(resultado).toEqual(listaMockada);
      expect(prisma.pedido.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            restaurante_id: "restaurante-1",
            status: "EM_PREPARO",
          }),
        })
      );
    });
  });

  describe("atualizarStatus", () => {
    it("deve lançar ValidationError ao tentar uma transição de status inválida", async () => {
      vi.mocked(prisma.pedido.findUnique).mockResolvedValue({
        id: "pedido-1",
        restaurante_id: "restaurante-1",
        status: "RECEBIDO",
      } as any);

      await expect(
        pedidoService.atualizarStatus("pedido-1", "restaurante-1", "PRONTO")
      ).rejects.toThrow(ValidationError);
    });
  });
});
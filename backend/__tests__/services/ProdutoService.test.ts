import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProdutoService } from "../../src/services/ProdutoService.js";
import { prisma } from "../../src/config/prisma.js";
import { NotFoundError, ValidationError } from "../../src/errors/AppError.js";

vi.mock("../../src/config/prisma.js", () => ({
  prisma: {
    produto: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    categoria: {
      findUnique: vi.fn(),
    },
  },
}));

describe("ProdutoService", () => {
  let produtoService: ProdutoService;

  beforeEach(() => {
    produtoService = new ProdutoService();
    vi.clearAllMocks();
  });

  describe("criar", () => {
    it("deve criar um produto se a categoria pertencer ao mesmo restaurante", async () => {
      vi.mocked(prisma.categoria.findUnique).mockResolvedValue({
        id: "cat-1",
        restaurante_id: "restaurante-1",
      } as any);

      const produtoMock = { id: "prod-1", nome: "Hambúrguer" };
      vi.mocked(prisma.produto.create).mockResolvedValue(produtoMock as any);

      const resultado = await produtoService.criar({
        restaurante_id: "restaurante-1",
        categoria_id: "cat-1",
        nome: "Hambúrguer",
        preco: 25.90,
      });

      expect(resultado).toEqual(produtoMock);
    });

    it("deve lançar ValidationError se a categoria for de outro restaurante", async () => {
      vi.mocked(prisma.categoria.findUnique).mockResolvedValue({
        id: "cat-1",
        restaurante_id: "restaurante-do-vizinho",
      } as any);

      await expect(
        produtoService.criar({
          restaurante_id: "restaurante-1",
          categoria_id: "cat-1",
          nome: "Hambúrguer",
          preco: 25.90,
        })
      ).rejects.toThrow(ValidationError);
    });
  });

  describe("obterPorId", () => {
    it("deve lançar NotFoundError se tentar buscar produto de outro restaurante", async () => {
      vi.mocked(prisma.produto.findUnique).mockResolvedValue({
        id: "prod-1",
        restaurante_id: "outro-restaurante",
      } as any);

      await expect(produtoService.obterPorId("prod-1", "meu-restaurante")).rejects.toThrow(NotFoundError);
    });
  });
});
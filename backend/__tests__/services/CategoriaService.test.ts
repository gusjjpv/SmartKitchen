import { describe, it, expect, vi, beforeEach } from "vitest";
import { CategoriaService } from "../../src/services/CategoriaService.js";
import { prisma } from "../../src/config/prisma.js";
import { NotFoundError } from "../../src/errors/AppError.js";

vi.mock("../../src/config/prisma.js", () => ({
  prisma: {
    categoria: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("CategoriaService", () => {
  let categoriaService: CategoriaService;

  beforeEach(() => {
    categoriaService = new CategoriaService();
    vi.clearAllMocks();
  });

  describe("obterPorId", () => {
    it("deve retornar a categoria com sucesso", async () => {
      const categoriaMock = { id: "cat-1", restaurante_id: "rest-1", nome: "Bebidas" };
      vi.mocked(prisma.categoria.findUnique).mockResolvedValue(categoriaMock as any);

      const resultado = await categoriaService.obterPorId("cat-1", "rest-1");

      expect(resultado).toEqual(categoriaMock);
    });

    it("deve lançar NotFoundError se a categoria pertencer a outro restaurante", async () => {
      const categoriaMock = { id: "cat-1", restaurante_id: "outro-rest" };
      vi.mocked(prisma.categoria.findUnique).mockResolvedValue(categoriaMock as any);

      await expect(
        categoriaService.obterPorId("cat-1", "meu-rest")
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("criar", () => {
    it("deve criar uma categoria definindo a ordem padrão como zero se não for enviada", async () => {
      const dados = { restaurante_id: "rest-1", nome: "Sobremesas" };
      vi.mocked(prisma.categoria.create).mockResolvedValue({ id: "cat-2", ...dados, ordem: 0 } as any);

      const resultado = await categoriaService.criar(dados);

      expect(resultado.ordem).toBe(0);
      expect(prisma.categoria.create).toHaveBeenCalledWith({
        data: { restaurante_id: "rest-1", nome: "Sobremesas", ordem: 0 },
      });
    });
  });
});
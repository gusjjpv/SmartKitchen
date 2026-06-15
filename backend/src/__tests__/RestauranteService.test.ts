import { describe, it, expect, vi, beforeEach } from "vitest";
import { RestauranteService } from "../services/RestauranteService.js";
import { prisma } from "../config/prisma.js";

vi.mock("../config/prisma.js", () => ({
  prisma: {
    restaurante: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("RestauranteService", () => {
  let restauranteService: RestauranteService;

  beforeEach(() => {
    restauranteService = new RestauranteService();
    vi.clearAllMocks();
  });

  describe("obterTodos", () => {
    it("deve aplicar filtros de cidade e status ativo corretamente", async () => {
      vi.mocked(prisma.restaurante.findMany).mockResolvedValue([] as any);

      await restauranteService.obterTodos({ cidade: "Pau dos Ferros", ativo: true });

      expect(prisma.restaurante.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            cidade: "Pau dos Ferros",
            ativo: true,
          },
        })
      );
    });
  });

  describe("verificarSlugExistente", () => {
    it("deve retornar true se o slug já estiver em uso por outro restaurante", async () => {
      vi.mocked(prisma.restaurante.findUnique).mockResolvedValue({ id: "rest-existente", slug: "smart-burger" } as any);

      const resultado = await restauranteService.verificarSlugExistente("smart-burger", "meu-id-atual-diferente");

      expect(resultado).toBe(true);
    });

    it("deve retornar false se o slug for do próprio restaurante sendo editado", async () => {
      vi.mocked(prisma.restaurante.findUnique).mockResolvedValue({ id: "meu-id", slug: "smart-burger" } as any);

      const resultado = await restauranteService.verificarSlugExistente("smart-burger", "meu-id");

      expect(resultado).toBe(false);
    });
  });
});
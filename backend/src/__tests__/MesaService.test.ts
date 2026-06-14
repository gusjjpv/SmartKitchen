import { describe, it, expect, vi, beforeEach } from "vitest";
import { MesaService } from "../services/MesaService.js";
import { prisma } from "../config/prisma.js";
import { NotFoundError, ConflictError } from "../errors/AppError.js";
import QRCode from "qrcode";

vi.mock("../config/prisma.js", () => ({
  prisma: {
    mesa: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    restaurante: {
      findUnique: vi.fn(),
    },
  },
}));

// Mockamos o módulo externo qrcode para não gerar imagens reais nos testes
vi.mock("qrcode", () => ({
  default: {
    toDataURL: vi.fn().mockResolvedValue("data:image/png;base64,mockedqrcode"),
  },
}));

describe("MesaService", () => {
  let mesaService: MesaService;

  beforeEach(() => {
    mesaService = new MesaService();
    vi.clearAllMocks();
  });

  describe("criar", () => {
    it("deve criar uma mesa com QR code gerado com sucesso", async () => {
      // 1. Garante que não existe mesa duplicada
      vi.mocked(prisma.mesa.findUnique).mockResolvedValue(null);
      // 2. Mock do restaurante para pegar o slug da URL
      vi.mocked(prisma.restaurante.findUnique).mockResolvedValue({ slug: "smart-burger" } as any);

      const mesaMock = { id: "mesa-1", numero: "10", qr_code_url: "data:image/png;base64,mockedqrcode" };
      vi.mocked(prisma.mesa.create).mockResolvedValue(mesaMock as any);

      const resultado = await mesaService.criar({ restaurante_id: "rest-1", numero: "10" });

      expect(resultado).toEqual(mesaMock);
      expect(QRCode.toDataURL).toHaveBeenCalled();
    });

    it("deve lançar ConflictError se o número da mesa já existir", async () => {
      vi.mocked(prisma.mesa.findUnique).mockResolvedValue({ id: "mesa-existente" } as any);

      await expect(
        mesaService.criar({ restaurante_id: "rest-1", numero: "10" })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe("atualizar", () => {
    it("deve lançar ConflictError ao tentar ocupar uma mesa que já está ocupada", async () => {
      vi.mocked(prisma.mesa.findUnique).mockResolvedValue({
        id: "mesa-1",
        restaurante_id: "rest-1",
        ocupada: true, // Já está ocupada
      } as any);

      await expect(
        mesaService.atualizar("mesa-1", "rest-1", { ocupada: true })
      ).rejects.toThrow(ConflictError);
    });
  });
});
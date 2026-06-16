import { describe, it, expect, vi, beforeEach } from "vitest";
import { UsuarioService } from "../../src/services/Userservice.js";
import { prisma } from "../../src/config/prisma.js";

vi.mock("../../src/config/prisma.js", () => ({
  prisma: {
    usuario: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

describe("UsuarioService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve criar um usuário com sucesso", async () => {
    const usuarioMock = {
      id: "user-1",
      nome: "Jessica",
      email: "jessica@email.com",
    };

    vi.mocked(prisma.usuario.create).mockResolvedValue(usuarioMock as any);

    const service = new UsuarioService(); // Instancia com o nome correto da classe
    const resultado = await service.criar("Jessica", "jessica@email.com", "senha123", "84999999999");

    expect(resultado).toEqual(usuarioMock);
  });

  it("deve buscar usuário por e-mail", async () => {
    const usuarioMock = { id: "user-1", email: "jessica@email.com" };
    vi.mocked(prisma.usuario.findUnique).mockResolvedValue(usuarioMock as any);

    const service = new UsuarioService();
    const resultado = await service.buscarPorEmail("jessica@email.com");

    expect(resultado).toEqual(usuarioMock);
  });

  it("deve registrar o login", async () => {
    const usuarioMock = { id: "user-1", ultimo_login: new Date() };
    vi.mocked(prisma.usuario.update).mockResolvedValue(usuarioMock as any);

    const service = new UsuarioService();
    const resultado = await service.registrarLogin("user-1");

    expect(resultado).not.toBeNull();
  });
});
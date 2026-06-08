import { prisma } from "../config/prisma.js";

export class UsuarioService {
  async criar(nome: string, email: string, senha: string, contato: string) {
    return await prisma.usuario.create({
      data: {
        nome,
        email,
        senha,
        contato,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        contato: true,
        criado_em: true,
        ultimo_login: true,
      },
    });
  }

  async buscarPorEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: { email },
    });
  }

  async registrarLogin(id: string) {
    return await prisma.usuario.update({
      where: { id },
      data: { ultimo_login: new Date() },
      select: {
        id: true,
        nome: true,
        email: true,
        contato: true,
        criado_em: true,
        ultimo_login: true,
      },
    });
  }

  async buscarTodos() {
    return await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        contato: true,
        criado_em: true,
        ultimo_login: true,
      },
    });
  }
}

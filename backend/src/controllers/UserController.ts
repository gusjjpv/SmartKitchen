import type { Request, Response, NextFunction } from "express";
import { UsuarioService } from "../services/Userservice.js";

const userService = new UsuarioService();

const obterTexto = (valor: unknown): string | undefined => {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor) && typeof valor[0] === "string") {
    return valor[0];
  }
  return undefined;
};

export class UserController {
  async cadastro(req: Request, res: Response, next: NextFunction) {
    try {
      const nome = obterTexto(req.body?.nome);
      const email = obterTexto(req.body?.email);
      const senha = obterTexto(req.body?.senha);
      const contato = obterTexto(req.body?.contato);

      if (!nome || !email || !senha || !contato) {
        return res.status(400).json({
          erro: "nome, email, senha e contato sao obrigatorios",
        });
      }

      const usuario = await userService.criar(nome, email, senha, contato);
      return res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const email = obterTexto(req.body?.email);
      const senha = obterTexto(req.body?.senha);

      if (!email || !senha) {
        return res.status(400).json({ erro: "email e senha sao obrigatorios" });
      }

      const usuario = await userService.buscarPorEmail(email);
      if (!usuario || usuario.senha !== senha) {
        return res.status(401).json({ erro: "Credenciais invalidas" });
      }

      const usuarioAtualizado = await userService.registrarLogin(usuario.id);
      return res.json(usuarioAtualizado);
    } catch (error) {
      next(error);
    }
  }

  async users(req: Request, res: Response, next: NextFunction) {
    try {
      const usuarios = await userService.buscarTodos();
      return res.json(usuarios);
    } catch (error) {
      next(error);
    }
  }
}
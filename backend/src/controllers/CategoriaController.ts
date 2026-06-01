import type { Request, Response, NextFunction } from "express";
import { CategoriaService } from "../services/CategoriaService.js";
import { ValidationError } from "../errors/AppError.js";

const categoriaService = new CategoriaService();

const obterTexto = (valor: unknown): string | undefined => {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor) && typeof valor[0] === "string") {
    return valor[0];
  }
  return undefined;
};

export class CategoriaController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");

      const categorias = await categoriaService.listar(restaurante_id);
      return res.json(categorias);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const id = obterTexto(req.params.id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");
      if (!id) throw new ValidationError("Id inválido");

      const categoria = await categoriaService.obterPorId(id, restaurante_id);
      return res.json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");

      const { nome, ordem, ativo } = req.body;
      if (!nome || typeof nome !== "string" || !nome.trim()) {
        throw new ValidationError("Nome é obrigatório");
      }

      const categoria = await categoriaService.criar({
        restaurante_id,
        nome: nome.trim(),
        ordem,
        ativo,
      });

      return res.status(201).json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const id = obterTexto(req.params.id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");
      if (!id) throw new ValidationError("Id inválido");

      const { nome, ordem, ativo } = req.body;

      const categoria = await categoriaService.atualizar(id, restaurante_id, {
        ...(nome !== undefined ? { nome } : {}),
        ...(ordem !== undefined ? { ordem } : {}),
        ...(ativo !== undefined ? { ativo } : {}),
      });

      return res.json(categoria);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const id = obterTexto(req.params.id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");
      if (!id) throw new ValidationError("Id inválido");

      await categoriaService.deletar(id, restaurante_id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

import type { Request, Response, NextFunction } from "express";
import { MesaService } from "../services/MesaService.js";
import { ValidationError } from "../errors/AppError.js";

const mesaService = new MesaService();

const obterTexto = (valor: unknown): string | undefined => {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor) && typeof valor[0] === "string") {
    return valor[0];
  }
  return undefined;
};

export class MesaController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");

      const mesas = await mesaService.listar(restaurante_id);
      return res.json(mesas);
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

      const mesa = await mesaService.obterPorId(id, restaurante_id);
      return res.json(mesa);
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");

      const { numero } = req.body;
      if (!numero || typeof numero !== "string" || !numero.trim()) {
        throw new ValidationError("Número da mesa é obrigatório");
      }

      const mesa = await mesaService.criar({
        restaurante_id,
        numero: numero.trim(),
      });

      return res.status(201).json(mesa);
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

      const { numero, ocupada } = req.body;

      if (numero !== undefined && (typeof numero !== "string" || !numero.trim())) {
        throw new ValidationError("Número da mesa é obrigatório");
      }

      const mesa = await mesaService.atualizar(id, restaurante_id, {
        ...(numero !== undefined ? { numero: numero.trim() } : {}),
        ...(ocupada !== undefined ? { ocupada } : {}),
      });

      return res.json(mesa);
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

      await mesaService.deletar(id, restaurante_id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

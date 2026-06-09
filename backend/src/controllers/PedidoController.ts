import type { Request, Response, NextFunction } from "express";
import { PedidoService } from "../services/PedidoService.js";
import { ValidationError } from "../errors/AppError.js";

const pedidoService = new PedidoService();

const obterTexto = (valor: unknown): string | undefined => {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor) && typeof valor[0] === "string") {
    return valor[0];
  }
  return undefined;
};

export class PedidoController {
  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const mesa_id = obterTexto(req.params.mesa_id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");
      if (!mesa_id) throw new ValidationError("Mesa inválida");

      const { itens } = req.body;

      if (!Array.isArray(itens) || itens.length === 0) {
        throw new ValidationError("Adicione pelo menos um item ao pedido");
      }

      const pedido = await pedidoService.criar({
        restaurante_id,
        mesa_id,
        itens,
      });

      return res.status(201).json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");

      const mesa_id = obterTexto(req.query.mesa_id as string);
      const status = obterTexto(req.query.status as string);

      const pedidos = await pedidoService.listar(restaurante_id, {
        ...(mesa_id ? { mesa_id } : {}),
        ...(status ? { status } : {}),
      });

      return res.json(pedidos);
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

      const pedido = await pedidoService.obterPorId(id, restaurante_id);
      return res.json(pedido);
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const id = obterTexto(req.params.id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");
      if (!id) throw new ValidationError("Id inválido");

      const { status } = req.body;
      if (!status) throw new ValidationError("Status é obrigatório");

      const pedido = await pedidoService.atualizarStatus(id, restaurante_id, status);
      return res.json(pedido);
    } catch (error) {
      next(error);
    }
  }
}

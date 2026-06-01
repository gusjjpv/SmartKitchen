import type { Request, Response, NextFunction } from "express";
import { ProdutoService } from "../services/ProdutoService.js";
import { ValidationError } from "../errors/AppError.js";

const produtoService = new ProdutoService();

const obterTexto = (valor: unknown): string | undefined => {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor) && typeof valor[0] === "string") {
    return valor[0];
  }
  return undefined;
};

const LIMITE_FOTO_BYTES = 2 * 1024 * 1024;

const validarFotoBase64 = (valor: unknown): string | null => {
  if (valor === undefined || valor === null) return null;
  if (typeof valor !== "string") return "foto_base64 inválida";
  if (!valor.trim()) return "foto_base64 inválida";

  let base64 = valor;
  if (valor.startsWith("data:")) {
    const match = valor.match(/^data:.*;base64,(.+)$/);
    if (!match) return "foto_base64 inválida";
    if (!match[1]) return "foto_base64 inválida";
    base64 = match[1];
  }

  const tamanhoBytes = Buffer.from(base64, "base64").length;
  if (tamanhoBytes > LIMITE_FOTO_BYTES) return "Foto excede 2mb";

  return null;
};

export class ProdutoController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");

      const categoria_id = obterTexto(req.query.categoria_id);

      const produtos = await produtoService.listar(restaurante_id, categoria_id);
      return res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = obterTexto(req.params.id);
      if (!id) throw new ValidationError("Id inválido");

      const produto = await produtoService.obterPorId(id);
      return res.json(produto);
    } catch (error) {
      next(error);
    }
  }

  async listarPorCategoria(req: Request, res: Response, next: NextFunction) {
    try {
      const categoria_id = obterTexto(req.params.categoria_id);
      if (!categoria_id) throw new ValidationError("Categoria inválida");

      const produtos = await produtoService.listarPorCategoria(categoria_id);
      return res.json(produtos);
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      if (!restaurante_id) throw new ValidationError("Restaurante inválido");

      const { categoria_id, nome, descricao, preco, foto_base64, disponivel } = req.body;

      if (!categoria_id || typeof categoria_id !== "string") {
        throw new ValidationError("Categoria é obrigatória");
      }
      if (!nome || typeof nome !== "string" || !nome.trim()) {
        throw new ValidationError("Nome é obrigatório");
      }
      if (preco === undefined || preco === null || typeof preco !== "number" || preco < 0) {
        throw new ValidationError("Preço inválido");
      }

      const erroFoto = validarFotoBase64(foto_base64);
      if (erroFoto) throw new ValidationError(erroFoto);

      const produto = await produtoService.criar({
        restaurante_id,
        categoria_id,
        nome: nome.trim(),
        descricao,
        preco,
        foto_base64,
        disponivel,
      });

      return res.status(201).json(produto);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = obterTexto(req.params.id);
      if (!id) throw new ValidationError("Id inválido");

      const { categoria_id, nome, descricao, preco, foto_base64, disponivel } = req.body;

      if (nome !== undefined && (!nome || typeof nome !== "string" || !nome.trim())) {
        throw new ValidationError("Nome inválido");
      }
      if (preco !== undefined && (typeof preco !== "number" || preco < 0)) {
        throw new ValidationError("Preço inválido");
      }

      const erroFoto = validarFotoBase64(foto_base64);
      if (erroFoto) throw new ValidationError(erroFoto);

      const produto = await produtoService.atualizar(id, {
        ...(categoria_id !== undefined ? { categoria_id } : {}),
        ...(nome !== undefined ? { nome: nome.trim() } : {}),
        ...(descricao !== undefined ? { descricao } : {}),
        ...(preco !== undefined ? { preco } : {}),
        ...(foto_base64 !== undefined ? { foto_base64 } : {}),
        ...(disponivel !== undefined ? { disponivel } : {}),
      });

      return res.json(produto);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = obterTexto(req.params.id);
      if (!id) throw new ValidationError("Id inválido");

      await produtoService.deletar(id);
      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

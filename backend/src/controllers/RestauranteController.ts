import type { Request, Response, NextFunction } from "express";
import { RestauranteService } from "../services/RestauranteService.js";

const restauranteService = new RestauranteService();

const obterTexto = (valor: unknown): string | undefined => {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor) && typeof valor[0] === "string") {
    return valor[0];
  }
  return undefined;
};

export class RestauranteController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const cidade = obterTexto(req.query.cidade);
      const ativoTexto = obterTexto(req.query.ativo);

      const filtros: { cidade?: string; ativo?: boolean } = {};
      if (cidade) filtros.cidade = cidade;
      if (ativoTexto === "true") filtros.ativo = true;
      if (ativoTexto === "false") filtros.ativo = false;

      const restaurantes = await restauranteService.obterTodos(filtros);

      return res.json(restaurantes);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const id = obterTexto(req.params.id);
      if (!id) {
        return res.status(400).json({ erro: "Id inválido" });
      }

      const restaurante = await restauranteService.obterPorId(id);

      if (!restaurante) {
        return res.status(404).json({ erro: "Restaurante não encontrado" });
      }

      return res.json(restaurante);
    } catch (error) {
      next(error);
    }
  }

  async showBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = obterTexto(req.params.slug);
      if (!slug) {
        return res.status(400).json({ erro: "Slug inválido" });
      }

      const restaurante = await restauranteService.obterPorSlug(slug);

      if (!restaurante) {
        return res.status(404).json({ erro: "Restaurante não encontrado" });
      }

      return res.json(restaurante);
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        nome,
        descricao,
        logo_base64,
        whatsapp,
        email,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        ativo,
      } = req.body;
      const slug = obterTexto(req.body?.slug);
      const admin_usuario_id = obterTexto(req.body?.admin_usuario_id);

      // TODO: Adicionar validação com middleware

      // Verificar se slug já existe
      if (!slug) {
        return res.status(400).json({ erro: "Slug é obrigatório" });
      }
      if (!admin_usuario_id) {
        return res
          .status(400)
          .json({ erro: "Admin do restaurante é obrigatório" });
      }
      const slugExistente = await restauranteService.verificarSlugExistente(
        slug
      );
      if (slugExistente) {
        return res.status(400).json({ erro: "Slug já está em uso" });
      }

      const restaurante = await restauranteService.criar({
        admin_usuario_id,
        nome,
        slug,
        descricao,
        logo_base64,
        whatsapp,
        email,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        ativo,
      });

      return res.status(201).json(restaurante);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = obterTexto(req.params.id);
      if (!id) {
        return res.status(400).json({ erro: "Id inválido" });
      }
      const {
        nome,
        descricao,
        logo_base64,
        whatsapp,
        email,
        rua,
        numero,
        bairro,
        cidade,
        estado,
        cep,
        ativo,
      } = req.body;
      const slug = obterTexto(req.body?.slug);
      const admin_usuario_id = obterTexto(req.body?.admin_usuario_id);

      // Verificar se restaurante existe
      const restauranteExistente =
        await restauranteService.obterPorId(id);
      if (!restauranteExistente) {
        return res.status(404).json({ erro: "Restaurante não encontrado" });
      }

      // Se mudou o slug, verificar se novo slug já existe
      if (slug && slug !== restauranteExistente.slug) {
        const slugExistente = await restauranteService.verificarSlugExistente(
          slug,
          id
        );
        if (slugExistente) {
          return res.status(400).json({ erro: "Slug já está em uso" });
        }
      }

      const dadosAtualizacao = {
        ...(admin_usuario_id !== undefined ? { admin_usuario_id } : {}),
        ...(nome !== undefined ? { nome } : {}),
        ...(slug !== undefined ? { slug } : {}),
        ...(descricao !== undefined ? { descricao } : {}),
        ...(logo_base64 !== undefined ? { logo_base64 } : {}),
        ...(whatsapp !== undefined ? { whatsapp } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(rua !== undefined ? { rua } : {}),
        ...(numero !== undefined ? { numero } : {}),
        ...(bairro !== undefined ? { bairro } : {}),
        ...(cidade !== undefined ? { cidade } : {}),
        ...(estado !== undefined ? { estado } : {}),
        ...(cep !== undefined ? { cep } : {}),
        ...(ativo !== undefined ? { ativo } : {}),
      };

      const restaurante = await restauranteService.atualizar(
        id,
        dadosAtualizacao
      );

      return res.json(restaurante);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const id = obterTexto(req.params.id);
      if (!id) {
        return res.status(400).json({ erro: "Id inválido" });
      }

      // Verificar se restaurante existe
      const restaurante = await restauranteService.obterPorId(id);
      if (!restaurante) {
        return res.status(404).json({ erro: "Restaurante não encontrado" });
      }

      await restauranteService.deletar(id);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

import type { Request, Response, NextFunction } from "express";
import { HorarioFuncionamentoService } from "../services/HorarioFuncionamentoService.js";

const horarioService = new HorarioFuncionamentoService();

const obterTexto = (valor: unknown): string | undefined => {
  if (typeof valor === "string") return valor;
  if (Array.isArray(valor) && typeof valor[0] === "string") {
    return valor[0];
  }
  return undefined;
};

const obterDiaSemana = (valor: unknown): number | undefined => {
  if (typeof valor === "number") {
    if (!Number.isInteger(valor) || valor < 0 || valor > 6) return undefined;
    return valor;
  }
  const texto = obterTexto(valor);
  if (!texto) return undefined;
  const numero = Number(texto);
  if (!Number.isInteger(numero) || numero < 0 || numero > 6) return undefined;
  return numero;
};

const obterBooleano = (valor: unknown): boolean | undefined => {
  if (typeof valor === "boolean") return valor;
  if (typeof valor === "string") {
    if (valor === "true") return true;
    if (valor === "false") return false;
  }
  return undefined;
};

export class HorarioFuncionamentoController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      if (!restaurante_id) {
        return res.status(400).json({ erro: "Restaurante inválido" });
      }

      const horarios = await horarioService.listarPorRestaurante(
        restaurante_id
      );

      return res.json(horarios);
    } catch (error) {
      next(error);
    }
  }

  async show(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const dia_semana = obterDiaSemana(req.params.dia_semana);

      if (!restaurante_id) {
        return res.status(400).json({ erro: "Restaurante inválido" });
      }
      if (dia_semana === undefined) {
        return res.status(400).json({ erro: "Dia da semana inválido" });
      }

      const horario = await horarioService.obterPorDia(
        restaurante_id,
        dia_semana
      );
      if (!horario) {
        return res
          .status(404)
          .json({ erro: "Horário não encontrado" });
      }

      return res.json(horario);
    } catch (error) {
      next(error);
    }
  }

  async store(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const dia_semana = obterDiaSemana(req.body?.dia_semana);
      const horario_abertura = obterTexto(req.body?.horario_abertura);
      const horario_fechamento = obterTexto(req.body?.horario_fechamento);
      const fechado = obterBooleano(req.body?.fechado);

      if (!restaurante_id) {
        return res.status(400).json({ erro: "Restaurante inválido" });
      }
      if (dia_semana === undefined) {
        return res.status(400).json({ erro: "Dia da semana inválido" });
      }

      const existente = await horarioService.obterPorDia(
        restaurante_id,
        dia_semana
      );
      if (existente) {
        return res.status(400).json({ erro: "Dia já cadastrado" });
      }

      const horario = await horarioService.criar({
        restaurante_id,
        dia_semana,
        horario_abertura,
        horario_fechamento,
        fechado,
      });

      return res.status(201).json(horario);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const dia_semana = obterDiaSemana(req.params.dia_semana);
      const horario_abertura = obterTexto(req.body?.horario_abertura);
      const horario_fechamento = obterTexto(req.body?.horario_fechamento);
      const fechado = obterBooleano(req.body?.fechado);

      if (!restaurante_id) {
        return res.status(400).json({ erro: "Restaurante inválido" });
      }
      if (dia_semana === undefined) {
        return res.status(400).json({ erro: "Dia da semana inválido" });
      }

      const existente = await horarioService.obterPorDia(
        restaurante_id,
        dia_semana
      );
      if (!existente) {
        return res
          .status(404)
          .json({ erro: "Horário não encontrado" });
      }

      const horario = await horarioService.atualizar(restaurante_id, dia_semana, {
        horario_abertura,
        horario_fechamento,
        fechado,
      });

      return res.json(horario);
    } catch (error) {
      next(error);
    }
  }

  async destroy(req: Request, res: Response, next: NextFunction) {
    try {
      const restaurante_id = obterTexto(req.params.restaurante_id);
      const dia_semana = obterDiaSemana(req.params.dia_semana);

      if (!restaurante_id) {
        return res.status(400).json({ erro: "Restaurante inválido" });
      }
      if (dia_semana === undefined) {
        return res.status(400).json({ erro: "Dia da semana inválido" });
      }

      const existente = await horarioService.obterPorDia(
        restaurante_id,
        dia_semana
      );
      if (!existente) {
        return res
          .status(404)
          .json({ erro: "Horário não encontrado" });
      }

      await horarioService.deletar(restaurante_id, dia_semana);

      return res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

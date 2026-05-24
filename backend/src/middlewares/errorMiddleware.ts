import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  error: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  console.error('[ERROR LOG]:', error.message || error);

  if (error.code === 'P2002') {
    return res.status(400).json({
      message: 'Este dado já está cadastrado no sistema (Conflito).',
    });
  }

  // Resposta genérica para qualquer outro erro
  return res.status(500).json({
    message: 'Ocorreu um erro interno no servidor.',
  });
}
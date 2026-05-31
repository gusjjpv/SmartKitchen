import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export function errorHandler(
  error: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) {
  console.error('[ERROR LOG]:', error.message || error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      erro: error.message,
    });
  }

  if (error.code === 'P2002') {
    return res.status(400).json({
      erro: 'Este dado já está cadastrado no sistema.',
    });
  }

  return res.status(500).json({
    erro: 'Ocorreu um erro interno no servidor.',
  });
}
import { Request, Response, NextFunction } from 'express';
import { DomainError } from '@/shared/types/DomainError';
import { logger } from '@/shared/infra/logger';

export const errorHandler = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof DomainError) {
    const status = 400;
    return res.status(status).json({ code: err.code, message: err.message });
  }

  logger.error('Unexpected error', err);
  return res.status(500).json({ error: 'Internal server error' });
};

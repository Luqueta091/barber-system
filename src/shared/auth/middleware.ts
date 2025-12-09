import { Request, Response, NextFunction } from 'express';

export const fakeAuth = (req: Request, _res: Response, next: NextFunction) => {
  (req as Request & { user?: { id: string } }).user = { id: 'barbeiro-demo' };
  next();
};

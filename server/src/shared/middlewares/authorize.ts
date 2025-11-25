import { NextFunction, Request, Response } from 'express';
import createHttpError from 'http-errors';

export const authorize =
  (allowedRoles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw createHttpError(401, 'Unauthenticated');
    }

    const user = req.user as { role: string };

    if (!allowedRoles.includes(user.role)) {
      throw createHttpError(403, 'Not authorized to access this resource');
    }

    next();
  };

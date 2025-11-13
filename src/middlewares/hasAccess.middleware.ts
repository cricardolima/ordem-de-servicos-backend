import type { Roles } from '@dtos/models';
import { ForbiddenException } from '@exceptions/forbidden.exception';
import type { NextFunction, Request, Response } from 'express';

export const hasAccess = (roles: Roles) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      if (!Array.isArray(roles)) {
        roles = [roles];
      }

      const hasRoles = roles.length && roles.includes(req.session.user.role);
      const isAdmin = req.session.user.role === 'ADMIN';

      if (!hasRoles && !isAdmin) {
        throw new ForbiddenException('Forbidden');
      }

      next();
    } catch (error) {
      throw new ForbiddenException('Forbidden', error as Error);
    }
  };
};

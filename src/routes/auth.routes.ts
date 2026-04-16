import { AuthController } from '@controllers/auth.controller';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import { authSchema } from '@validators/auth.schema';
import { Router } from 'express';
import type { Container } from 'inversify';
import { asyncHandler } from './utils';

export const createAuthRouter = (container: Container): Router => {
  const router = Router();
  const controller = container.get(AuthController);

  router.post(
    '/login',
    ValidateMiddleware(authSchema),
    asyncHandler((req, res) => controller.login(req, res)),
  );
  router.post(
    '/logout',
    asyncHandler((req, res) => controller.logout(req, res)),
  );
  router.post(
    '/refresh-token',
    asyncHandler((req, res) => controller.refreshToken(req, res)),
  );

  return router;
};

import { UserController } from '@controllers/user.controller';
import { AuthMiddleware } from '@middleware/auth.middleware';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import { createUserSchema } from '@validators/createUser.schema';
import { updateUserSchema } from '@validators/updateUser.schema';
import { Router } from 'express';
import type { Container } from 'inversify';
import { asyncHandler } from './utils';

export const createUsersRouter = (container: Container): Router => {
  const router = Router();
  const controller = container.get(UserController);

  router.get(
    '/',
    AuthMiddleware,
    asyncHandler((_req) => controller.getUsers()),
  );
  router.get(
    '/:id',
    AuthMiddleware,
    asyncHandler((req) => controller.getUser(req)),
  );
  router.post(
    '/',
    ValidateMiddleware(createUserSchema),
    AuthMiddleware,
    asyncHandler((req, res) => controller.createUser(req, res)),
  );
  router.patch(
    '/:id',
    ValidateMiddleware(updateUserSchema),
    AuthMiddleware,
    asyncHandler((req, res) => controller.updateUser(req, res)),
  );
  router.delete(
    '/:id',
    AuthMiddleware,
    asyncHandler((req, res) => controller.deleteUser(req, res)),
  );

  return router;
};

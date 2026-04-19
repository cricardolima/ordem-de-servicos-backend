import { ClientsController } from '@controllers/clients.controller';
import { AuthMiddleware } from '@middleware/auth.middleware';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import { createClientSchema } from '@validators/createClientSchema.schema';
import { Router } from 'express';
import type { Container } from 'inversify';
import { asyncHandler } from './utils';

export const createClientsRouter = (container: Container): Router => {
  const router = Router();
  const controller = container.get(ClientsController);

  router.get(
    '/:id',
    AuthMiddleware,
    asyncHandler((req) => controller.getClientById(req)),
  );
  router.post(
    '/',
    AuthMiddleware,
    ValidateMiddleware(createClientSchema),
    asyncHandler((req, res) => controller.createClient(req, res)),
  );
  router.delete(
    '/:id',
    AuthMiddleware,
    asyncHandler((req, res) => controller.deleteClient(req, res)),
  );
  router.get(
    '/',
    AuthMiddleware,
    asyncHandler(() => controller.getAllClients()),
  );

  return router;
};

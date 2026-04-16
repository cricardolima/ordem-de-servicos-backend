import { Router } from 'express';
import type { Container } from 'inversify';
import { createAuthRouter } from './auth.routes';
import { createClientsRouter } from './clients.routes';
import { createProfessionalsRouter } from './professionals.routes';
import { createServicesTypeRouter } from './servicesType.routes';
import { createUsersRouter } from './users.routes';

export const registerRoutes = (container: Container): Router => {
  const router = Router();

  router.use('/auth', createAuthRouter(container));
  router.use('/users', createUsersRouter(container));
  router.use('/services-type', createServicesTypeRouter(container));
  router.use('/professionals', createProfessionalsRouter(container));
  router.use('/clients', createClientsRouter(container));

  return router;
};

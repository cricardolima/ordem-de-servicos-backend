import { ServicesTypeController } from '@controllers/servicesType.controller';
import { AuthMiddleware } from '@middleware/auth.middleware';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import { createServiceTypeSchema } from '@validators/createServiceType.schema';
import { updateServiceTypeSchema } from '@validators/updateServiceType.schema';
import { Router } from 'express';
import type { Container } from 'inversify';
import { asyncHandler } from './utils';

export const createServicesTypeRouter = (container: Container): Router => {
  const router = Router();
  const controller = container.get(ServicesTypeController);

  router.get(
    '/',
    AuthMiddleware,
    asyncHandler(() => controller.getServicesType()),
  );
  router.post(
    '/',
    AuthMiddleware,
    ValidateMiddleware(createServiceTypeSchema),
    asyncHandler((req, res) => controller.createServicesType(req, res)),
  );
  router.delete(
    '/:id',
    AuthMiddleware,
    asyncHandler((req, res) => controller.deleteServicesType(req, res)),
  );
  router.patch(
    '/:id',
    AuthMiddleware,
    ValidateMiddleware(updateServiceTypeSchema),
    asyncHandler((req, res) => controller.updateServicesType(req, res)),
  );
  router.get(
    '/:id',
    AuthMiddleware,
    asyncHandler((req) => controller.getServicesTypeById(req)),
  );

  return router;
};

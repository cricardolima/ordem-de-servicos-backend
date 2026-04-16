import { ProfessionalsController } from '@controllers/professionals.controller';
import { AuthMiddleware } from '@middleware/auth.middleware';
import { ValidateMiddleware } from '@middleware/validate.middleware';
import { createProfessionalSchema } from '@validators/createProfessional.schema';
import { updateProfessionalSchema } from '@validators/updateProfessional.schema';
import { Router } from 'express';
import type { Container } from 'inversify';
import { asyncHandler } from './utils';

export const createProfessionalsRouter = (container: Container): Router => {
  const router = Router();
  const controller = container.get(ProfessionalsController);

  router.get(
    '/:id',
    AuthMiddleware,
    asyncHandler((req, res) => controller.getProfessionalById(req, res)),
  );
  router.get(
    '/',
    AuthMiddleware,
    asyncHandler((req, res) => controller.getProfessionals(req, res)),
  );
  router.post(
    '/',
    AuthMiddleware,
    ValidateMiddleware(createProfessionalSchema),
    asyncHandler((req, res) => controller.createProfessional(req, res)),
  );
  router.patch(
    '/:id',
    AuthMiddleware,
    ValidateMiddleware(updateProfessionalSchema),
    asyncHandler((req, res) => controller.updateProfessional(req, res)),
  );
  router.delete(
    '/:id',
    AuthMiddleware,
    asyncHandler((req, res) => controller.deleteProfessional(req, res)),
  );

  return router;
};

import { BusinessException } from '@exceptions/business.exception';
import { ValidationException } from '@exceptions/validation.exception';
import { zodValidationErrorParse } from '@utils/zodValidationErrorParse';
import type { NextFunction, Request, Response } from 'express';
import { type ZodError, z } from 'zod';

export const ValidateMiddleware = (schema: z.ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        const parsedError = zodValidationErrorParse(error as unknown as ZodError);
        throw new ValidationException({
          message: 'Dados inválidos',
          fields: parsedError,
        });
      }
      throw new BusinessException(
        error instanceof Error ? error.message : 'Unknown error',
        error instanceof Error ? error : undefined,
      );
    }
  };
};

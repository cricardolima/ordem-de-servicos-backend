import type { Request, RequestHandler, Response } from 'express';

type AsyncControllerHandler = (req: Request, res: Response) => Promise<unknown> | unknown;

export const asyncHandler = (handler: AsyncControllerHandler): RequestHandler => {
  return async (req, res, next) => {
    try {
      const result = await handler(req, res);

      if (result !== undefined && !res.headersSent) {
        res.json(result);
      }
    } catch (error) {
      next(error);
    }
  };
};

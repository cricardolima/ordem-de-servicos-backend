import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";
import { ValidationException } from "@exceptions/validation.exception";
import { zodValidationErrorParse } from "@utils/zodValidationErrorParse";
import { BusinessException } from "@exceptions/business.exception";


export const ValidateMiddleware = (schema: z.ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const parsedError = zodValidationErrorParse(error as unknown as ZodError);
                console.log("parsedError", parsedError);
                throw new ValidationException({ message: "Dados inválidos", fields: parsedError });
            }
            throw new BusinessException(error.message, error);
        }
    };
};
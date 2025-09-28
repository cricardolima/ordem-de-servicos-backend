import { NextFunction, Request, Response } from "express";
import { ValidationException } from "@exceptions/validation.exception";
import { BusinessException } from "@exceptions/business.exception";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";

export const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        url: req.url,
        method: req.method,
        statusCode: err.statusCode,
        isOperational: err.isOperational,
        timestamp: new Date().toISOString()
    });
        
        if (err instanceof ValidationException) {
            return res.status(err.statusCode).json({
                success: false,
                error: {
                    message: err.message,
                    details: err.getFormattedFields() || [],
                    type: "validation_error"
                }
            });
        }

        if (err instanceof BusinessException) {
            return res.status(err.statusCode).json({
                success: false,
                error: {
                    message: err.message,
                    type: "business_error",
                    ...(process.env.NODE_ENV === "development" ? { stack: err.stack, originalError: err.originalError } : {})
                }
            });
        }

        if (err instanceof UnauthorizedException) {
            return res.status(err.statusCode).json({
                success: false,
                error: {
                    message: err.message,
                    type: "unauthorized_error",
                    ...(process.env.NODE_ENV === "development" ? { stack: err.stack, originalError: err.originalError } : {})
                }
            });
        }
        
        return res.status(err.statusCode || 500).json({
            success: false,
            error: {
                type: "server_error",
                message: err.isOperational ? err.message : 'Erro interno do servidor',
                ...(process.env.NODE_ENV === "development" ? { stack: err.stack } : {})
            }
        });
        
};
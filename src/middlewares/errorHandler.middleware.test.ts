import { errorHandlerMiddleware } from "./errorHandler.middleware";
import { Request, Response } from "express";
import { ValidationException } from "@exceptions/validation.exception";
import { BusinessException } from "@exceptions/business.exception";
import { UnauthorizedException } from "@exceptions/unauthorized.exception";
import { NotFoundException } from "@exceptions/notFound.exception";

describe('ErrorHandlerMiddleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
    
    it('should be defined', () => {
        expect(errorHandlerMiddleware).toBeDefined();
    });

    beforeEach(() => {
        req = {
            url: '/test',
            method: 'POST',
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should handle a ValidationException with empty fields', () => {
        const err = new ValidationException({ message: 'Validation error', fields: [] });

        errorHandlerMiddleware(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: 'Validation error',
                details: [],
                type: 'validation_error'
            }
        });
    });

    it('should log error details to console', () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        const err = new ValidationException({ message: 'Validation error', fields: [] });

        errorHandlerMiddleware(err, req as Request, res as Response, next);

        expect(consoleSpy).toHaveBeenCalledWith('Error:', {
            message: 'Validation error',
            url: '/test',
            method: 'POST',
            statusCode: 400,
            isOperational: true,
            stack: undefined,
            timestamp: expect.any(String)
        })

        consoleSpy.mockRestore();
    })

    it('should handle a BusinessException', () => {
        const err = new BusinessException('Business error');

        errorHandlerMiddleware(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: 'Business error',
                type: 'business_error',
                stack: undefined,
                originalError: undefined
            }
        });
    })

    it('should handle a UnauthorizedException', () => {
        const err = new UnauthorizedException('Unauthorized error');

        errorHandlerMiddleware(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: 'Unauthorized error',
                type: 'unauthorized_error',
                stack: undefined,
                originalError: undefined
            }
        });
    })

    it('should handle a NotFoundException', () => {
        const err = new NotFoundException('Not found error');

        errorHandlerMiddleware(err, req as Request, res as Response, next);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            error: {
                message: 'Not found error',
                type: 'not_found_error',
                stack: undefined,
                originalError: undefined
            }
        });
    });
})
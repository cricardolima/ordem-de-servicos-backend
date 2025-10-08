import { NextFunction, Request, Response } from "express";
import { ValidateMiddleware } from "./validate.middleware";
import { authSchema } from "@validators/auth.schema";
import { ValidationException } from "@exceptions/validation.exception";

describe("ValidateMiddleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let mockNext: NextFunction;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
        consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockReq = { body: {} };
        mockRes = { status: jest.fn().mockReturnThis(), json: jest.fn() };
        mockNext = jest.fn();
    });

    afterEach(() => {
        consoleErrorSpy.mockRestore();
    });
    
    it("should call next() if the request is valid", () => {
        mockReq.body = { 
            registration: "1234567890",
            password: "1234567890"
        }

        const middleware = ValidateMiddleware(authSchema);
        middleware(mockReq as Request, mockRes as Response, mockNext);

        expect(mockNext).toHaveBeenCalled();
    })

    it("should throw a ValidationException if the request is invalid", () => {
        mockReq.body = {
            registration: "",
            password: "1234567890"
        }

        const middleware = ValidateMiddleware(authSchema);

        expect(() => middleware(mockReq as Request, mockRes as Response, mockNext)).toThrow(ValidationException);
    })
})
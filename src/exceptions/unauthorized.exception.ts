import { ErrorHandler } from "@exceptions/errorHandler";

export class UnauthorizedException extends ErrorHandler {
    statusCode = 401;
    isOperational = true;
}
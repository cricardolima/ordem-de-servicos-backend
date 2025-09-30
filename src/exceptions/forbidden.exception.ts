import { ErrorHandler } from "@exceptions/errorHandler";

export class ForbiddenException extends ErrorHandler {
    statusCode = 403;
    isOperational = true;
}
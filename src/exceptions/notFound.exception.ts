import { ErrorHandler } from "@exceptions/errorHandler";

export class NotFoundException extends ErrorHandler {
    statusCode = 404;
    isOperational = true;
}
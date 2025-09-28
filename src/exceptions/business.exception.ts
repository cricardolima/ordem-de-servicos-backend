import { ErrorHandler } from "@exceptions/errorHandler";

export class BusinessException extends ErrorHandler {
    statusCode = 400;
    isOperational = true;
}
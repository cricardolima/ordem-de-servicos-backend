import { ErrorHandler } from "@exceptions/errorHandler";

export interface IValidationField {
    field: string;
    message: string;
}

export interface IValidationException {
    message: string;
    fields: IValidationField[];
}

export class ValidationException extends ErrorHandler {
    statusCode = 400;
    isOperational = true;
    fields: IValidationField[];

    constructor({ message, fields }: IValidationException) {
        super(message);
        this.fields = fields;
    }

    getFormattedFields() {
        return this.fields.map((field) => ({
            field: field.field,
            message: field.message
        }));
    }
}
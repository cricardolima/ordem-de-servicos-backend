export abstract class ErrorHandler extends Error {
  abstract statusCode: number;
  abstract isOperational: boolean;

  constructor(
    message: string,
    public originalError?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

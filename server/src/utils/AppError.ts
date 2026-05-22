export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;
    // 4xx errors are 'fail', 5xx errors are 'error'
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Operational errors mean known, handled issues. Native bugs will default to false.
    this.isOperational = true;

    // Capture the clean stack trace, excluding this constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}
import { Request, Response, NextFunction } from 'express';

/**
 * Custom error handler middleware for Express.
 * @param err - The error object.
 * @param req - Express request object.
 * @param res - Express response object.
 * @param next - Express next function.
 */
const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err); // Log the error (for debugging)

  const statusCode = err.status || 500; // Use error status if available, else 500
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined, // Show stack only in development
  });
};

export default errorHandler;

import { Request, Response } from 'express';
import logger from '../utils/logger';
import { AppError } from '../utils/appError';

export const errorHandler = (
   err: AppError,
   req: Request,
   res: Response,
   // next: NextFunction
): void => {
   const statusCode = err.statusCode || 500;
   const isOperational = err.isOperational || false;

   // Log the error
   logger.error(`Error: ${err.message}, Status Code: ${statusCode}`);

   // Respond to the client
   res.status(statusCode).json({
      status: 'error',
      message: isOperational ? err.message : 'Internal Server Error',
   });
};

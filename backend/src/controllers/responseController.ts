import { Request, Response, NextFunction } from 'express';
import ResponseService from '../services/responseService';
import { AppError } from '../utils/appError';
import logger from '../utils/logger';

class ResponseController {
   public static async fetchAndSave(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         await ResponseService.fetchAndSaveResponse();
         res.status(201).json({
            message: 'Data fetched and saved successfully',
         });
      } catch (error) {
         logger.error(`Error: ${error}`);
         next(new AppError('Error in fetching and saving response', 500));
      }
   }

   public static async getHistoricalData(
      req: Request,
      res: Response,
      next: NextFunction
   ): Promise<void> {
      try {
         const data = await ResponseService.getHistoricalData();
         res.status(200).json(data);
      } catch (error) {
         logger.error(`Error: ${error}`);
         next(new AppError('Error fetching historical data', 500));
      }
   }
}

export default ResponseController;

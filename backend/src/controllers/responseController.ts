import { Request, Response, NextFunction } from 'express';
import ResponseService from '../services/responseService';

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
         next(error);
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
         next(error);
      }
   }
}

export default ResponseController;

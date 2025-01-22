import Response, { IResponseData } from '../models/responseModel';
import { AppError } from '../utils/appError';

class ResponseDAO {
   public static async saveResponse(data: IResponseData): Promise<void> {
      try {
         const response = new Response(data);
         await response.save();
      } catch (error) {
         throw new AppError('Failed to save response', 500);
      }
   }

   public static async getAllResponses(): Promise<IResponseData[]> {
      try {
         return await Response.find().sort({ timestamp: -1 }).lean();
      } catch (error) {
         throw new AppError('Failed to fetch responses', 500);
      }
   }
}

export default ResponseDAO;
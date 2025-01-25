import axios from 'axios';
import ResponseDAO from '../daos/responseDAO';
import { IResponseData } from '../models/responseModel';
import { AppError } from '../utils/appError';
import { generateRandomPayload } from '../utils/generateRandomPayload';
import { io } from '../server';
import logger from '../utils/logger';

class ResponseService {
   public static async fetchAndSaveResponse(): Promise<void> {
      try {
         const requestPayload = generateRandomPayload();
         const { data: response } = await axios.post(
            'https://httpbin.org/anything',
            requestPayload
         );

         const responseData: IResponseData = {
            requestPayload,
            response,
            timestamp: new Date(),
         };

         await ResponseDAO.saveResponse(responseData);

         // Emit the new data to all connected clients
         io.emit("newData", responseData);
      } catch (error) {
         logger.error(`Error: ${error}`);
         throw new AppError('Error in fetching and saving response', 500);
      }
   }

   public static async getHistoricalData(): Promise<IResponseData[]> {
      try {
         return await ResponseDAO.getAllResponses();
      } catch (error) {
         logger.error(`Error: ${error}`);
         throw new AppError('Error fetching historical data', 500);
      }
   }
}

export default ResponseService;

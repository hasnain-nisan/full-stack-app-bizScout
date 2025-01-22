import cron from 'node-cron';
import ResponseService from '../services/responseService';
import logger from './logger';

// Schedule a task to run every 5 minutes
const cronJob = () => {
   cron.schedule('*/1 * * * *', async () => {
      logger.info('Fetching data from httpbin.org...');
      await ResponseService.fetchAndSaveResponse();
   });
};

export const startCronJobs = () => {
   cronJob(); // Start any other jobs
   console.log('All cron jobs have been initialized.');
};

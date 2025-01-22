import express, { Request, Response, NextFunction } from 'express';
import connectDB from './config/dbConfig';
import responseRoutes from './routes/responseRoutes';
import { startCronJobs } from './utils/cronJobs';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api', responseRoutes);

// Catch-all for undefined routes
app.use((req: Request, res: Response, next: NextFunction) => {
   res.status(404).json({ message: 'Route not found' });
});

// Error handling middleware
app.use(errorHandler);

// Database Connection
connectDB();

//start cronjobs
startCronJobs();

export default app;

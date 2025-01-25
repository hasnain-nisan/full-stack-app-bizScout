import express, { Request, Response, NextFunction } from 'express';
import connectDB from './config/dbConfig';
import cors from "cors";
import responseRoutes from './routes/responseRoutes';
import { startCronJobs } from './utils/cronJobs';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware to parse JSON
app.use(express.json());

// CORS Middleware - Allow all origins
app.use(cors());

// Routes
// Welcome route at the root
app.get('/', (req: Request, res: Response) => {
   res.status(200).json({ message: 'Welcome to the API!' });
});

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

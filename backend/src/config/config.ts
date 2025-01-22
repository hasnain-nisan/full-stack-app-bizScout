import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

interface Config {
   port: number;
   mongoUri: string;
   nodeEnv: string;
   jwtSecret: string;
}

// Export configuration object
const config: Config = {
   port: parseInt(process.env.PORT || '3000', 10),
   mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/httpMonitor',
   nodeEnv: process.env.NODE_ENV || 'development',
   jwtSecret: process.env.JWT_SECRET || 'defaultsecretkey',
};

export default config;

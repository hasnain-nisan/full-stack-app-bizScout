import app from './app';
import './utils/cronJobs'; // Import cron jobs

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

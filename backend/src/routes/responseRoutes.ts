import { Router } from 'express';
import ResponseController from '../controllers/responseController';

const router = Router();

router.post('/fetch', ResponseController.fetchAndSave);
router.get('/data', ResponseController.getHistoricalData);

export default router;

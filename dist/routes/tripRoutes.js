import { Router } from 'express';
import { startTrip, endTrip } from '../controllers/tripController.js';
const router = Router();
router.post('/start', startTrip);
router.post('/end', endTrip);
export default router;

import { Router } from 'express';
import { updateLocation } from '../controllers/gpsController.js';

const router = Router();

router.post('/update-location', updateLocation);

export default router;

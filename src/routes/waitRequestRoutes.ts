import { Router } from 'express';
import {
  createWaitRequest,
  respondToWaitRequest
} from '../controllers/waitRequestController.js';

const router = Router();

router.post('/', createWaitRequest);
router.post('/respond', respondToWaitRequest);

export default router;

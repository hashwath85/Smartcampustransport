import { Router } from 'express';
import { createComplaint, getAllComplaints, getComplaintById, updateComplaintStatus } from '../controllers/complaintController.js';
const router = Router();
router.post('/', createComplaint);
router.get('/', getAllComplaints);
router.get('/:id', getComplaintById);
router.patch('/:id/status', updateComplaintStatus);
export default router;

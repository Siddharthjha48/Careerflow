import express from 'express';
import {
  applyForJob,
  getApplications,
  updateApplicationStatus,
  getAnalytics,
  getNotifications,
  markNotificationRead,
} from '../controllers/applicationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // All routes are protected

router.post('/', applyForJob);
router.get('/', getApplications);
router.patch('/:id/status', updateApplicationStatus);
router.get('/analytics', getAnalytics);
router.get('/notifications', getNotifications);
router.patch('/notifications/:id/read', markNotificationRead);

export default router;

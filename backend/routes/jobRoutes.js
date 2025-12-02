import express from 'express';
import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createJob).get(protect, getAllJobs);
router.route('/:id').delete(protect, deleteJob).patch(protect, updateJob);

export default router;

import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .patch(protect, (req, res, next) => {
    upload.single('resume')(req, res, (err) => {
      if (err) {
        console.error('Multer Upload Error:', err);
        return res.status(400).json({ message: 'Upload failed', error: err.message || err });
      }
      next();
    });
  }, updateUserProfile);

export default router;

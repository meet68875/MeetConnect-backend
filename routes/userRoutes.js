// src/routes/userRoutes.js
import express from 'express';
import { protect } from '../middleware.js';
import { getUserProfile, updateUserProfile } from '../controllers/authController.js';

const router = express.Router();

// Route to get user's profile
router.get('/profile', protect, getUserProfile);

// Route to update user's profile
router.put('/profile', protect, updateUserProfile);

export default router;

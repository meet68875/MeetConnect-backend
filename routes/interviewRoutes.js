// src/routes/interviewRoutes.js
import express from 'express';
import { getUserInterviews, scheduleInterview, updateInterviewDetails, updateInterviewStatus } from '../controllers/interviewController.js';
import { protect } from '../middleware.js';

const router = express.Router();

// Route to schedule a new Interview
router.post('/schedule', protect, scheduleInterview);

// Route to get all user's interviews (filter by status)
router.get('/my-interviews', protect, getUserInterviews);

// Route to update interview status (i.e. mark as completed)
router.put('/:interviewId/update', protect, updateInterviewStatus);
router.put('/:interviewId', protect, updateInterviewDetails);

export default router;

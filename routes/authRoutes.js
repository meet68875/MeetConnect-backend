import express from 'express';
import { body } from 'express-validator';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = express.Router();

const registerValidation = [
    body('username')
        .isLength({ min: 3 })
        .withMessage('Username must be at least 3 characters long')
        .trim(),
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .escape() 
];

const loginValidation = [
    body('email')
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .not().isEmpty()
        .withMessage('Password is required')
        .escape()
];

router.post('/register', registerValidation, registerUser);
router.post('/login', loginValidation, loginUser);

export default router;
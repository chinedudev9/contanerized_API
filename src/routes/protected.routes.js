import express from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protected route - requires authentication
router.get('/profile', authenticate, (req, res) => {
    res.json({
        message: 'Profile data',
        user: req.user
    });
});

// Admin only route - requires authentication and admin role
router.get('/admin', authenticate, authorize(['admin']), (req, res) => {
    res.json({
        message: 'Admin panel data',
        user: req.user
    });
});

// User or Admin route - requires authentication and specific roles
router.get('/dashboard', authenticate, authorize(['user', 'admin']), (req, res) => {
    res.json({
        message: 'Dashboard data',
        user: req.user
    });
});

export default router;
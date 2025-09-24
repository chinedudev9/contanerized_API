import { jwttoken } from '../utils/jwt.js';
import { cookies } from '../utils/cookies.js';
import logger from '../config/logger.js';

/**
 * Authentication middleware to protect routes
 * Verifies JWT token from cookies and adds user info to request object
 */
export const authenticate = async (req, res, next) => {
    try {
        // Get token from cookies
        const token = cookies.get(req, 'token');
        
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }
        
        // Verify token
        const decoded = jwttoken.verify(token);
        
        // Add user info to request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        
        next();
        
    } catch (e) {
        logger.error('Authentication error:', e);
        return res.status(401).json({ error: 'Invalid token.' });
    }
};

/**
 * Authorization middleware to check user roles
 * @param {string[]} allowedRoles - Array of allowed roles
 */
export const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'Access denied. User not authenticated.' });
        }
        
        if (allowedRoles.length && !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }
        
        next();
    };
};

/**
 * Optional authentication middleware
 * Adds user info to request if token is present, but doesn't block unauthenticated requests
 */
export const optionalAuth = async (req, res, next) => {
    try {
        const token = cookies.get(req, 'token');
        
        if (token) {
            const decoded = jwttoken.verify(token);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            };
        }
        
        next();
        
    } catch (e) {
        // If token is invalid, just proceed without user info
        logger.warn('Optional auth - invalid token:', e.message);
        next();
    }
};
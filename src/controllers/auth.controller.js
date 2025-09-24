
import { formartValidationError } from "../utils/format.js";
import { signupSchema, signinSchema } from "../validation/auth.validation.js";
import { createUser, getUserByEmail, verifyPassword } from "../services/auth.service.js";
import { cookies } from '../utils/cookies.js';
import { jwttoken } from '../utils/jwt.js';
import logger from '../config/logger.js';

export const signup = async(req, res, next) => {
   try {
    const validationResult = signupSchema.safeParse(req.body)
    
    if (!validationResult.success) {
        return res.status(400).json({
            error: 'validation failed',
            datails: formartValidationError(validationResult.error)
        });
    }
    const { name, email, password, role } = validationResult.data;

    const user = await createUser({ name, email, password, role });

    const token = jwttoken.sign({ id: user.id, email: user.email, role: user.role });

    cookies.set(res, 'token', token);

    logger.info(`user registration successful: ${email}`);
    res.status(201).json({
        message: 'user registered successfully',
        user: {
            id: user.id, 
            name: user.name, 
            email: user.email, 
            role: user.role
        }
    });


   } catch (e) {
    logger.error('signup error:', e);

    if(e.message === "User already exists") {
        return res.status(409).json({ error: 'Email already exists'})
    }
    next(e);
   }
}

export const signin = async (req, res, next) => {
    try {
        const validationResult = signinSchema.safeParse(req.body);
        
        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation failed',
                details: formartValidationError(validationResult.error)
            });
        }
        
        const { email, password } = validationResult.data;
        
        // Get user by email
        const user = await getUserByEmail(email);
        
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Verify password
        const isPasswordValid = await verifyPassword(password, user.password);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Generate JWT token
        const token = jwttoken.sign({ 
            id: user.id, 
            email: user.email, 
            role: user.role 
        });
        
        // Set cookie
        cookies.set(res, 'token', token);
        
        logger.info(`User signin successful: ${email}`);
        
        res.status(200).json({
            message: 'Signin successful',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
        
    } catch (e) {
        logger.error('signin error:', e);
        next(e);
    }
}

export const signout = async (req, res, next) => {
    try {
        // Clear the authentication cookie
        cookies.clear(res, 'token');
        
        logger.info('User signed out successfully');
        
        res.status(200).json({
            message: 'Signout successful'
        });
        
    } catch (e) {
        logger.error('signout error:', e);
        next(e);
    }
}


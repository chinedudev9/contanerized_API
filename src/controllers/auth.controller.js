
import { formartValidationError } from "../utils/format.js";

import { signupSchema } from "../validation/auth.validation.js";
import { createUser } from "../services/auth.service.js";
import { cookies } from '../utils/cookies.js';

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

    const token = jwttoken.sign({ id: user.id, email:user.emails, role:user.role });

    cookies.set(res, 'token', token);

    logger.info(`user registration successfull: $(email)`);
    res.status(201).json({
        message: 'user registered',
        user: {
            id: user.id, name:user.name, email:user.email, role:user.role
        }
    })


   } catch (e) {
    logger.error('signup error', e);

    if(e.message == "user already exist") {
        return res.status(409).json({ error: 'email already exist'})
    }
    next(e);
   }
}


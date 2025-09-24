import logger from '../config/logger.js';
import bcrypt from 'bcrypt';
import { pool } from '../config/db.js'



export const hashpassword = async (passowrd) => {
    try {
        return await bcrypt.hash(passowrd, 10);
    } catch (e) {
        logger.error(`Error hashing the password: ${e}`);
        throw new Error('Error hashing password');
    }
}

export const createUser = async ({name, email, password, role = 'user'}) => {
        try {
        const existingUserQuery = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
        const existingUser = await pool.query(existingUserQuery, [email]);

        if (existingUser.rows.length > 0) {
            throw new Error('User already exists');
        }

        const password_hash = await hashpassword(password);

        const insertQuery = 
          `INSERT INTO users (name, email, password, role)
           VALUES ($1, $2, $3, $4)
           RETURNING id, name, email, role, created_at;
           `;

            const result = await pool.query(insertQuery, [name, email, password_hash, role]);
            const newUser = result.rows[0];

        logger.info(`User ${newUser.email} created successfully`);
        return newUser;

    } catch (e) {
        logger.error(`Error creating the user: ${e}`);
        if (e.message === 'User already exists') {
            throw e;
        }
        throw new Error('Error creating user');
    }
}

export const getUserByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email = $1 LIMIT 1';
        const result = await pool.query(query, [email]);
        
        if (result.rows.length === 0) {
            return null;
        }
        
        return result.rows[0];
    } catch (e) {
        logger.error(`Error getting user by email: ${e}`);
        throw new Error('Error retrieving user');
    }
}

export const verifyPassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (e) {
        logger.error(`Error verifying password: ${e}`);
        throw new Error('Error verifying password');
    }
}

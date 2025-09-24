import jwt from 'jsonwebtoken';
import logger from '../config/logger';

const JWT_SECRET = process.env.JWT_SECRET || 'prrovide your jwt token'
const JWT_EXPIRE_IN = "1d";

export const jwttoken = {
    sign: (payload) => {
        try {
            return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE_IN})
        } catch (e) {
            logger.error('Fail to Authenticate', e);
            throw new Error('Fail Authenticate Token');
        }
    },
    verify: (token) => {
        try {
            return jwt.verify(token, JWT_SECRET);
        } catch (e) {
            logger.error('Fail to Authenticate', e);
            throw new Error('Fail Authenticate Token');
        }
    }
}

import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from "helmet";
import morgan from 'morgan';

import logger from './config/logger.js'
import router from './routes/auth.routes.js'

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(cookieParser());

app.use(morgan('combined',  { stream: { write: (message) => logger.info(message.trim()) }}));


app.get('/', (req, res) => {
    logger.info('Hello containerized')
    res.status(200).send('hello world')
})

app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        timestamp: new Date().toISOString(), 
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    })
})

app.get('/api', (req, res) => {
    res.status(200).json({ message: "Containerized API"})
})

app.use('/api/auth', router);

export default app;
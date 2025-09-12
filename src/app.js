import express from 'express';

const app = express();

app.get('/', (req, res) => {
    res.status(200).send('hello world')
})

app.get('/dashboard', (req, res) => {
    res.status(200).send('dashboard page')
})

export default app;
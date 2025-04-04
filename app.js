const express = require('express');
const winston = require('winston');

const app = express();
const port = 3000;

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    defaultMeta: { service: 'calculator-microservice' },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});

// Middleware
app.use(express.json());
app.use((req, res, next) => {
    const startTime = Date.now();
    const originalEnd = res.end;
    res.end = function (...args) {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';
        logger.log({
            level: logLevel,
            message: `${req.method} ${req.path} completed`,
            ip: req.ip,
            method: req.method,
            url: req.url,
            query: req.query,
            status: res.statusCode,
            duration: `${duration}ms`
        });
        originalEnd.apply(res, args);
    };
    next();
});

// Validation helper
const validateNumbers = (num1, num2) => !isNaN(num1) && !isNaN(num2);
const validateSingleNumber = (num) => !isNaN(num);

// Existing API Endpoints
app.get('/add', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (!validateNumbers(num1, num2)) return res.status(400).json({ error: 'Invalid numbers provided' });
    res.json({ result: num1 + num2 });
});

app.get('/subtract', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (!validateNumbers(num1, num2)) return res.status(400).json({ error: 'Invalid numbers provided' });
    res.json({ result: num1 - num2 });
});

app.get('/multiply', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (!validateNumbers(num1, num2)) return res.status(400).json({ error: 'Invalid numbers provided' });
    res.json({ result: num1 * num2 });
});

app.get('/divide', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (!validateNumbers(num1, num2)) return res.status(400).json({ error: 'Invalid numbers provided' });
    if (num2 === 0) return res.status(400).json({ error: 'Division by zero is not allowed' });
    res.json({ result: num1 / num2 });
});

// New API Endpoints
app.get('/exponent', (req, res) => {
    const base = parseFloat(req.query.base);
    const exponent = parseFloat(req.query.exponent);
    if (!validateNumbers(base, exponent)) return res.status(400).json({ error: 'Invalid numbers provided' });
    res.json({ result: Math.pow(base, exponent) });
});

app.get('/sqrt', (req, res) => {
    const num = parseFloat(req.query.num);
    if (!validateSingleNumber(num)) return res.status(400).json({ error: 'Invalid number provided' });
    if (num < 0) return res.status(400).json({ error: 'Square root of negative number is not supported' });
    res.json({ result: Math.sqrt(num) });
});

app.get('/modulo', (req, res) => {
    const num1 = parseFloat(req.query.num1);
    const num2 = parseFloat(req.query.num2);
    if (!validateNumbers(num1, num2)) return res.status(400).json({ error: 'Invalid numbers provided' });
    if (num2 === 0) return res.status(400).json({ error: 'Modulo by zero is not allowed' });
    res.json({ result: num1 % num2 });
});

app.get('/', (req, res) => {
    res.send('Hello from SIT737 Cloud Native App!');
  });
  
// Error handling
app.use((err, req, res, next) => {
    logger.log({
        level: 'error',
        message: err.message,
        stack: err.stack,
        ip: req.ip,
        method: req.method,
        url: req.url
    });
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(port, () => {
    logger.log({ level: 'info', message: `Calculator microservice listening at http://localhost:${port}` });
    console.log(`Calculator microservice listening at http://localhost:${port}`);
});
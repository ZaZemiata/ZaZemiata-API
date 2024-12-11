import express, { ErrorRequestHandler } from 'express';
import router from './router';
import { enableBigIntSerialization } from './utils/bigInt';
import logger from './utils/logger'; // Import winston logger

// Enable serialization of BigInts
enableBigIntSerialization();

// Create an Express app
const app = express();

// Middleware
app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url}`);
    next();
});

// Router
app.use(router);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ message: 'Internal Server Error' });
};
app.use(errorHandler);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

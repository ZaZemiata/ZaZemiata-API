import express from 'express';
import keywordRoutes from './routes/keyWords';
import sourceRouter from './routes/sourceRouter';
import { enableBigIntSerialization } from './utils/bigInt';

// Enable serialization of BigInts
enableBigIntSerialization();

// Create an Express app
const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/api/keywords', keywordRoutes);
app.use('/api/sources', sourceRouter);

app.listen(3000, () => {

    console.log('Server running on port 3000');
});

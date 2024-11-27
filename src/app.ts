import express from 'express';
import router from "./router"
import { enableBigIntSerialization } from './utils/bigInt';

// Enable serialization of BigInts
enableBigIntSerialization();

// Create an Express app
const app = express();

// Middleware
app.use(express.json());

// Router
app.use(router);

app.listen(3000, () => {

    console.log('Server running on port 3000');
});

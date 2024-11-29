/**
 * Source controller
 * 
 * @module sourceController.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

// Import dependencies

import express from 'express';
import { getAllSources } from '../services/sourceService';


// Create a new router
const router = express.Router();

//Endpoints
router.get('/api/sources', getAllSources);

// Export the router
export default router;
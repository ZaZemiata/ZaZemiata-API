/**
 * Source Router
 * 
 * @module source.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

// Import dependencies

import express from 'express';
import { getAllSources } from '../services/sourceService';


// Create a new router
const router = express.Router();

// Get all keywords
router.get('/', getAllSources);

// Export the router
export default router;
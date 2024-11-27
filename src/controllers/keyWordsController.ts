/**
 * KeyWords controller
 * 
 * @module keyWords.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

// Import dependencies
import express from 'express';
import { getAllKeywords } from '../services/keyWordsService';

// Create a new router
const router = express.Router();

//Endpoints
router.get('/api/keywords', getAllKeywords);

// Export the router
export default router;
/**
 * KeyWords Router
 * 
 * @module keyWords.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

// Import dependencies
import express from 'express';
import { getAllKeywords } from '../services/keyWords';

// Create a new router
const router = express.Router();

// Get all keywords
router.get('/', getAllKeywords);

// Export the router
export default router;
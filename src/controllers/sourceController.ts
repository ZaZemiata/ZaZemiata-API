/**
 * Source controller
 * 
 * @module sourceController.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

// Import dependencies

import express, { Request, Response } from 'express';
import { getAllSources, updateSourceActiveStatus } from '../services/sourceService';

// Create a new router
const router = express.Router();

//Endpoints
router.get('/api/sources', async (req: Request, res: Response) => {

    // Try to get all sources
    try {

        // Call the service to get all sources
        const sources = await getAllSources();

        // Return all sources
        res.status(200).json(sources);
    }

    catch (error: any) {

        // Log the error
        console.error('Error getting sources:', error.message);

        // Return an error response
        res.status(500).json({ message: error.message });
    }
});

router.post('/api/sources/update-active', async (req: Request, res: Response) => {

    // Extract `id` and `active` from the request body
    const { id, active } = req.body;

    // Try to update the active status
    try {

        // Validate `id`
        if (typeof id !== 'number' || isNaN(id)) {
            throw new Error('Invalid or missing "id". It must be a valid number.');
        }

        // Validate `active`
        if (typeof active !== 'boolean') {
            throw new Error('Invalid or missing "active". It must be a boolean value.');
        }

        // Call the service to update the active status
        const updatedSource = await updateSourceActiveStatus(id, active);

        // Return the updated record
        res.status(200).json(updatedSource);

    } catch (error: any) {

        // Log the error
        console.error('Error updating source:', error.message);

        res.status(500).json({ message: error.message });
    }
});

// Export the router
export default router;
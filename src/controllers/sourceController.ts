/**
 * Source controller
 * 
 * @module source.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

// Import dependencies

import express, { Request, Response } from 'express';
import { getAllSources, updateSourceActiveStatus } from '../services/sourceService';


// Create a new router
const router = express.Router();

//Endpoints
router.get('/api/sources', getAllSources);

router.post('/api/sources/update-active', async (req: Request, res: Response) => {
    
    // Extract `id` and `active` from the request body
    const { id, active } = req.body;

    // Validate `id`
    if (typeof id !== 'number' || isNaN(id)) {
        res.status(400).json({ message: 'Invalid or missing "id". It must be a valid number.' });
        return;
    }

    // Validate `active`
    if (typeof active !== 'boolean') {
        res.status(400).json({ message: 'Invalid or missing "active". It must be a boolean value.' });
        return;
    }

    try {
        // Call the service to update the active status
        const updatedSource = await updateSourceActiveStatus(id, active);

        // Return the updated record
        res.status(200).json(updatedSource);
    } catch (error) {

        // Log the error
        console.error("Error updating source:", error);

        res.status(500).json({ message: 'Failed to update source' });
    }
});

// Export the router
export default router;
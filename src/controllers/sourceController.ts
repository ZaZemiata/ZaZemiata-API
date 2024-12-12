/**
 * Source controller
 * 
 * @module sourceController.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

// Import dependencies
import express, { Request, Response } from 'express';
import { getAllSources, updateSourceActiveStatus } from '../services/sourceService';
import logger from '../utils/logger'; // Import logger

// Create a new router
const router = express.Router();

// Endpoints
router.get('/api/sources', async (req: Request, res: Response) => {

    // Try to get all sources
    try {

        // Log the request
        logger.info("Fetching all sources...");

        // Call the service to get all sources
        const sources = await getAllSources();

        // Log success
        logger.info(`Successfully fetched ${sources.length} sources.`);

        // Return all sources
        res.status(200).json(sources);
    }

    catch (error: any) {

        // Log the error
        logger.error(`Error getting sources: ${error.message}`);

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
            res.status(400).send({ error: 'Invalid or missing "id". It must be a valid number.' });
            return;
        }

        // Validate `active`
        if (typeof active !== 'boolean') {
            res.status(400).send({ error: 'Invalid or missing "active". It must be a boolean value.' });
            return;
        }

        // Log the update action
        logger.info(`Updating source with id: ${id}, active status: ${active}`);

        // Call the service to update the active status
        const updatedSource = await updateSourceActiveStatus(id, active);

        // Log success
        logger.info(`Successfully updated source with id: ${id}`);

        // Return the updated record
        res.status(200).json(updatedSource);

    } catch (error: any) {

        // Log the error
        logger.error(`Error updating source: ${error.message}`);

        res.status(500).json({ message: error.message });
    }
});

// Export the router
export default router;

/**
 * SourceUrls Controller
 * 
 * @module sourceUrlsController.ts
 * @author Geno Popov <geno_popov@yahoo.com>
 */

import express from 'express';
import { Request, Response } from 'express';
import { updateSourceUrlActiveStatus } from '../services/sourceUrlsService';

const router = express.Router();

/**
 * Updates the active status of a SourceUrl.
 * 
 * @endpoint POST /api/source-urls/update-active
 * @param {number} req.body.id - The ID of the SourceUrl.
 * @param {boolean} req.body.active - The new active status of the SourceUrl.
 * @returns {Object} Updated SourceUrl object or an error message.
 */
router.post('/api/source-urls/update-active', async (req: Request, res: Response) => {

    // Extract id and active from the request body
    const { id, active } = req.body;

    try {
        // Validate id
        if (typeof id !== 'number' || isNaN(id)) {
            res.status(400).send({ error: 'Invalid or missing "id". It must be a valid number.' });
            return;
        }

        // Validate active
        if (typeof active !== 'boolean') {
            res.status(400).json({ message: 'Invalid or missing "active". It must be a boolean value.' });
            return;
        }

        // Call the service to update the active status
        const updatedSourceUrl = await updateSourceUrlActiveStatus(id, active);

        // Return the updated record
        res.status(200).json(updatedSourceUrl);

    } catch (error: any) {
        // Log the error
        console.error("Error updating SourceUrl:", error.message);

        // Respond with an error message
        res.status(500).json({ message: error.message });
    }
});
export default router;

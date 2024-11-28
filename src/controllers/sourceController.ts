/**
 * Source controller
 * 
 * @module source.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

// Import dependencies

import express from 'express';
import { getAllSources, updateSourceActiveStatus } from '../services/sourceService';


// Create a new router
const router = express.Router();

//Endpoints
router.get('/api/sources', getAllSources);

router.patch('/api/sources/:id', async (req, res) => {

    // Get source ID from the URL parameter
    const { id } = req.params; 

    // Get the 'active' field from the request body
    const { active } = req.body; 

    try {

        // Call the service to update the 'active' status
        const updatedSource = await updateSourceActiveStatus(Number(id), active);

        // Return the updated source
        res.status(200).json(updatedSource); 

    } catch (error) {

        // Log the error
        console.error("Error updating source:", error);

        res.status(500).json({ message: 'Failed to update source' });
    }
});

// Export the router
export default router;
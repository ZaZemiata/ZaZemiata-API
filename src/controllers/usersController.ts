/**
 * Users Controller
 *
 * @module usersController.ts
 * @author Daniel Batanov <batanoff.s@protonmail.com>
 */

import express from "express";
import { Request, Response } from "express";
import logger from "../utils/logger"; // Import winston logger
import { toggleStatus, getAll } from "../services/usersService";
import { isAdmin } from "../middlewares/isAdmin";

// Create a new router
const router = express.Router();

/**
 * @endpoint GET /api/users
 * @description Fetch all user records.
 */
router.get("/api/users", async (req: Request, res: Response) => {

    // Try
    try {

        // get all users
        const users = await getAll();

        // return all users
        res.status(200).json(users);
    } 

    // Catch errors
    catch (error) {

        // Log the error
        logger.error("Error while getting the users:", error);
        

        // Send a server error message
        res.status(500).json({ message: "Failed to fetch users." });
    }
});

/**
 * @endpoint GET /api/users
 * @description Update target user status by toggling, while checking if the request is made by an admin.
 */
router.post("/api/users", isAdmin, async (req: Request, res: Response) => {

    // Get data from request body
    const { userId } = req.body;

    // Try
    try {

        // Is userId missing
        if(!userId) {
            res.status(400).send({ error: 'Missing userId!' });
            return;
        }

        // Invalid ID
        if (isNaN(Number(userId)) || (typeof userId !== 'number' && typeof userId !== 'bigint')) {
            res.status(400).send({ error: 'ID must be a number!' });
            return;
        }

        // Toggle user status
        const updatedUser = await toggleStatus(userId);

        // return updated user
        res.status(200).json(updatedUser);
    } 

    // Catch errors
    catch (error) {

        // Log the error
        logger.error("Failed to update user status:", error);

        // Send a server error message
        res.status(500).json({ message: "Failed to update user status." });
    }
});

// Export the router
export default router;

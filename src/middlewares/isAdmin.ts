/**
 * Is Admin Middleware
 *
 * @module isAdmin.ts
 * @author Daniel <danieldimitrov2304@gmail.com>
 */

// Import dependencies
import { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "./isAuthenticated";
import { isUserAdmin } from "../services/authService";

// Middleware to check if the user is an admin
export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {

    // First, ensure the user is authenticated
    await isAuthenticated(req, res, async () => {

        // Try to check if the user is an admin
        try {
            
            // Extract the user ID from the decoded token
            const userId = (req as any).user?.id;

            // Ensure the user ID exists
            if (!userId) {

                // Return an error response
                res.status(401).send({ error: "Unauthorized: No user ID provided" });
                return;
            }

            // Check if the user is an admin
            const isAdmin = await isUserAdmin(userId);

            // If the user is not an admin, return an error
            if (!isAdmin) {

                // Return an error response
                res.status(403).send({ error: "Forbidden: User is not an admin" });
                return;
            }

            // Proceed to the next middleware or route
            next();
        } 
        
        // Handle errors
        catch (error) {

            // Handle errors
            res.status(500).send({ error: "Internal Server Error" });
        }
    });
};
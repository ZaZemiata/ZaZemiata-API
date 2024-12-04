/**
 * Middlewares
 *
 * @module middleware.ts
 * @author vadiim <vadim123bg@gmail.com>
 */


// Import dependencies
import { NextFunction, Request, Response } from "express";
import { verify } from "../utils/jwt";

// Middleware to check if the user is authenticated
export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    
    // Try to authenticate the user
    try {

        // Get token from the Authorization header
        const authHeader = req.headers["authorization"];

        // Check if the token exists
        if (!authHeader) {

            // Return an error response
            res.status(401).send({ error: "Unauthorized: No token provided" });
            return; 
        }

        // Check if the token is in the correct format
        if (!authHeader.startsWith('Bearer ')) {

            // Return an error response
            res.status(401).send({ error: 'Unauthorized: Invalid format' });
            return;
        }

        // Extract token from the Authorization header
        const token = authHeader.split(" ")[1];

        // Verify the token
        const decodedToken = await verify(token, process.env.SECRET as string);
        
        // Check if the token is valid
        if (!decodedToken) {

            // Return an error response
            res.status(401).send({ error: "Unauthorized: Invalid token" });
            return; 
        }

        // Proceed to the next middleware or route
        next();

    } 
    
    // Catch errors
    catch (error) {

        // Return an error response
        res.status(401).send({ error: "Unauthorized: Invalid token" });
    }
};
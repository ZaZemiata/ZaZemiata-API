/**
 * KeyWords Service
 * 
 * @module keyWords.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

import prisma from '../db/prisma/prisma';
import { Request, Response } from 'express';

// Get all keywords
export const getAllKeywords = async (req: Request, res: Response) => {

    // Prepare for errors
    try {

        // Get all keywords from the database
        const keywords = await prisma.keyWords.findMany();

        // Send the keywords as a response
        res.json(keywords);
    }

    // Catch errors
    catch (error) {

        // Log the error
        console.error("Error fetching keywords:", error);

        // Send a server error message
        res.status(500).json({ message: "Failed to fetch keywords." });
    }
};
/**
 * Source Service
 *
 * @module source.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

import prisma from "../db/prisma/prisma";
import { Request, Response } from "express";

// Get all keywords
export const getAllSources = async (req: Request, res: Response) => {
    // Get all sources from the database
    const sources = await prisma.sources.findMany();

    // Send the sources as a response
    res.json(sources);
};

export const updateSourceActiveStatus = async (id: number, active: boolean) => {
    try {
        // Attempt to update the 'active' field of the source with the given ID
        const updatedSource = await prisma.sources.update({

            // Find the source by ID
            where: { id: id },

            // Update the 'active' field
            data: { active: active },
        });

        // Return the updated source object
        return updatedSource;
    } catch (error) {
        // Log the error
        console.error("Error updating source:", error);

        // Rethrow the error so it can be caught by the controller
        throw error;
    }
};
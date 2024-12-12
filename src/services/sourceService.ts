/**
 * Source Service
 *
 * @module source.ts
 * @authowr vadiim <vadim123bg@gmail.com>
 */

import prisma from "../db/prisma/prisma";
import logger from "../utils/logger"; // Import winston logger

// Get all sources
export const getAllSources = async () => {
    try {
        // Get all sources from the database
        const sources = await prisma.sources.findMany();

        // Log success
        logger.info("Fetched all sources successfully.");

        // Return all sources
        return sources;
    } catch (error: any) {
        // Log the error
        logger.error("Error getting sources:", error.message);

        // Rethrow the error
        throw error;
    }
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

        // Log success
        logger.info(`Source with ID ${id} updated successfully to active status: ${active}.`);

        // Return the updated source object
        return updatedSource;
    } catch (error) {
        // Log the error
        logger.error(`Error updating source with ID ${id}:`, error);

        // Rethrow the error
        throw error;
    }
};

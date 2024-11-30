/**
 * SourceUrls Service
 * 
 * @module sourceUrlsService.ts
 * @author Geno Popov <geno_popov@yahoo.com>
 */

import prisma from '../db/prisma/prisma';

/**
 * Updates the active status of a SourceUrl in the database.
 * 
 * @param {number} id - The ID of the SourceUrl to update.
 * @param {boolean} active - The new active status of the SourceUrl.
 * @returns {Object} The updated SourceUrl object.
 * @throws Will throw an error if the operation fails.
 */
export const updateSourceUrlActiveStatus = async (id: number, active: boolean) => {
    try {
        // Attempt to update the 'active' field of the SourceUrl with the given ID
        const updatedSourceUrl = await prisma.sourceUrls.update({

            // Find the SourceUrl by ID
            where: { id },

            // Update the 'active' field
            data: { active },
        });

        // Return the updated SourceUrl object
        return updatedSourceUrl;
    } catch (error) {
        // Log the error
        console.error("Error updating SourceUrl:", error);

        // Rethrow the error so it can be caught by the controller
        throw error;
    }
};

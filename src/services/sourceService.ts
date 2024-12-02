/**
 * Source Service
 *
 * @module source.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

import prisma from "../db/prisma/prisma";
import { Request, Response } from "express";

// Get all keywords
export const getAllSources = async () => {

    // Try to get all sources
    try {
        
        // Get all sources from the database
        const sources = await prisma.sources.findMany();

        // Return all sources
        return sources;
    } 
    
    // Catching error and return message
    catch (error: any) {

        // Log the error
        console.error("Error getting sources:", error.message);

        // Catching error and return message
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

        // Return the updated source object
        return updatedSource;
    } catch (error) {
        // Log the error
        console.error("Error updating source:", error);

        // Rethrow the error so it can be caught by the controller
        throw error;
    }
};
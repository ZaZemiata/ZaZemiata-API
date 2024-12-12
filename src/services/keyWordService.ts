/**
 * KeyWords Service
 * 
 * @module keyWordService.ts
 * @authowr Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

import prisma from '../db/prisma/prisma';
import { KeyWords } from '@prisma/client';
import logger from '../utils/logger'; // Import winston logger

// Get all keywords
export const getAllKeywords = async () => {
    try {
        // Get all keywords from the database
        const keywords = await prisma.keyWords.findMany();

        // Log success
        logger.info("Fetched all keywords successfully.");

        // Return all keywords
        return keywords;
    } catch (error) {
        // Log the error
        logger.error("Error fetching keywords:", error);

        // Rethrow the error
        throw error;
    }
};

export const updateKeyWord = async (body: KeyWords) => {
    try {
        // Update keyword
        const res = await prisma.keyWords.update({
            // Specify the unique identifier
            where: {
                id: body.id,
            },
            // New values
            data: {
                word: body.word,
                priority: body.priority,
                active: body.active,
            },
        });

        // Log success
        logger.info(`Keyword with ID ${body.id} updated successfully.`);

        // Send the keyword as a response
        return res;
    } catch (error) {
        // Log the error
        logger.error(`Error updating keyword with ID ${body.id}:`, error);

        // Rethrow the error
        throw error;
    }
};

export const createKeyWord = async (body: KeyWords) => {
    try {
        // Create keyword
        const res = await prisma.keyWords.create({
            data: {
                word: body.word,
                priority: body.priority,
                active: body.active,
                created_at: new Date(),
            },
        });

        // Log success
        logger.info(`Keyword "${body.word}" created successfully.`);

        // Send the keyword as a response
        return res;
    } catch (error) {
        // Log the error
        logger.error(`Error creating keyword "${body.word}":`, error);

        // Rethrow the error
        throw error;
    }
};

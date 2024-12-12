/**
 * CrawledData Service
 *
 * @module crawledDataService.ts
 * @authowr Hristo Georgiev <hristogeorgiew84@gmail.com>
 */

import prisma from "../db/prisma/prisma";
import { Request, Response } from "express";
import logger from "../utils/logger"; // Import winston logger

// Get all CrawledData records with related SourceUrls and Sources
export const getAllCrawledData = async (req: Request, res: Response) => {
    try {
        // Get all crawled data from the database
        const crawledData = await prisma.crawledData.findMany();

        // Log success
        logger.info("Fetched all crawled data successfully.");

        // Return all crawled data
        return crawledData;
    } catch (error) {
        // Log the error
        logger.error("Error fetching crawled data:", error);

        // Send a server error message
        res.status(500).json({ message: "Failed to fetch crawled data." });
    }
};

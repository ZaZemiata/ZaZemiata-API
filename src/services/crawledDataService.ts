/**
 * CrawledData Service
 *
 * @module crawledDataService.ts
 * @author Hristo Georgiev <hristogeorgiew84@gmail.com>
 * @author Daniel Batanov <batanoff.s@protonmail.com>
 */

import prisma from "../db/prisma/prisma";
import { Request, Response } from "express";
import logger from "../utils/logger"; // Import winston logger
import { PaginationResult } from "../types/pagination";  // Import types

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

// Get limited CrawledData records based on pagination provided in query params
export const getCrawledDataPagination = async (page: number, limit: number): Promise<PaginationResult> => {
    try {
        // Get total records of crawled data
        const totalEntries = await prisma.crawledData.count();

        // Get data filtered by limit and page
        const data = await prisma.crawledData.findMany({
            take: limit,
            skip: (page - 1) * limit,
        });

        // Calculate total pages
        const total = Math.ceil(totalEntries / limit);

        // Log success
        logger.info("Fetched filtered crawled data successfully.");

        // Return all crawled data
        return {data, total};

    // Catch errors 
    } catch (error) {
        // Log the error
        logger.error("Error fetching crawled data:", error);
        
        // Return error object
        return {error: (error as Error).message};
    }
};

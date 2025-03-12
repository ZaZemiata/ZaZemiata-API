/**
 * CrawledData Service
 *
 * @module crawledDataService.ts
 * @autor Hristo Georgiev <hristogeorgiew84@gmail.com>
 * @autor Daniel Batanov <batanoff.s@protonmail.com>
 * @autor Hristo Georgiev <hristogeorgiew84@gmail.com>
 * @autor Daniel Batanov <batanoff.s@protonmail.com>
 */

import prisma from "../db/prisma/prisma";
import { Request, Response } from "express";
import logger from "../utils/logger"; // Import winston logger
import { PaginationResult } from "../types/pagination";  // Import types
import { FilterOptions } from '../types/crawledDataFilters';

// Get all CrawledData records with related SourceUrls and Sources
export const getAllCrawledData = async (req: Request, res: Response) => {

    // Try to fetch data
    try {

        // Get all crawled data from the database
        const crawledData = await prisma.crawledData.findMany({
            include: {
                SourceUrls: {
                    select: {
                        url: true,
                        Sources: {
                            // Select only display_name
                            select: {
                                display_name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                date: "desc",
            },
        });

        // Log success
        logger.info("Fetched all crawled data successfully.");

        // Return all crawled data
        return crawledData;
    }

    // Catch errors
    catch (error) {

        // Log the error
        logger.error("Error fetching crawled data:", error);

        // Send a server error message
        res.status(500).json({ message: "Failed to fetch crawled data." });
    }
};

// Get CrawledData records based on page and limit query params
export const getCrawledDataWithPaginationFilters = async (filters: FilterOptions): Promise<PaginationResult> => {

    // Destructure filters
    const { page, limit, sourceId, dateBefore, dateAfter, dateExact, containsText, order = "desc" } = filters;

    // Try to fetch data
    try {

        // Define where conditions
        const whereConditions: any = {};

        // Define sourceId filter
        if (sourceId) {

            // SourceId array
            let sourceIdArray: string[] = [];

            // Check if sourceId is a string
            if (typeof sourceId === "string") {

                // Split sourceId by comma and trim each id
                sourceIdArray = sourceId.split(',').map(id => id.trim());
            } 
            
            // Check if sourceId is an array
            else if (Array.isArray(sourceId)) {

                // Convert sourceId to string
                sourceIdArray = sourceId.map(id => id.toString());
            } 
            
            // Else convert sourceId to string
            else {

                // Convert sourceId to string
                sourceIdArray = [sourceId.toString()];
            }

            // Filter valid sourceIds
            const validSourceIds = sourceIdArray.filter(id => !isNaN(Number(id)) && id !== "");

            // Check if validSourceIds is not empty
            if (validSourceIds.length > 0) {

                // Add sourceUrls to whereConditions
                whereConditions.SourceUrls = {
                    source_id: {
                        in: validSourceIds.map(id => Number(id)),
                    },
                };
            }
        }

        // Define date filter
        if (dateExact) {

            // Set date to exact date
            whereConditions.date = new Date(dateExact);
        } 
        
        // Check if other date filters are provided
        else {

            // Check if dateBefore is provided
            if (dateBefore) {

                // Set date to less than or equal to dateBefore
                whereConditions.date = { lte: new Date(dateBefore) };
            }

            // Check if dateAfter is provided
            if (dateAfter) {

                // Set date to greater than or equal to dateAfter
                whereConditions.date = { ...whereConditions.date, gte: new Date(dateAfter) };
            }
        }

        // Define containsText filter
        if (containsText) {

            // Add containsText to whereConditions
            whereConditions.OR = [

                // Check if text contains containsText in a case-insensitive mode
                { text: { contains: containsText, mode: "insensitive" } },
            ];
        }

        // Get total entries
        const totalEntries = await prisma.crawledData.count({ where: whereConditions });

        // Fetch data with pagination and filters
        const data = await prisma.crawledData.findMany({
            where: whereConditions,
            take: limit,
            skip: (page - 1) * limit,
            include: {
                SourceUrls: {
                    select: {
                        url: true,
                        Sources: {
                            select: { display_name: true },
                        },
                    },
                },
            },
            orderBy: { date: order },
        });

        // Calculate the total number of pages based on the total entries and limit
        const total = Math.ceil(totalEntries / limit);

        // Return data and total pages
        return { data, total };
    } 

    //  Catch errors
    catch (error) {
        // Log error message if something goes wrong
        logger.error("Error fetching filtered crawled data:", error);

        // Log the error
        console.error("Error fetching filtered crawled data:", error);

        // Return error message
        return { error: (error as Error).message };
    }
};
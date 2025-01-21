/**
 * CrawledData Service
 *
 * @module crawledDataService.ts
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

// Get CrawledData records with filters and pagination
export const getCrawledDataWithPaginationFilters = async (filters: FilterOptions): Promise<PaginationResult> => {

    // Destructure the filters from the input object
    const { page, limit, sourceId, dateBefore, dateAfter, dateExact, containsText } = filters;

    // Try to fetch data
    try {

        // Initialize an empty object for the WHERE conditions
        const whereConditions: any = {};

        // If a sourceId filter is provided, apply it to the SourceUrls table
        if (sourceId) {

            // Add the source_id filter to the SourceUrls table
            whereConditions.SourceUrls = {
                source_id: sourceId,
            };
        }

        // Add filters for the date field
        if (dateExact) {

            // If exact date is provided, filter by that date
            whereConditions.date = new Date(dateExact);

        } else {

            // If dateBefore filter is provided, filter by dates before that date
            if (dateBefore) {
                whereConditions.date = { lte: new Date(dateBefore) };  // Less than or equal to the provided date
            }

            // If dateAfter filter is provided, filter by dates after that date
            if (dateAfter) {
                whereConditions.date = { ...whereConditions.date, gte: new Date(dateAfter) };  // Greater than or equal to the provided date
            }
        }

        // If the containsText filter is provided, search the text field for that text (case insensitive)
        if (containsText) {

            // Add the containsText filter to the text field
            whereConditions.OR = [
                { text: { contains: containsText, mode: "insensitive" } },
            ];
        }

        // Count the total number of entries matching the filter conditions
        const totalEntries = await prisma.crawledData.count({ where: whereConditions });

        // Fetch the data based on the filter conditions, pagination, and ordering
        const data = await prisma.crawledData.findMany({
            where: whereConditions,
            take: limit,  // Limit the number of records per page
            skip: (page - 1) * limit,  // Skip records for pagination
            include: {
                SourceUrls: {
                    include: {
                        Sources: {
                            select: {
                                display_name: true,  // Select the display name of the related Source
                            },
                        },
                    },
                },
            },
            orderBy: { date: "desc" },  // Order the results by date in descending order
        });

        // Calculate the total number of pages based on the total entries and limit
        const total = Math.ceil(totalEntries / limit);

        // Log success message
        logger.info("Fetched filtered crawled data successfully.");

        // Return the paginated data and the total number of pages
        return { data, total };
    } 
    
    // Catch errors
    catch (error) {
        // Log error message if something goes wrong
        logger.error("Error fetching filtered crawled data:", error);

        // Return the error message
        return { error: (error as Error).message };
    }
};
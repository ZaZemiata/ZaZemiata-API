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

// Get limited CrawledData records based on pagination provided in query params
export const getCrawledDataPagination = async (page: number, limit: number): Promise<PaginationResult> => {

    // Try to fetch data
    try {
        // Get total records of crawled data
        const totalEntries = await prisma.crawledData.count();

        // Get data filtered by limit and page
        const data = await prisma.crawledData.findMany({
            take: limit,
            skip: (page - 1) * limit,

            // Include related SourceUrls and Sources
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

        // Calculate total pages
        const total = Math.ceil(totalEntries / limit);

        // Log success
        logger.info("Fetched filtered crawled data successfully.");

        // Return all crawled data
        return { data, total };
    }

    // Catch errors 
    catch (error) {

        // Log the error
        logger.error("Error fetching crawled data:", error);

        // Return error object
        return { error: (error as Error).message };
    }
};

// Get CrawledData records based on different filters
export const getCrawledDataWithFilters = async (filters: FilterOptions): Promise<PaginationResult> => {
    const { page, limit, РИОСВ, dateBefore, dateAfter, dateExact, containsText } = filters;

    try {
        const whereConditions: any = {};

        // Add РИОСВ filter if provided
        if (РИОСВ) {
            whereConditions.SourceUrls = {
                // Use `some` properly to filter the related Sources
                some: {
                    Sources: {
                        some: {
                            id: РИОСВ, // Search of ID 
                        },
                    },
                },
            };
        }

        // Add date filters
        if (dateExact) {
            whereConditions.date = new Date(dateExact);
        } else {
            if (dateBefore) {
                whereConditions.date = { lte: new Date(dateBefore) };
            }
            if (dateAfter) {
                whereConditions.date = { ...whereConditions.date, gte: new Date(dateAfter) };
            }
        }

        // Add text search filter if provided
        if (containsText) {
            whereConditions.OR = [
                { text: { contains: containsText, mode: "insensitive" } },
                { title: { contains: containsText, mode: "insensitive" } },
            ];
        }

        // Fetch total count of filtered data using the whereConditions
        const totalEntries = await prisma.crawledData.count({
            where: whereConditions,
        });

        // Fetch data based on the same where conditions
        const data = await prisma.crawledData.findMany({
            where: whereConditions,
            take: limit,
            skip: (page - 1) * limit,
            include: {
                SourceUrls: {
                    include: {
                        Sources: {
                            select: {
                                display_name: true,
                            },
                        },
                    },
                },
            },
            orderBy: { date: "desc" },
        });

        const total = Math.ceil(totalEntries / limit);
        logger.info("Fetched filtered crawled data successfully.");

        return { data, total };
    } catch (error) {
        logger.error("Error fetching filtered crawled data:", error);
        return { error: (error as Error).message };
    }
};





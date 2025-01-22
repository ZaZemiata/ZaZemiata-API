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

export const getCrawledDataWithPaginationFilters = async (filters: FilterOptions): Promise<PaginationResult> => {
    const { page, limit, sourceId, dateBefore, dateAfter, dateExact, containsText } = filters;

    try {
        const whereConditions: any = {};

        // Проверка за sourceId
        if (sourceId) {
            console.log(`Received sourceId query parameter:`, sourceId);

            let sourceIdArray: string[] = [];
            // Проверка дали sourceId е низ
            if (typeof sourceId === "string") {
                sourceIdArray = sourceId.split(',').map(id => id.trim());
            } else if (Array.isArray(sourceId)) {
                sourceIdArray = sourceId.map(id => id.toString());
            } else {
                sourceIdArray = [sourceId.toString()];
            }

            console.log(`Parsed sourceIdArray:`, sourceIdArray);

            // Филтриране на валидни sourceId
            const validSourceIds = sourceIdArray.filter(id => !isNaN(Number(id)) && id !== "");
            console.log(`Valid sourceIdArray:`, validSourceIds);

            // Приложи филтъра за source_id
            if (validSourceIds.length > 0) {
                whereConditions.SourceUrls = {
                    source_id: {
                        in: validSourceIds.map(id => Number(id)),
                    },
                };
            } else {
                console.log(`No valid sourceIds found.`);
            }
        } else {
            console.log(`No sourceId filter applied.`);
        }

        // Добавяне на останалите филтри
        if (dateExact) {
            console.log(`Filtering by exact date:`, dateExact);
            whereConditions.date = new Date(dateExact);
        } else {
            if (dateBefore) {
                console.log(`Filtering by date before:`, dateBefore);
                whereConditions.date = { lte: new Date(dateBefore) };
            }
            if (dateAfter) {
                console.log(`Filtering by date after:`, dateAfter);
                whereConditions.date = { ...whereConditions.date, gte: new Date(dateAfter) };
            }
        }

        if (containsText) {
            console.log(`Filtering by text containing:`, containsText);
            whereConditions.OR = [
                { text: { contains: containsText, mode: "insensitive" } },
            ];
        }

        console.log(`Final whereConditions object:`, whereConditions);

        const totalEntries = await prisma.crawledData.count({ where: whereConditions });
        console.log(`Total entries matching filters:`, totalEntries);

        const data = await prisma.crawledData.findMany({
            where: whereConditions,
            take: limit,
            skip: (page - 1) * limit,
            include: {
                SourceUrls: {
                    include: {
                        Sources: {
                            select: { display_name: true },
                        },
                    },
                },
            },
            orderBy: { date: "desc" },
        });

        const total = Math.ceil(totalEntries / limit);
        console.log("Fetched filtered crawled data successfully.");

        return { data, total };
    } catch (error) {
        console.error("Error fetching filtered crawled data:", error);
        return { error: (error as Error).message };
    }
};










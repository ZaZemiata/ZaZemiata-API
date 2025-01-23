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
    const { page, limit, sourceId, dateBefore, dateAfter, dateExact, containsText, order = "desc" } = filters;

    try {
        const whereConditions: any = {};

        // Проверка за sourceId
        if (sourceId) {
            let sourceIdArray: string[] = [];
            if (typeof sourceId === "string") {
                sourceIdArray = sourceId.split(',').map(id => id.trim());
            } else if (Array.isArray(sourceId)) {
                sourceIdArray = sourceId.map(id => id.toString());
            } else {
                sourceIdArray = [sourceId.toString()];
            }

            const validSourceIds = sourceIdArray.filter(id => !isNaN(Number(id)) && id !== "");
            if (validSourceIds.length > 0) {
                whereConditions.SourceUrls = {
                    source_id: {
                        in: validSourceIds.map(id => Number(id)),
                    },
                };
            }
        }

        // Добавяне на останалите филтри
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

        if (containsText) {
            whereConditions.OR = [
                { text: { contains: containsText, mode: "insensitive" } },
            ];
        }

        const totalEntries = await prisma.crawledData.count({ where: whereConditions });

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
            orderBy: { date: order }, // Включване на динамичен ред
        });

        const total = Math.ceil(totalEntries / limit);

        return { data, total };
    } catch (error) {
        console.error("Error fetching filtered crawled data:", error);
        return { error: (error as Error).message };
    }
};











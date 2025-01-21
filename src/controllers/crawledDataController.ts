/**
 * CrawledData controller
 *
 * @module crawledDataController.ts
 * @author Hristo Georgiev <hristogeorgiew84@gmail.com>
 * @author Daniel Batanov <batanoff.s@protonmail.com>
 */

// Import dependencies
import { Router, Request, Response } from "express";
import { getAllCrawledData, getCrawledDataWithPaginationFilters } from "../services/crawledDataService";
import { ErrorType } from "../types/errorType";
import logger from "../utils/logger";

// Create a new router
const router = Router();

/**
 * @endpoint GET /api/crawled-data
 * @description Fetch all CrawledData records with related SourceUrls and Sources.
 */
router.get("/api/crawled-data", async (req: Request, res: Response) => {

    // Try to fetch data
    try {
        // Call the service
        const data = await getAllCrawledData(req, res)

        logger.info("Fetched all crawled data successfully.");

        // Send response
        res.status(200).send(data)
    } 
    
    // Catch errors
    catch (error) {

        logger.error(error);

        // Log the error and respond with an error message
        res.status(500).send((error as ErrorType).message)
    }
});

/**
 * @endpoint GET /api/crawled-data
 * @description Fetch CrawledData records based on page and limit query params.
 */
router.get("/api/crawled-data/filter", async (req: Request, res: Response) => {
    try {
        // Extract query parameters
        const { page, limit, sourceId, dateBefore, dateAfter, dateExact, containsText } = req.query;

        // Convert query parameters to expected types
        const filters = {
            page: Number(page) || 1,
            limit: Number(limit) || 10,
            sourceId: sourceId ? Number(sourceId) : undefined, // Change here
            dateBefore: dateBefore ? String(dateBefore) : undefined,
            dateAfter: dateAfter ? String(dateAfter) : undefined,
            dateExact: dateExact ? String(dateExact) : undefined,
            containsText: containsText ? String(containsText) : undefined,
        };

        // Call the service with filters and pagination
        const result = await getCrawledDataWithPaginationFilters(filters);

        // Check if an error occurred
        if ('error' in result) 
            throw new Error(result.error);

        // Send response with data and pagination info
        res.status(200).send({
            status: 'success',
            pagination: {
                totalPages: result.total,
                currentPage: filters.page,
            },
            data: result.data,
        });
    } 
    
    // Catch errors
    catch (error) {

        // Log the error
        logger.error("Error fetching filtered crawled data:", error);

        // Send a bad request response
        res.status(400).send({
            status: 'error',
            message: (error as ErrorType).message,
        });
    }
});

// Export the router
export default router;
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
router.get("/api/crawled-data/filter", async (req: any, res: any) => {

    // Try to fetch data
    try {

        // List of allowed query parameters for filtering and pagination
        const validParams = ['page', 'limit', 'sourceId', 'dateBefore', 'dateAfter', 'dateExact', 'containsText', 'order'];
        const validOrder = ["asc", "desc"]; // Allowed values for sorting order

        // Check for invalid query parameters in the request
        const invalidParams = Object.keys(req.query).filter(param => !validParams.includes(param));

        // Params length check
        if (invalidParams.length > 0) {

            // If there are invalid parameters, return an error response
            return res.status(400).send({
                status: 'error',
                message: `Invalid query parameters: ${invalidParams.join(', ')}`,
            });
        }

        // Extract query parameters from the request
        const { page, limit, sourceId, dateBefore, dateAfter, dateExact, containsText, order } = req.query;

        // Convert query parameters to expected types
        const filters = {
            
            // Default to 1 if `page` is not provided
            page: Number(page) || 1,

            // Default to 10 if `limit` is not provided
            limit: Number(limit) || 10,

            // Convert `sourceId` to an array of numbers if it's a string or an array
            sourceId: sourceId 
                ? (typeof sourceId === 'string' 
                    ? sourceId.split(',').map((id: string) => Number(id)) // Split comma-separated IDs and convert to numbers
                    : Array.isArray(sourceId) 
                    ? sourceId.map((id: any) => Number(id)) // Convert array of IDs to numbers
                    : undefined) 
                : undefined,

            // Convert `dateBefore` to string if provided
            dateBefore: dateBefore ? String(dateBefore) : undefined, 

            // Convert `dateAfter` to string if provided
            dateAfter: dateAfter ? String(dateAfter) : undefined,

            // Convert `dateExact` to string if provided
            dateExact: dateExact ? String(dateExact) : undefined,

            // Convert `containsText` to string if provided
            containsText: containsText ? String(containsText) : undefined, 

            // Validate `order` and default to "desc" if invalid
            order: validOrder.includes(order) ? order : "desc", 
        };

        // Convert sourceId to a comma-separated string if it's an array of numbers
        const finalSourceId = Array.isArray(filters.sourceId) ? filters.sourceId.join(',') : filters.sourceId;

        // Call the service to fetch filtered data with pagination
        const result = await getCrawledDataWithPaginationFilters({
            ...filters,
            sourceId: finalSourceId,
        });

        // Check if the service returned an error
        if ('error' in result) throw new Error(result.error);

        // Send the response with filtered data and pagination info
        res.status(200).send({
            status: 'success',
            pagination: {
                totalPages: result.total, // Total number of pages available
                currentPage: filters.page, // Current page number
            },
            data: result.data, // Filtered crawled data
        });
    } 
    
    } 
    
    // Catch errors
    catch (error) {

        // Handle any errors that occur during processing
        res.status(400).send({
            status: 'error',
            message: (error as ErrorType).message, // Return the error message to the client
        });
    }
});

// Export the router
export default router;
/**
 * CrawledData controller
 *
 * @module crawledDataController.ts
 * @author Hristo Georgiev <hristogeorgiew84@gmail.com>
 * @author Daniel Batanov <batanoff.s@protonmail.com>
 */

// Import dependencies
import { Router, Request, Response } from "express";
import { getAllCrawledData, getCrawledDataPagination } from "../services/crawledDataService";
import { ErrorType } from "../types/errorType";

// Create a new router
const router = Router();

/**
 * @endpoint GET /api/crawled-data
 * @description Fetch all CrawledData records with related SourceUrls and Sources.
 */
router.get("/api/crawled-data", async (req: Request, res: Response) => {

    try {
        // Call the service
        const data = await getAllCrawledData(req, res)

        // Send response
        res.status(200).send(data)
    } catch (error) {
        // Log the error and respond with an error message
        res.status(500).send((error as ErrorType).message)
    }
});

/**
 * @endpoint GET /api/crawled-data
 * @description Fetch CrawledData records based on page and limit query params.
 */
router.get("/api/crawled-data/filter", async (req: Request, res: Response) => {
    // Define default variables
    let currentPage = 1;
    let currentLimit = 10;

    // Get query params
    const {page, limit} = req.query;

    try {
        // Validate if query params are negative or zero
        if (isNaN(Number(page)) && Number(page) < 1) throw new Error("Page must be a positive number, greater or equal to 1!");
        if (isNaN(Number(limit)) && Number(limit) < 1) throw new Error("Limit must be a positive number, greater or equal to 1!");

        // Update default params with provided query params
        currentPage = Number(page ?? currentPage);
        currentLimit = Number(limit ?? currentLimit);

        // Call the service for pagination
        const result = await getCrawledDataPagination(currentPage, currentLimit);

        // Check total value and set default
        const totalPages = result.total ?? 1;

        // Check if current page is greater then total pages
        if (currentPage > totalPages) throw new Error("Current page is greater than total pages!");

        // Define prev and next constants, 
        // TODO update "http://localhost:3000/" with env variable
        const next = currentPage < totalPages ? `http://localhost:3000/api/crawled-data/paginated?page=${currentPage + 1}&limit=${currentLimit}` : null;
        const prev = currentPage > 1 && currentPage <= totalPages ? `http://localhost:3000/api/crawled-data/paginated?page=${currentPage - 1}&limit=${currentLimit}` : null;

        // Create pagination metadata
        const pagination = {
            totalPages,
            currentPage,
            next,
            prev
        };

        // Send response
        res.status(200).send({
            status: 'success',
            pagination,
            data: result.data
        });
    }
    catch (error) {
        // Log the error and respond with an error message
        res.status(400).send({
                status: 'error',
                error: (error as ErrorType).message
        })
    }
});

// Export the router
export default router;


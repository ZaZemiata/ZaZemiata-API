/**
 * CrawledData controller
 *
 * @module crawledDataController.ts
 * @author Hristo Georgiev <hristogeorgiew84@gmail.com>
 */

// Import dependencies
import { Router, Request, Response } from "express";
import { getAllCrawledData } from "../services/crawledDataService";
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

// Export the router
export default router;


/**
 * CrawledData controller
 *
 * @module crawledDataController.ts
 * @author Hristo Georgiev <hristogeorgiew84@gmail.com>
 */

// Import dependencies
import express from "express";
import { getAllCrawledData } from "../services/crawledDataService";

// Create a new router
const router = express.Router();

/**
 * @endpoint GET /api/crawled-data
 * @description Fetch all CrawledData records with related SourceUrls and Sources.
 */
router.get("/api/crawled-data", getAllCrawledData);

// Export the router
export default router;

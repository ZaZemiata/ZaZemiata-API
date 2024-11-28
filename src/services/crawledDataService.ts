/**
 * CrawledData Service
 *
 * @module crawledDataService.ts
 * @author Hristo Georgiev <hristogeorgiew84@gmail.com>
 */

import prisma from "../db/prisma/prisma";
import { Request, Response } from "express";

// Get all CrawledData records with related SourceUrls and Sources
export const getAllCrawledData = async (req: Request, res: Response) => {
  try {
    // Get all crawled data from database
    const crawledData = await prisma.crawledData.findMany();

    // Send the crawled data as a response
    res.json(crawledData);
  } catch (error) {
    
    console.error("Error fetching crawled data:", error);
    res.status(500).json({ message: "Failed to fetch crawled data." });
  }
};

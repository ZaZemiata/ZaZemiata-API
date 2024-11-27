/**
 * KeyWords Service
 * 
 * @module keyWords.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

import prisma from '../db/prisma/prisma';
import { Request, Response } from 'express';

// Get all keywords
export const getAllKeywords = async (req: Request, res: Response) => {

    // Get all keywords from the database
    const keywords = await prisma.keyWords.findMany();

    // Send the keywords as a response
    res.json(keywords);
};
/**
 * Source Service
 * 
 * @module source.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

import prisma from '../db/prisma/prisma';
import { Request, Response } from 'express';

// Get all keywords
export const getAllSources = async (req: Request, res: Response) => {

    // Get all sources from the database
    const sources = await prisma.sources.findMany();
    
    // Send the sources as a response
    res.json(sources);
};
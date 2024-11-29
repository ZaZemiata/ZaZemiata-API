/**
 * SourceUrls Service
 * 
 * @module sourceUrlsService.ts
 * @author Geno Popov <geno_popov@yahoo.com>
 */

import prisma from '../db/prisma/prisma';
import { Request, Response } from 'express';

export const updateSourceUrlActiveStatus = async (req: Request, res: Response) => {

    const { id } = req.params; 
    const { active } = req.body; 

    try {

        const updatedSourceUrl = await prisma.sourceUrls.update({
            where: { id: Number(id) },
            data: { active },
        });

        res.json({

            message: "SourceUrl active status updated successfully.",
            sourceUrl: updatedSourceUrl,
        });

    } catch (error) {

        console.error("Error updating SourceUrl active status:", error);
        res.status(500).json({ message: "Failed to update SourceUrl active status." });
    }
};

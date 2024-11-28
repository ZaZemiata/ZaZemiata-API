/**
 * KeyWords Service
 * 
 * @module keyWordService.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

import prisma from '../db/prisma/prisma';
import { Request, Response } from 'express';
import { KeyWords } from '@prisma/client';
import { errorHandler } from '../utils/errorHandler';


// Get all keywords
export const getAllKeywords = async (req: Request, res: Response) => {

    // Get all keywords from the database
    const keywords = await prisma.keyWords.findMany();

    // Send the keywords as a response
    res.json(keywords);
};


export const updateKeyWord = async (body: KeyWords) => {


    try {

        //Error handling
        errorHandler(body, "UPDATE")

        //Update keyword
        await prisma.keyWords.update({
            // Specify the unique identifier
            where: {
                id: body.id,
            },
            //New values
            data: {
                word: body.word,
                priority: body.priority,
                active: body.active,
            },
        });

    } catch (error) {

        //Catching error and return message
        throw error
        
    }

}


export const createKeyWord = async (body: KeyWords) => {
    try {

        //Error handling
        errorHandler(body, "CREATE")

        //Create keyword
        await prisma.keyWords.create({
            data:
            {
                word: body.word,
                priority: body.priority,
                active: body.active,
                created_at: new Date()
            }
        });

    } catch (error) {

        //Catching error and return message
        throw error

    }

}
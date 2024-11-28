/**
 * KeyWords Service
 * 
 * @module keyWords.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

import prisma from '../db/prisma/prisma';
import { Request, Response } from 'express';
import { KeyWordType } from '../types/keywordType';


// Get all keywords
export const getAllKeywords = async (req: Request, res: Response) => {

    // Get all keywords from the database
    const keywords = await prisma.keyWords.findMany();

    // Send the keywords as a response
    res.json(keywords);
};


export const updateKeyWord = async (body: KeyWordType) => {
    try {

        await prisma.keyWords.update({
            where: {
                id: Number(body.id), // Specify the unique identifier
            },
            data: {  //New values
                word: body.word,
                priority: body.priority,
                active: body.active,
            },
        });

    } catch (error) {

        //Catching error and return message
        throw { message: "An error occurred during the request" }

    }

}


export const createKeyWord = async (body: KeyWordType) => {
    try {
        
        //Creating keyword
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
        throw { message: "An error occurred during the request" }

    }

}
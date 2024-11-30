/**
 * KeyWords Service
 * 
 * @module keyWordService.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

import prisma from '../db/prisma/prisma';
import { Request, Response } from 'express';
import { KeyWords } from '@prisma/client';

// Get all keywords
export const getAllKeywords = async () => {
    try {

        // Get all keywords from the database
        const keywords = await prisma.keyWords.findMany();

        // Return all keywords
        return keywords

    } catch (error) {

        //Catching error and return message
        throw error

    }
};


export const updateKeyWord = async (body: KeyWords) => {

    try {

        //Update keyword
        const res = await prisma.keyWords.update({
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

        //Send the keyword as a response
        return res

    } catch (error) {

        //Catching error and return message
        throw error

    }

}


export const createKeyWord = async (body: KeyWords) => {
    try {

        //Create keyword
        const res = await prisma.keyWords.create({
            data:
            {
                word: body.word,
                priority: body.priority,
                active: body.active,
                created_at: new Date()
            }
        });


        //Send the keyword as a response
        return res

    } catch (error) {

        //Catching error and return message
        throw error

    }

}
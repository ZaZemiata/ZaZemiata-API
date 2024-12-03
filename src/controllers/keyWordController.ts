/**
 * KeyWords controller
 * 
 * @module keyWordController.ts
 * @author vadiim  <vadim123bg@gmail.com>
 */

// Import dependencies
import { Router, Request, Response } from 'express';
import { getAllKeywords, updateKeyWord, createKeyWord } from '../services/keyWordService';
import { KeyWords, Priority } from '@prisma/client';
import { ErrorType } from '../types/errorType';
import { isAuthenticated } from '../middlewares/middleware';

// Create a new router
const router = Router();

//Endpoints

//Get all keywords
router.get('/api/keywords', async (req: Request, res: Response) => {

    //Prepare for errors
    try {

        //Get all keywords
        const data = await getAllKeywords();

        //Send response
        res.status(200).send(data)
    } 
    
    //Catch errors
    catch (error) {

        //Catching error and return message
        res.status(500).send((error as ErrorType).message)
    }
});

//Update keywords
router.patch('/api/keyword/update', async (req: Request, res: Response) => {

    // Prepare for errors
    try {

        //Get a keyword from request
        const keyword: KeyWords = req.body

        // Missing id
        if (!keyword.id)
            throw Error('No such ID exists in the database!')

        // Invalid ID
        if (isNaN(Number(keyword.id)) || (typeof keyword.id !== 'number' && typeof keyword.id !== 'bigint'))
            throw Error('Invalid ID type, ID must be a number!');

        // Check priority type
        if (keyword.priority && ![Priority.CRITICAL, Priority.HIGH, Priority.LOW, Priority.MEDIUM].includes(keyword.priority))
            throw Error('Invalid PRIORITY type!')

        // Check active type
        if (keyword.active && typeof keyword.active != 'boolean')
            throw Error(`Invalid 'active' type, 'active' cant be this type!`)

        //Update keyword
        const data = await updateKeyWord(keyword)

        //Send response
        res.status(200).send(data)

    }

    // Catch errors
    catch (error) {

        //Catching error and return message
        res.status(500).send((error as ErrorType).message)
    }
})

//Create keyword
router.post('/api/keyword/add', async (req: Request, res: Response) => {

    try {

        //Get a keyword from request
        const keyword: KeyWords = req.body

        // Missing priority
        if (!keyword.priority)
            throw Error(`Empty 'priority' field!`)

        // Missing word
        if (!keyword.word)
            throw Error(`Empty 'word' field!`)

        // Invalid priority type
        if (keyword.priority && ![Priority.CRITICAL, Priority.HIGH, Priority.LOW, Priority.MEDIUM].includes(keyword.priority))
            throw Error('Invalid PRIORITY type!')

        // Invalid active type or missing
        if (!keyword.active || typeof keyword.active !== 'boolean')
            throw Error(`Invalid 'active' type!`)

        //Create keyword
        const data = await createKeyWord(keyword)

        //  Send response
        res.status(200).send(data)

    }

    // Catch errors
    catch (error) {

        //Catching error and return message
        res.status(500).send((error as ErrorType).message)
    }
})

// Export the router
export default router;
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
        if (!keyword.id) {
            res.status(400).send({ error: 'No such ID exists in the database!' });
            return;
        }

        // Invalid ID
        if (isNaN(Number(keyword.id)) || (typeof keyword.id !== 'number' && typeof keyword.id !== 'bigint')) {
            res.status(400).send({ error: 'ID must be a number!' });
            return;
        }


        // Check priority type
        if (keyword.priority && ![Priority.CRITICAL, Priority.HIGH, Priority.LOW, Priority.MEDIUM].includes(keyword.priority)) {
            res.status(400).send({ error: 'Invalid PRIORITY type!' });
            return;
        }

        // Check active type
        if (keyword.active && typeof keyword.active != 'boolean') {
            res.status(400).send({ error: 'Invalid "active" type!' });
            return;
        }

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
        if (!keyword.priority) {
            res.status(400).send({ error: 'Missing "priority" field!' });
            return;
        }

        // Missing word
        if (!keyword.word) {
            res.status(400).send({ error: 'Missing "word" field!' });
            return;
        }

        // Invalid priority type
        if (keyword.priority && ![Priority.CRITICAL, Priority.HIGH, Priority.LOW, Priority.MEDIUM].includes(keyword.priority)) {
            res.status(400).send({ error: 'Invalid PRIORITY type!' });
            return;
        }

        // Invalid active type or missing
        if (!keyword.active || typeof keyword.active !== 'boolean') {
            res.status(400).send({ error: 'Invalid "active" type!' });
            return;
        
        }
        //Create keyword
        const data = await createKeyWord(keyword)

        //  Send response
        res.status(200).send(data);
    }

    // Catch errors
    catch (error) {

        //Catching error and return message
        res.status(500).send((error as ErrorType).message);
    }
})

// Export the router
export default router;
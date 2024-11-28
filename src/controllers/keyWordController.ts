/**
 * KeyWords controller
 * 
 * @module keyWordController.ts
 * @author vadiim  <vadim123bg@gmail.com>
 */

// Import dependencies
import { Router, Request, Response } from 'express';
import { getAllKeywords, updateKeyWord, createKeyWord } from '../services/keyWordService';
import { KeyWords } from '@prisma/client';
import { ErrorType } from '../types/errorType';

// Create a new router
const router = Router();

//Endpoints

//Get all keywords
router.get('/api/keywords', getAllKeywords);

//Update keyword
router.post("/api/keyword/update", async (req: Request, res: Response) => {
    try {

        //Get a keyword from request
        const keyword: KeyWords = req.body

        //Update keyword
        await updateKeyWord(keyword)

        res.send({ updated: true })

    } catch (error) {
        res.send((error as ErrorType).message)
    }
})

//Create keyword

router.post("/api/keyword/add", async (req: Request, res: Response) => {

    try {

        //Get a keyword from request
        const keyword: KeyWords = req.body

        //Create keyword
        await createKeyWord(keyword)

        res.send({ created: true })


    } catch (error) {
        res.send((error as ErrorType).message)
    }

})


// Export the router
export default router;
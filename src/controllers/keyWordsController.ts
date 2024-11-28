/**
 * KeyWords controller
 * 
 * @module keyWords.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

// Import dependencies
import express from 'express';
import { getAllKeywords, updateKeyWord, createKeyWord } from '../services/keyWordsService';
import { KeyWordType } from '../types/keywordType';
import { ErrorType } from '../types/ErrorType';

// Create a new router
const router = express.Router();

//Endpoints

//Get all keywords
router.get('/api/keywords', getAllKeywords);

//Update keyword
router.post("/api/keywords", async (req: express.Request, res: express.Response) => {
    try {

        //Get a keyword from request
        const keyword: KeyWordType = req.body

        //Update keyword
        await updateKeyWord(keyword)

        res.send({ updated: true })

    } catch (error) {
        res.send((error as ErrorType).message)
    }
})

//Create keyword

router.post("/api/keyword", async (req: express.Request, res: express.Response) => {

    try {

        //Get a keyword from request
        const keyword: KeyWordType = req.body

        //Create keyword
        await createKeyWord(keyword)

        res.send({ created: true })


    } catch (error) {
        res.send((error as ErrorType).message)
    }

})


// Export the router
export default router;
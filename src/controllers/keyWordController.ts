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
router.get('/api/keywords', getAllKeywords);

//Update keyword
router.patch("/api/keyword/update", async (req: Request, res: Response) => {
    try {

        //Get a keyword from request
        const keyword: KeyWords = req.body

        if (!keyword.id) throw Error("No such ID exists in the database!")

        if (isNaN(Number(keyword.id)) && typeof (keyword.id) != "number" && typeof keyword.id != typeof BigInt) throw Error("Invalid ID type, ID cant be this type!")

        if (keyword.priority && ![Priority.CRITICAL, Priority.HIGH, Priority.LOW, Priority.MEDIUM].includes(keyword.priority)) throw Error("Invalid PRIORITY type, PRIORITY cant be this type!")

        if (keyword.active && typeof keyword.active != "boolean") throw Error(`Invalid "active" type, "active" cant be this type!`)

        //Update keyword

        const data = await updateKeyWord(keyword)

        //Send response
        res.status(200).send(data)

    } catch (error) {

        //Catching error and return message
        res.status(500).send((error as ErrorType).message)

    }
})

//Create keyword

router.post("/api/keyword/add", async (req: Request, res: Response) => {

    try {

        //Get a keyword from request
        const keyword: KeyWords = req.body

        //Checking for empty fields and wrong values

        if (!keyword.priority) throw Error(`Empty "priority" field!`)

        if (!keyword.word) throw Error(`Empty "word" field!`)

        if (!keyword.active) throw Error(`Empty "active" field!`)

        if (keyword.priority && ![Priority.CRITICAL, Priority.HIGH, Priority.LOW, Priority.MEDIUM].includes(keyword.priority)) throw Error("Invalid PRIORITY type, PRIORITY cant be this type!")

        if (typeof keyword.active !== "boolean") throw Error(`Invalid "active" type, "active" cant be this type!`)

        //Create keyword
        const data = await createKeyWord(keyword)

        //  Send response
        res.status(200).send(data)

    } catch (error) {

        //Catching error and return message
        res.status(500).send((error as ErrorType).message)

    }

})


// Export the router
export default router;
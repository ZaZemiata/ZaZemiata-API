/**
 * Authentication controller
 *
 * @module authController.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

//Import dependencies
import { Router, Request, Response } from 'express';
import { registerUser, loginUser, getUser, checkPassword } from '../services/authService';
import { ErrorType } from '../types/errorType';

//Create a router
const router = Router();

//Register endpoint
router.post("/register", async (req: Request, res: Response) => {

    //Get a user from request
    const { email, password, repassword } = req.body

    try {

        //Check fields
        if (!email || !password || !repassword) throw Error("Empty fields!")

        //Check email is unique
        const isUnique: any = await getUser(email);

        if (isUnique) throw Error("Email already exists!")

        //Check password
        if (repassword !== password) throw Error("Passwords do not match!")


        //Register user
        const data = await registerUser(email, password)

        //Send response
        res.status(200).setHeader("token", data.token).send(data)

    } catch (error) {

        //Catching error and return message
        res.status(500).send((error as ErrorType).message)

    }
})

//Login endpoint
router.post("/login", async (req: Request, res: Response) => {

    const { email, password } = req.body

    try {

        //Check fields

        if (!email || !password) throw Error("Empty fields!")

        //Check email exists
        const user = await getUser(email)

        if (!user) throw new Error("Invalid email!")

        //Check password
        const isValid = await checkPassword(password, user.password)

        if (!isValid) throw new Error("Invalid password!")

        //Login user
        const data = await loginUser(user.id.toString());

        //Send response
        res.status(200).setHeader("token", data.token).send(data)

    } catch (error) {

        //Catching error and return message
        res.status(500).send((error as ErrorType).message)


    }
})

//Export router
export default router;

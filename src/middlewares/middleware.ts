/**
 * Middlewares
 *
 * @module middleware.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

//Import dependencies
import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import jwt from "../utils/jwt";

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //Get token
        const token = req.headers["token"]

        //Check token
        if (!token) {
            throw Error("Invalid token!")
        }



        //Decode token
        const decodedToken = await jwt.verify(token, config.SECRET);
        next()

    } catch (error) {

        //Throw error
        throw Error("Invalid token!")

    }

}

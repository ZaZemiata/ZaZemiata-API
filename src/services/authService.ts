/**
 * Authentication Service
 *
 * @module authService.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

//Import dependencies
import bcrypt from "bcrypt"
import jwt from "../utils/jwt";
import prisma from "../db/prisma/prisma";

import { User } from "@prisma/client";

//Register user
export const registerUser = async (email: string, password: string) => {

    //Hash password
    const salt = await bcrypt.genSalt();
    const saltedHash = await bcrypt.hash(password, salt);

    //Create user
    const createdUser: User = await prisma.user.create({ data: { email, password: saltedHash, createdAt: new Date() } });

    //Create token
    const token = await createToken(createdUser.id.toString());

    //Return token
    return {
        token
    }
}

//Get user
export const getUser = async (email: string) => { return await prisma.user.findUnique({ where: { email: email } }) }

//Create token
const createToken = (id: string) => jwt.sign({ userId: id }, process.env.SECRET , { expiresIn: "30d" })

//Check password
export const checkPassword = async (currentPassword: string, hashedPassword: string) => { return await bcrypt.compare(currentPassword, hashedPassword); }

//Login user
export const loginUser = async (id: string) => {


    //Create token
    const token = await createToken(id);

    //Return token
    return {
        token
    }
}


/**
 * Authentication Service
 *
 * @module authService.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

//Import dependencies
import bcrypt from "bcrypt";
import { sign } from "../utils/jwt";
import prisma from "../db/prisma/prisma";
import { Users } from "@prisma/client";
import logger from "../utils/logger";

// Register user
export const registerUser = async (email: string, password: string) => {

    // Get salt
    const salt = await bcrypt.genSalt();

    // Hash password
    const saltedHash = await bcrypt.hash(password, salt);

    // Create user
    const createdUser: Users = await prisma.users.create({ data: { email, password: saltedHash, created_at: new Date() } });

    // Create token
    const token = await createToken(createdUser.id.toString());

    // Return token
    return { token };
};

// Get user
export const getUser = async (email: string) => {

    // Return user
    return await prisma.users.findUnique({ where: { email } });
};

// Create token
const createToken = (id: string) => {

    // Get secret
    const secret = process.env.SECRET;

    // Check secret
    if (!secret) throw new Error("JWT Secret not set in environment variables!");

    // Return token
    return sign({ userId: id }, secret, { expiresIn: "30d" });
};

// Check password
export const checkPassword = async (currentPassword: string, hashedPassword: string) => {

    // Return comparison
    return await bcrypt.compare(currentPassword, hashedPassword);
};

// Login user
export const loginUser = async (id: string) => {
    
    // Create token
    const token = await createToken(id);

    // Check if user is admin
    const is_admin = await isUserAdmin(parseInt(id));
    
    // Return token and is_admin
    return { token, is_admin };
};

export const isUserAdmin = async (userId: number) => {
    
    // Get user
    const user = await prisma.users.findUnique({ where: { id: userId } });

    // Check user
    if (!user) throw new Error("User not found!");

    // Return user
    return user.is_admin;
}
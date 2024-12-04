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
import { User } from "@prisma/client";

// Register user
export const registerUser = async (email: string, password: string) => {

    // Get salt
    const salt = await bcrypt.genSalt();

    // Hash password
    const saltedHash = await bcrypt.hash(password, salt);

    // Create user
    const createdUser: User = await prisma.user.create({ data: { email, password: saltedHash, createdAt: new Date() } });

    // Create token
    const token = await createToken(createdUser.id.toString());

    // Return token
    return { token };
};

// Get user
export const getUser = async (email: string) => {

    // Return user
    return await prisma.user.findUnique({ where: { email } });
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

    // Return token
    return { token };
};
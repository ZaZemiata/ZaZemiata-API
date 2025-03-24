/**
 * Users Service
 *
 * @module usersService.ts
 * @author Daniel Batanov <batanoff.s@protonmail.com>
 */

import prisma from "../db/prisma/prisma";
import logger from "../utils/logger"; // Import winston logger

// Get all users
export const getAll = async () => {

    // Try to fetch data
    try {
        // Get all users from db
        const users = await prisma.users.findMany({ orderBy: { id: "asc" } });

        // Log success
        logger.info("Fetched all users successfully.");

        // return all users
        return users;
    } catch (error) {

        // Rethrow the error
        throw error;
    }
};

// Toggle user status
export const toggleStatus = async (userId: number | bigint) => {

    // Try to update user status
    try {

        // Get user data by id
        const userData = await prisma.users.findUnique({ where: { id: userId } });

        // Check if user exists
        if (!userData) throw new Error(`User with id ${userId} not found.`);

        // Set user active status to false
        userData.active = userData.active ? false : true;

        // Update user in db
        await prisma.users.update({
            where: { id: userId },
            data: userData,
        });

        // Log success
        logger.info(`User ${userId} updated successfully.`);

        // Return user
        return userData;
    } 
    
    // Catch errors
    catch (error: any) {
       
        // Rethrow the error
        throw error;
    }
};

// Delete user
export const deleteUser = async (userId: number | bigint) => {
    // Try to delete user
    try {
        // Check if user exists
        const userData = await prisma.users.findUnique({ where: { id: userId } });
        
        // Check if user exists
        if (!userData) throw new Error(`User with id ${userId} not found.`);

        // Check if user is admin
        if (userData.is_admin) throw new Error(`Cannot delete admin user.`);

        // Delete user from db
        const deletedUser = await prisma.users.delete({
            where: { id: userId }
        });

        // Log success
        logger.info(`User ${userId} deleted successfully.`);

        // Return deleted user
        return deletedUser;
    } 
    catch (error: any) {
        // Log error
        logger.error(`Error deleting user ${userId}:`, error);
        
        // Rethrow the error
        throw error;
    }
};

/**
 * Authentication controller
 *
 * @module authController.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

//Import dependencies
import { Router, Request, Response } from 'express';
import { registerUser, loginUser, getUser, checkPassword } from '../services/authService';
import logger from '../utils/logger';
import { isAdmin } from '../middlewares/isAdmin';

//Create a router
const router = Router();

//Register endpoint
router.post('/register', isAdmin, async (req: Request, res: Response) => {

    // Get email, password and repassword from request body
    const { email, password, repassword } = req.body;

    // Try to register user
    try {

        // Check if any of the fields are missing
        if (!email || !password || !repassword) {

            // Log error message
            logger.warn('Register failed: Missing fields in request');

            // Send error message
            res.status(400).send({ message: 'All fields are required!' });

            // Exit the function
            return;
        }

        // Check if email is in valid format
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {

            // Log error message
            logger.warn(`Register failed: Invalid email format - ${email}`);

            // Send error message
            res.status(400).send({ message: 'Invalid email format!' });

            // Exit the function
            return;
        }

        // Check if password and repassword match
        if (password !== repassword) {

            // Log error message
            logger.warn('Register failed: Passwords do not match');

            // Send error message
            res.status(400).send({ message: 'Passwords do not match!' });

            // Exit the function
            return; 
        }

        // Check if email is unique
        const isUnique = await getUser(email);

        // If email is not unique, send error message
        if (isUnique) {

            // Log error message
            logger.warn(`Register failed: Email already exists - ${email}`);

            // Send error message
            res.status(409).send({ message: 'Email already exists!' });

            // Exit the function
            return; 
        }

        // Register user
        const data = await registerUser(email, password);

        // Log success message
        logger.info(`User registered successfully: ${email}`);

        // Send response
        res.status(201).setHeader('Authorization', `Bearer ${data.token}`).send(data);
    } 
    
    // Catch errors
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Register error: ${errorMessage}`);
        res.status(500).send({ message: 'An internal error occurred. Please try again later.' });
    }
});

//Login endpoint
router.post('/login', async (req: Request, res: Response) => {

    // Get email and password from request body
    const { email, password } = req.body;

    // Try to login user
    try {

        // Check if any of the fields are missing
        if (!email || !password) {

            // Log error message
            logger.warn('Login failed: Missing fields in request');

            // Send error message
            res.status(400).send({ message: 'All fields are required!' });

            // Exit the function
            return;
        }

        // Get user by email
        const user = await getUser(email);

        // If user is not found, send error message
        if (!user) {

            // Log error message
            logger.warn(`Login failed: User not found - ${email}`);

            // Send error message
            res.status(401).send({ message: 'Invalid email or password!' });

            // Exit the function
            return;
        }

        // Check if password is valid
        const isValid = await checkPassword(password, user.password);

        // If password is not valid, send error message
        if (!isValid) {

            // Log error message
            logger.warn(`Login failed: Invalid password - ${email}`);

            // Send error message
            res.status(401).send({ message: 'Invalid email or password!' });

            // Exit the function
            return; 
        }

        // Generate token
        const data = await loginUser(user.id.toString());

        // Log success message
        logger.info(`User logged in successfully: ${email}`);

        // Send response with token
        res.status(200).setHeader('Authorization', `Bearer ${data.token}`).send(data);
    } 
    
    // Catch errors
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Login error: ${errorMessage}`);
        res.status(500).send({ message: 'An internal error occurred. Please try again later.' });
    }
});

//Export router
export default router;
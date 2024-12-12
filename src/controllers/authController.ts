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

//Create a router
const router = Router();

//Register endpoint
router.post('/register', async (req: Request, res: Response) => {
    const { email, password, repassword } = req.body;

    try {
        if (!email || !password || !repassword) {
            logger.warn('Register failed: Missing fields in request');
            res.status(400).send({ error: 'All fields are required!' });
            return;
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            logger.warn(`Register failed: Invalid email format - ${email}`);
            res.status(400).send({ error: 'Invalid email format!' });
            return;
        }

        if (password !== repassword) {
            logger.warn('Register failed: Passwords do not match');
            res.status(400).send({ error: 'Passwords do not match!' });
            return; 
        }

        const isUnique = await getUser(email);

        if (isUnique) {
            logger.warn(`Register failed: Email already exists - ${email}`);
            res.status(409).send({ error: 'Email already exists!' });
            return; 
        }

        const data = await registerUser(email, password);
        logger.info(`User registered successfully: ${email}`);
        res.status(201).setHeader('Authorization', `Bearer ${data.token}`).send(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Register error: ${errorMessage}`);
        res.status(500).send({ error: 'An internal error occurred. Please try again later.' });
    }
});

//Login endpoint
router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            logger.warn('Login failed: Missing fields in request');
            res.status(400).send({ error: 'All fields are required!' });
            return;
        }

        const user = await getUser(email);

        if (!user) {
            logger.warn(`Login failed: User not found - ${email}`);
            res.status(401).send({ error: 'Invalid email or password!' });
            return;
        }

        const isValid = await checkPassword(password, user.password);

        if (!isValid) {
            logger.warn(`Login failed: Invalid password - ${email}`);
            res.status(401).send({ error: 'Invalid email or password!' });
            return; 
        }

        const data = await loginUser(user.id.toString());
        logger.info(`User logged in successfully: ${email}`);
        res.status(200).setHeader('Authorization', `Bearer ${data.token}`).send(data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error(`Login error: ${errorMessage}`);
        res.status(500).send({ error: 'An internal error occurred. Please try again later.' });
    }
});

//Export router
export default router;

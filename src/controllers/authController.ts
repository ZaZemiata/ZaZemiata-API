/**
 * Authentication controller
 *
 * @module authController.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

//Import dependencies
import { Router, Request, Response } from 'express';
import { registerUser, loginUser, getUser, checkPassword } from '../services/authService';

//Create a router
const router = Router();

//Register endpoint
router.post('/register', async (req: Request, res: Response) => {

    //Get a user from request
    const { email, password, repassword } = req.body;

    // Prepare for errors
    try {

        // Check fields
        if (!email || !password || !repassword) {
            res.status(400).send({ error: 'All fields are required!' });
            return;
        }

        // Check email format
        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            res.status(400).send({ error: 'Invalid email format!' });
            return
        }

        // Check password confirmation
        if (password !== repassword) {
            res.status(400).send({ error: 'Passwords do not match!' });
            return; 
        }

        // Check email is unique
        const isUnique = await getUser(email);

        // Check if email is unique
        if (isUnique) {
            res.status(409).send({ error: 'Email already exists!' });
            return; 
        }

        // Register user
        const data = await registerUser(email, password);

        // Send response
        res.status(201).setHeader('Authorization', `Bearer ${data.token}`).send(data);
    } 
    
    // Catch errors
    catch (error) {
        res.status(500).send({ error: 'An internal error occurred. Please try again later.' });
    }
})

//Login endpoint
router.post('/login', async (req: Request, res: Response) => {

    // Deconstruct request
    const { email, password } = req.body;

    // Try to login
    try {

        // Check fields
        if (!email || !password) {
            res.status(400).send({ error: 'All fields are required!' });
            return;
        }

        // Get user
        const user = await getUser(email);

        // Check if user exists
        if (!user) {
            res.status(401).send({ error: 'Invalid email or password!' });
            return;
        }

        // Check password
        const isValid = await checkPassword(password, user.password);

        // Check if password is valid
        if (!isValid) {
            res.status(401).send({ error: 'Invalid email or password!' });
            return; 
        }

        // Login user
        const data = await loginUser(user.id.toString());

        // Send response
        res.status(200).setHeader('Authorization', `Bearer ${data.token}`).send(data);
    }
    
    // Catch errors
    catch (error) {

        // Return error
        res.status(500).send({ error: 'An internal error occurred. Please try again later.' });
    }
})

//Export router
export default router;

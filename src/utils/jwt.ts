/**
 * JWT Promisify
 *
 * @module jwt.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

// Import dependencies
import jwt from "jsonwebtoken";

// Sign JWT
export const sign = (payload: object, secret: string, options: jwt.SignOptions) => {

    // Return a new promise
    return new Promise((resolve, reject) => {

        // Sign the token
        jwt.sign(payload, secret, options, (err, token) => {

            // Reject on error
            if (err) return reject(err);

            // Resolve with token
            resolve(token);
        });
    });
}

// Verify JWT
export const verify = (token: string, secret: string, options?: jwt.VerifyOptions) => {
    
    // Return a new promise
    return new Promise((resolve, reject) => {

        // Verify the token
        jwt.verify(token, secret, options, (err, decoded) => {

            // Reject on error
            if (err) return reject(err);

            // Resolve with decoded token
            resolve(decoded);
        });
    });
}
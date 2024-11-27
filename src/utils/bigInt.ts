/**
 * BigInt utilities
 * 
 * @module bigInt.ts
 * @author Daniel Dimitrov <danieldimitrov2304@gmail.com>
 */

// Add a custom `toJSON` method to BigInt's prototype
// Handle BigInt serialization in json responses
export const enableBigIntSerialization = () => {

    // Get the BigInt prototype
    const bigIntPrototype = BigInt.prototype as any;

    // Check if the `toJSON` method is not already defined
    if (!bigIntPrototype.toJSON) {

        // Define a custom `toJSON` method for BigInt
        bigIntPrototype.toJSON = function () {

            // Return the BigInt as a string
            return this.toString();
        };
    }
};

/**
 * Main router
 * 
 * @module router.ts
 * @author vadiim <vadim123bg@gmail.com>
 */


// Import dependencies
import express from "express"
import keyWordsController from "./controllers/keyWordsController"
import sourceController from "./controllers/sourceController"

//Crete a router
const router = express.Router();

//Add controllers to router
router.use(keyWordsController)
router.use(sourceController)

//Export a router
export default router


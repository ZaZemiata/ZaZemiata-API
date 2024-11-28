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
import crawledDataController from "./controllers/crawledDataController"

//Crete a router
const router = express.Router();

//Add controllers to router
router.use(keyWordsController)
router.use(sourceController)
router.use(crawledDataController)

//Export a router
export default router


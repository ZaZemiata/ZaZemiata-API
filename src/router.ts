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
import sourceUrlsController from "./controllers/sourceUrlsController"

//Crete a router
const router = express.Router();

//Add controllers to router
router.use(keyWordsController)
router.use(sourceController)
router.use(crawledDataController)
router.use(sourceUrlsController)

//Export a router
export default router


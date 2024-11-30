/**
 * Main router
 * 
 * @module router.ts
 * @author vadiim <vadim123bg@gmail.com>
 */


// Import dependencies
import express from "express"
import keyWordController from "./controllers/keyWordController"
import sourceController from "./controllers/sourceController"
import crawledDataController from "./controllers/crawledDataController"

//Crete a router
const router = express.Router();

//Add controllers to router
router.use(keyWordController)
router.use(sourceController)
router.use(crawledDataController)

//Export a router
export default router


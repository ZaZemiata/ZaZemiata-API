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
import sourceUrlsController from "./controllers/sourceUrlsController"
import authController from "./controllers/authController"

//Crete a router
const router = express.Router();

//Add controllers to router
router.use(keyWordController)
router.use(sourceController)
router.use(crawledDataController)
router.use(sourceUrlsController)
router.use(authController)

//Export a router
export default router


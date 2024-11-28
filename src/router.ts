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

//Crete a router
const router = express.Router();

//Add controllers to router
router.use(keyWordController)
router.use(sourceController)

//Export a router
export default router


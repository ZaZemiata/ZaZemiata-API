/**
 * JWT Promisify
 *
 * @module jwt.ts
 * @author vadiim <vadim123bg@gmail.com>
 */

//Import dependencies
import util from "util"
import jwt from "jsonwebtoken";

//Promisify
const sign: any = util.promisify(jwt.sign)

const verify: any = util.promisify(jwt.verify);

export default { sign, verify }


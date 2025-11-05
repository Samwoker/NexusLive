import type {Request,Response,   NextFunction } from "express"
import * as tokenService from "../service/token.services.ts"
import { tokenTypes } from "../config/tokens.ts"
import httpStatus from "http-status"

const authenticate = async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization?.split(" ")[1]
    const payload = token ? await tokenService.verifyToken(token,tokenTypes.ACCESS):null
    const user = payload?.user;
    if(!user){
        return res.status(httpStatus.UNAUTHORIZED).json({message:"Unauthorized"})
    }
    (req as any).user = user;
    next()
}

export default authenticate